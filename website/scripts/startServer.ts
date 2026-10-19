// Serves the built website to preview it, as Cloudflare Pages does once it's
// deployed: an address that doesn't exist gets 404.html, with a 404 status.

import { serveDir, serveFile } from "@std/http/file-server";

await startServer({
  websiteDirectoryPath: "./build",
  notFoundPagePath: "./build/404.html",
  port: 8000,
});

interface StartServerApi {
  websiteDirectoryPath: string;
  notFoundPagePath: string;
  port: number;
}

async function startServer({
  websiteDirectoryPath,
  notFoundPagePath,
  port,
}: StartServerApi) {
  await Deno.serve({ port }, async (someRequest) => {
    const websiteResponse = await serveDir(someRequest, {
      fsRoot: websiteDirectoryPath,
      showDirListing: false,
      quiet: true,
    });
    if (websiteResponse.status !== 404) {
      return websiteResponse;
    }
    const notFoundPage = await serveFile(someRequest, notFoundPagePath);
    return new Response(notFoundPage.body, {
      status: 404,
      headers: notFoundPage.headers,
    });
  }).finished;
}
