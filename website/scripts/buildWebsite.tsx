// Renders the website's pages to static HTML. Each page's module is bundled
// first, along with the one stylesheet it imports: the page's own, which
// lists, with @import, the stylesheets of everything the page shows. The
// bundles only run here, to render the pages; the website itself has no
// scripts.

import * as esbuild from "esbuild";
import { renderToString } from "preact-render-to-string";
import { createElement, FunctionComponent } from "preact";
import type { Props_Page } from "../source/shared/Props_Page.ts";

await renderPages({
  websiteDirectoryPath: "./build",
  // copied into the website as they are: the icons, _headers, and assets/,
  // which holds the fonts, the landing page's video and the art's images
  publicDirectoryPath: "./public",
  // where each page's stylesheet goes, named for the page and its contents,
  // so a changed stylesheet always has a new address.
  // public/_headers relies on that to let browsers keep everything here for a
  // year, so nothing else may go here under a name that stays the same.
  stylesheetDirectoryPath: "assets/css",
  // the pages the build renders into the website's assets, like the resume's
  // pdf: the scripts that render them serve them over the website, but
  // they're not part of it, so they're not deployed
  assetPagesDirectoryPath: "./assetPages",
  // each page's module in source/, which exports the page and imports its
  // stylesheet, and the file the page is written to
  pageDescriptions: [
    {
      modulePath: "source/home/HTML_HomePage.tsx",
      componentName: "HTML_HomePage",
      pageFilePath: "index.html",
    },
    {
      modulePath: "source/art/pages/HTML_ArtPage.tsx",
      componentName: "HTML_ArtPage",
      pageFilePath: "art/index.html",
    },
    {
      modulePath: "source/resume/pages/HTML_ResumePage.tsx",
      componentName: "HTML_ResumePage",
      pageFilePath: "resume/index.html",
    },
    // served by Cloudflare for any address that doesn't exist
    {
      modulePath: "source/notFound/HTML__NotFound_Page.tsx",
      componentName: "HTML__NotFound_Page",
      pageFilePath: "404.html",
    },
  ],
  assetPageDescriptions: [
    // what deno task buildPdf prints to assets/resume.pdf
    {
      modulePath: "source/resume/pages/PDF_ResumePage.tsx",
      componentName: "PDF_ResumePage",
      pageFilePath: "resume/pdf.html",
    },
    // what deno task buildSocialImage makes into assets/resume.social.png
    {
      modulePath: "source/resume/pages/IMAGE_ResumePage.tsx",
      componentName: "IMAGE_ResumePage",
      pageFilePath: "resume/social.html",
    },
  ],
});

interface RenderPagesApi {
  websiteDirectoryPath: string;
  publicDirectoryPath: string;
  stylesheetDirectoryPath: string;
  assetPagesDirectoryPath: string;
  pageDescriptions: Array<PageDescription>;
  assetPageDescriptions: Array<PageDescription>;
}

interface PageDescription {
  modulePath: string;
  componentName: string;
  pageFilePath: string;
}

async function renderPages({
  websiteDirectoryPath,
  publicDirectoryPath,
  stylesheetDirectoryPath,
  assetPagesDirectoryPath,
  pageDescriptions,
  assetPageDescriptions,
}: RenderPagesApi) {
  removeDirectory(websiteDirectoryPath);
  removeDirectory(assetPagesDirectoryPath);
  copyDirectory(publicDirectoryPath, websiteDirectoryPath);
  try {
    await Promise.all([
      ...pageDescriptions.map((somePage) =>
        renderPage({
          ...somePage,
          directoryPath: websiteDirectoryPath,
          stylesheetDirectoryPath,
        })
      ),
      ...assetPageDescriptions.map((somePage) =>
        renderPage({
          ...somePage,
          directoryPath: assetPagesDirectoryPath,
          stylesheetDirectoryPath,
        })
      ),
    ]);
  } finally {
    // esbuild runs as a process of its own, which would keep deno running
    await esbuild.stop();
  }
}

