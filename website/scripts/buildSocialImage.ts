// Renders the image shown when a link to the resume is shared, from a page
// that's the card itself: the resume's header, framed in the card's shape

import { usingBrowserPage } from "./browserPage.ts";

await renderSocialImage({
  websiteDirectoryPath: "./build",
  assetPagesDirectoryPath: "./assetPages",
  pagePath: "/resume/social.html",
  imageFilePath: "./build/assets/resume.social.png",
  imageWidthPixels: 1200,
  imageHeightPixels: 630,
});

interface RenderSocialImageApi {
  websiteDirectoryPath: string;
  assetPagesDirectoryPath: string;
  // a page that's the card alone, in the image's shape at any size
  pagePath: string;
  imageFilePath: string;
  imageWidthPixels: number;
  imageHeightPixels: number;
}

async function renderSocialImage({
  websiteDirectoryPath,
  assetPagesDirectoryPath,
  pagePath,
  imageFilePath,
  imageWidthPixels,
  imageHeightPixels,
}: RenderSocialImageApi) {
  await usingBrowserPage(
    websiteDirectoryPath,
    assetPagesDirectoryPath,
    async (browserPage) => {
      await browserPage.loadPage(pagePath);
      // the smallest viewport, so the page's size is the card's own
      await browserPage.send("Emulation.setDeviceMetricsOverride", {
        width: 1,
        height: 1,
        deviceScaleFactor: 1,
        mobile: false,
      });
      const { widthPixels, heightPixels } = await browserPage.readPageSize();
      // rendered at the image's own resolution, so the text stays sharp
      const pixelScale = imageWidthPixels / widthPixels;
      if (Math.round(heightPixels * pixelScale) !== imageHeightPixels) {
        throw new Error(
          `${pagePath} is ${widthPixels} by ${heightPixels}, not the shape of a ${imageWidthPixels} by ${imageHeightPixels} image`,
        );
      }
      await browserPage.send("Emulation.setDeviceMetricsOverride", {
        width: widthPixels,
        height: heightPixels,
        deviceScaleFactor: pixelScale,
        mobile: false,
      });
      const { data: imageBase64 } = await browserPage.send<{ data: string }>(
        "Page.captureScreenshot",
        {
          format: "png",
          clip: {
            x: 0,
            y: 0,
            width: widthPixels,
            height: heightPixels,
            scale: 1,
          },
        },
      );
      Deno.mkdirSync(imageFilePath.slice(0, imageFilePath.lastIndexOf("/")), {
        recursive: true,
      });
      await Deno.writeFile(imageFilePath, Uint8Array.fromBase64(imageBase64));
    },
  );
}
