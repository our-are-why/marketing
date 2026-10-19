// A page in headless Chromium, for the scripts that render the built website
// to other formats. The browser is driven over its DevTools protocol, so no
// npm packages are needed: https://chromedevtools.github.io/devtools-protocol/
//
// The built website is served to the browser over http, as it is once
// deployed, since its pages link to their styles, fonts and images from the
// site's root, and browsers won't load fonts for a page opened as a file.
// The asset pages are served over it, at their own paths: they use the
// website's styles and fonts, but aren't part of it.
//
// The scripts don't reach into a page: each page they render lays itself out
// at the size it's printed or pictured at, and they only ask the browser how
// big that is.

import { serveDir } from "@std/http/file-server";

export interface BrowserPage {
  send<Result>(method: string, params: object): Promise<Result>;
  // loads an asset page by its path, like /resume/pdf.html, then
  // waits for its fonts too
  loadPage(pagePath: string): Promise<void>;
  // the size of everything on the page, in CSS pixels, as laid out in the
  // current viewport
  readPageSize(): Promise<{ widthPixels: number; heightPixels: number }>;
}

export async function usingBrowserPage<Result>(
  websiteDirectoryPath: string,
  assetPagesDirectoryPath: string,
  usePage: (browserPage: BrowserPage) => Promise<Result>,
): Promise<Result> {
  // port 0 lets the system pick a free port
  const websiteServer = Deno.serve(
    { hostname: "127.0.0.1", port: 0, onListen() {} },
    async (someRequest) => {
      const assetPageResponse = await serveDir(someRequest, {
        fsRoot: assetPagesDirectoryPath,
        quiet: true,
      });
      if (assetPageResponse.status !== 404) {
        return assetPageResponse;
      }
      return serveDir(someRequest, { fsRoot: websiteDirectoryPath, quiet: true });
    },
  );
  try {
    return await usingBrowserPageAt(
      `http://127.0.0.1:${websiteServer.addr.port}`,
      usePage,
    );
  } finally {
    await websiteServer.shutdown();
  }
}

async function usingBrowserPageAt<Result>(
  websiteUrl: string,
  usePage: (browserPage: BrowserPage) => Promise<Result>,
): Promise<Result> {
  // the binary itself: /usr/bin/chromium-headless-shell is a script that
  // stopping it wouldn't stop the browser it started
  const browserCommand = "/usr/lib/chromium/chromium-headless-shell";
  const browserStopper = new AbortController();
  const browserProcess = new Deno.Command(browserCommand, {
    // port 0 lets the browser pick a free port, which it reports on stderr
    args: ["--remote-debugging-port=0", "--hide-scrollbars"],
    stdout: "null",
    stderr: "piped",
    signal: browserStopper.signal,
  }).spawn();
  try {
    const browserConnection = await connectToBrowser(
      await readDevtoolsSocketUrl(browserProcess.stderr),
    );
    const { targetId } = await browserConnection.sendToBrowser<
      { targetId: string }
    >("Target.createTarget", { url: "about:blank" });
    const { sessionId } = await browserConnection.sendToBrowser<
      { sessionId: string }
    >("Target.attachToTarget", { targetId, flatten: true });
    const sendToPage = <Result>(method: string, params: object) =>
      browserConnection.sendToSession<Result>(sessionId, method, params);
    await sendToPage("Page.enable", {});
    return await usePage({
      send: sendToPage,
      async loadPage(pagePath) {
        const [, { errorText }] = await Promise.all([
          browserConnection.waitForEvent(sessionId, "Page.loadEventFired"),
          sendToPage<{ errorText?: string }>("Page.navigate", {
            url: `${websiteUrl}${pagePath}`,
          }),
        ]);
        if (errorText) {
          throw new Error(`couldn't load ${pagePath}: ${errorText}`);
        }
        // the load event doesn't wait for fonts, which only start loading
        // once the text that uses them is laid out
        await sendToPage("Runtime.evaluate", {
          expression: "document.fonts.ready.then(() => null)",
          awaitPromise: true,
        });
      },
      async readPageSize() {
        const { cssContentSize } = await sendToPage<
          { cssContentSize: { width: number; height: number } }
        >("Page.getLayoutMetrics", {});
        return {
          widthPixels: cssContentSize.width,
          heightPixels: cssContentSize.height,
        };
      },
    });
  } finally {
    browserStopper.abort();
    await browserProcess.status;
  }
}

