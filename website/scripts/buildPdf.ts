// Prints the built website to a pdf as one unbroken page

import { usingBrowserPage } from "./browserPage.ts";

await renderPdf({
  websiteDirectoryPath: "./build",
  assetPagesDirectoryPath: "./assetPages",
  pagePath: "/resume/pdf.html",
  pdfFilePath: "./build/assets/resume.pdf",
});

interface RenderPdfApi {
  websiteDirectoryPath: string;
  assetPagesDirectoryPath: string;
  // a page that's always the width it's printed at, whatever the window's
  pagePath: string;
  pdfFilePath: string;
}

async function renderPdf({
  websiteDirectoryPath,
  assetPagesDirectoryPath,
  pagePath,
  pdfFilePath,
}: RenderPdfApi) {
  // CSS pixels are a fixed 1/96 of an inch, in print as on screen
  const cssPixelsPerInch = 96;
  await usingBrowserPage(
    websiteDirectoryPath,
    assetPagesDirectoryPath,
    async (browserPage) => {
      // render the website as it looks on screen, not with print styles
      await browserPage.send("Emulation.setEmulatedMedia", { media: "screen" });
      await browserPage.loadPage(pagePath);
      // the smallest viewport, so the page's size is its content's own
      await browserPage.send("Emulation.setDeviceMetricsOverride", {
        width: 1,
        height: 1,
        deviceScaleFactor: 1,
        mobile: false,
      });
      const { widthPixels, heightPixels } = await browserPage.readPageSize();
      const { data: pdfBase64 } = await browserPage.send<{ data: string }>(
        "Page.printToPDF",
        {
          paperWidth: widthPixels / cssPixelsPerInch,
          // rounded up, since a fraction of a pixel left over spills onto a
          // second page
          paperHeight: Math.ceil(heightPixels) / cssPixelsPerInch,
          marginTop: 0,
          marginBottom: 0,
          marginLeft: 0,
          marginRight: 0,
          printBackground: true,
        },
      );
      await Deno.writeFile(pdfFilePath, Uint8Array.fromBase64(pdfBase64));
    },
  );
}