interface RenderPageApi extends PageDescription {
  // the website, or the asset pages
  directoryPath: string;
  stylesheetDirectoryPath: string;
}

async function renderPage({
  modulePath,
  componentName,
  pageFilePath,
  directoryPath,
  stylesheetDirectoryPath,
}: RenderPageApi) {
  const { pageModule, stylesheetFileName, stylesheetText } = await bundlePage({
    modulePath,
    componentName,
  });
  const PageComponent = pageModule[componentName];
  if (typeof PageComponent !== "function") {
    throw new Error(`${modulePath} exports no page ${componentName}`);
  }
  const stylesheetHref = `/${stylesheetDirectoryPath}/${stylesheetFileName}`;
  const stylesheetFilePath = `${directoryPath}${stylesheetHref}`;
  makeParentDirectory(stylesheetFilePath);
  await Deno.writeTextFile(stylesheetFilePath, stylesheetText);
  const pageHtml = renderToString(
    createElement(PageComponent, { stylesheetHref_page: stylesheetHref }),
  );
  const pageFilePathInDirectory = `${directoryPath}/${pageFilePath}`;
  makeParentDirectory(pageFilePathInDirectory);
  await Deno.writeTextFile(
    pageFilePathInDirectory,
    `<!DOCTYPE html>${pageHtml}`,
  );
}

type BundlePageApi = Pick<PageDescription, "modulePath" | "componentName">;

// a page's module, bundled and kept in memory, then loaded straight from its
// code, and the stylesheet esbuild gathers from the one the module imports
async function bundlePage({ modulePath, componentName }: BundlePageApi) {
  const { outputFiles } = await esbuild.build({
    entryPoints: { [componentName]: modulePath },
    bundle: true,
    write: false,
    // esbuild names its output for where it would write it, but it's only
    // held in memory
    outdir: "bundles",
    entryNames: "[name]-[hash]",
    format: "esm",
    platform: "neutral",
    jsx: "automatic",
    jsxImportSource: "preact",
    // preact is loaded by deno, from deno.json's imports, when the bundles
    // run; the fonts' addresses are the website's own, left as they are
    external: ["preact", "preact/*", "/assets/*"],
    logLevel: "warning",
  });
  const moduleFile = outputFiles.find((someFile) =>
    someFile.path.endsWith(".js")
  )!;
  const stylesheetFile = outputFiles.find((someFile) =>
    someFile.path.endsWith(".css")
  );
  if (!stylesheetFile) throw new Error(`${modulePath} imports no stylesheet`);
  const pageModule: Record<string, FunctionComponent<Props_Page>> =
    await import(
      `data:text/javascript;base64,${moduleFile.contents.toBase64()}`
    );
  return {
    pageModule,
    stylesheetFileName: stylesheetFile.path.slice(
      stylesheetFile.path.lastIndexOf("/") + 1,
    ),
    stylesheetText: stylesheetFile.text,
  };
}

function removeDirectory(directoryPath: string) {
  try {
    Deno.removeSync(directoryPath, { recursive: true });
  } catch (someError) {
    if (!(someError instanceof Deno.errors.NotFound)) {
      throw someError;
    }
  }
}

function copyDirectory(fromPath: string, toPath: string) {
  Deno.mkdirSync(toPath, { recursive: true });
  for (const someEntry of Deno.readDirSync(fromPath)) {
    const someFromPath = `${fromPath}/${someEntry.name}`;
    const someToPath = `${toPath}/${someEntry.name}`;
    if (someEntry.isDirectory) {
      copyDirectory(someFromPath, someToPath);
    } else {
      Deno.copyFileSync(someFromPath, someToPath);
    }
  }
}

function makeParentDirectory(filePath: string) {
  Deno.mkdirSync(filePath.slice(0, filePath.lastIndexOf("/")), {
    recursive: true,
  });
}