async function readDevtoolsSocketUrl(
  browserErrorStream: ReadableStream<BufferSource>,
) {
  const browserErrorReader = browserErrorStream
    .pipeThrough(new TextDecoderStream())
    .getReader();
  let browserErrorText = "";
  while (true) {
    const { done, value } = await browserErrorReader.read();
    if (done) {
      throw new Error(`browser exited before it was ready:\n${browserErrorText}`);
    }
    browserErrorText += value;
    const socketUrlMatch = browserErrorText.match(
      /DevTools listening on (ws:\/\/\S+)\n/,
    );
    if (socketUrlMatch) {
      // keep reading so the browser never stalls writing to a full pipe
      drainReader(browserErrorReader);
      return socketUrlMatch[1];
    }
  }
}

async function drainReader(someReader: ReadableStreamDefaultReader<string>) {
  try {
    while (!(await someReader.read()).done) {
      // discard the browser's logging
    }
  } catch {
    // the browser was stopped
  }
}

interface BrowserConnection {
  sendToBrowser<Result>(method: string, params: object): Promise<Result>;
  sendToSession<Result>(
    sessionId: string,
    method: string,
    params: object,
  ): Promise<Result>;
  waitForEvent(sessionId: string, method: string): Promise<unknown>;
}

async function connectToBrowser(socketUrl: string): Promise<BrowserConnection> {
  const browserSocket = new WebSocket(socketUrl);
  await new Promise((resolve, reject) => {
    browserSocket.onopen = resolve;
    browserSocket.onerror = () =>
      reject(new Error(`couldn't connect to ${socketUrl}`));
  });
  let lastMessageId = 0;
  // replies are matched to their request by id, events by session and name
  const pendingReplies = new Map<
    number,
    { method: string } & PromiseWithResolvers<unknown>
  >();
  const pendingEvents = new Map<string, PromiseWithResolvers<unknown>>();
  browserSocket.onmessage = ({ data }) => {
    const someMessage = JSON.parse(data);
    if (someMessage.id === undefined) {
      const eventKey = `${someMessage.sessionId} ${someMessage.method}`;
      pendingEvents.get(eventKey)?.resolve(someMessage.params);
      pendingEvents.delete(eventKey);
      return;
    }
    const pendingReply = pendingReplies.get(someMessage.id)!;
    pendingReplies.delete(someMessage.id);
    if (someMessage.error) {
      pendingReply.reject(
        new Error(`${pendingReply.method}: ${someMessage.error.message}`),
      );
    } else {
      pendingReply.resolve(someMessage.result);
    }
  };
  browserSocket.onclose = () => {
    for (
      const somePending of [...pendingReplies.values(), ...pendingEvents.values()]
    ) {
      somePending.reject(new Error("the browser closed the connection"));
    }
  };
  const sendMessage = <Result>(method: string, messageFields: object) => {
    lastMessageId += 1;
    const pendingReply = { method, ...Promise.withResolvers<unknown>() };
    pendingReplies.set(lastMessageId, pendingReply);
    browserSocket.send(
      JSON.stringify({ id: lastMessageId, method, ...messageFields }),
    );
    return pendingReply.promise as Promise<Result>;
  };
  return {
    sendToBrowser<Result>(method: string, params: object) {
      return sendMessage<Result>(method, { params });
    },
    sendToSession<Result>(sessionId: string, method: string, params: object) {
      return sendMessage<Result>(method, { params, sessionId });
    },
    waitForEvent(sessionId: string, method: string) {
      const pendingEvent = Promise.withResolvers<unknown>();
      pendingEvents.set(`${sessionId} ${method}`, pendingEvent);
      return pendingEvent.promise;
    },
  };
}
