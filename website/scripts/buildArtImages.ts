// Shrinks the art's originals in public/assets/originals, up to 24576px
// square, to the images the page shows, plus the image shown when a link to
// the page is shared. What this makes is committed, so building the website
// doesn't need to run it.

import sharp from "sharp";
import {
  ImageEncoding,
  getConfigs_GraphicAsset,
  graphics,
  imageWidths_graphicAsset,
} from "../source/art/images.ts";

await renderArtImages({
  originalsDirectoryPath: "./public/assets/originals",
  imagesDirectoryPath: "./public/assets/art",
  socialImage: {
    pieceName: "005_bb",
    imageFileName: "art.social.png",
    imageWidthPixels: 1200,
    imageHeightPixels: 630,
  },
});

interface RenderArtImagesApi {
  originalsDirectoryPath: string;
  imagesDirectoryPath: string;
  socialImage: {
    pieceName: string;
    imageFileName: string;
    imageWidthPixels: number;
    imageHeightPixels: number;
  };
}

async function renderArtImages({
  originalsDirectoryPath,
  imagesDirectoryPath,
  socialImage,
}: RenderArtImagesApi) {
  // everything in the images directory is made here, so start it empty and
  // nothing stale is left behind
  try {
    Deno.removeSync(imagesDirectoryPath, { recursive: true });
  } catch (someError) {
    if (!(someError instanceof Deno.errors.NotFound)) {
      throw someError;
    }
  }
  Deno.mkdirSync(imagesDirectoryPath, { recursive: true });
  for (const somePiece of graphics) {
    const originalPath =
      `${originalsDirectoryPath}/${somePiece.pieceName}.png`;
    for (
      const someFile of getConfigs_GraphicAsset({
        graphic: somePiece,
        imageWidths_graphicAsset,
      })
    ) {
      const shrunkImage = await shrinkOriginal(originalPath, {
        width: someFile.imageWidth,
      });
      const encodedImage = await encodeImage(
        shrunkImage,
        someFile.imageEncoding,
      );
      await encodedImage.toFile(`${imagesDirectoryPath}/${someFile.fileName}`);
    }
    if (somePiece.pieceName === socialImage.pieceName) {
      // the middle of the piece, cropped to the card link previews use
      const shrunkImage = await shrinkOriginal(originalPath, {
        width: socialImage.imageWidthPixels,
        height: socialImage.imageHeightPixels,
        fit: "cover",
      });
      await sharp(shrunkImage)
        .png({ compressionLevel: 9 })
        .toFile(`${imagesDirectoryPath}/${socialImage.imageFileName}`);
    }
    console.log(`made ${somePiece.pieceName}`);
  }
}

// Shrinks an original as an 8-bit sRGB PNG with no profile. It shrinks in
// linear light, so detail finer than a pixel averages to the tone it has from
// a distance, not the darker one averaging gamma-encoded values gives (about
// 10% darker on the densest pieces). Then it converts the originals' Adobe
// RGB to sRGB, the web's default, which every browser shows the same whether
// or not it reads profiles (Chrome on Android doesn't reliably); this matches
// how Chrome shows the originals themselves on an sRGB screen.
async function shrinkOriginal(
  originalPath: string,
  resizeOptions: sharp.ResizeOptions,
) {
  // sharp refuses images over 268 million pixels unless told otherwise
  const adobeImage = await sharp(originalPath, { limitInputPixels: false })
    .keepIccProfile()
    // Adobe RGB's tone curve is a plain 2.2 gamma; 16 bits keeps the dark
    // tones precise while they're linear
    .pipelineColourspace("rgb16")
    .gamma(2.2)
    .resize({ kernel: "lanczos3", ...resizeOptions })
    .toColourspace("srgb")
    .png({ compressionLevel: 1 })
    .toBuffer();
  // sharp converts through an embedded profile to sRGB by default, and
  // doesn't keep the profile
  return sharp(adobeImage).png({ compressionLevel: 1 }).toBuffer();
}

async function encodeImage(
  shrunkImage: Uint8Array,
  encoding: ImageEncoding,
) {
  switch (encoding.method) {
    case "nearLossless":
      return sharp(shrunkImage).webp({
        nearLossless: true,
        quality: encoding.level,
        effort: 6,
      });
    case "palette": {
      // libimagequant picks the palette and dithers to it; lossless WebP
      // then stores the result exactly
      const paletteImage = await sharp(shrunkImage).png({
        palette: true,
        colours: encoding.colours,
        dither: 1,
        quality: 100,
        effort: 10,
      }).toBuffer();
      return sharp(paletteImage).webp({
        lossless: true,
        quality: 100,
        effort: 6,
      });
    }
  }
}
