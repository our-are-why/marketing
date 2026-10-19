// how deno task buildArtImages encodes a piece's image at one width, always
// as WebP, which every browser shows: lossless after reducing the piece to a
// palette of colors, or near-lossless at a level
export type ImageEncoding =
  | { method: "palette"; colours: 256 | 16 }
  | { method: "nearLossless"; level: 20 | 40 | 60 };

export interface Graphic {
  pieceName: string;
  dateLabel: string;
  imageDescription: string;
  originalWidth: number;
  originalHeight: number;
  // the encoding at each of imageWidths_graphicAsset: whichever was smallest while
  // still scoring at least 90 on SSIMULACRA2, which is visually lossless,
  // against the piece shrunk with no loss. A piece's best encoding can differ
  // by width.
  imageEncodings: Record<number, ImageEncoding>;
}

export const graphics: Array<Graphic> = [
  {
    pieceName: "005_bb",
    dateLabel: "2026",
    imageDescription: "a black and white digital square pattern",
    originalWidth: 16329,
    originalHeight: 10206,
    imageEncodings: {
      804: { method: "palette", colours: 16 },
      1206: { method: "palette", colours: 16 },
      1608: { method: "palette", colours: 16 },
    },
  },
  {
    pieceName: "005_aa",
    dateLabel: "2026",
    imageDescription: "a black and white digital square pattern",
    originalWidth: 20366,
    originalHeight: 12728,
    imageEncodings: {
      804: { method: "palette", colours: 16 },
      1206: { method: "palette", colours: 16 },
      1608: { method: "palette", colours: 16 },
    },
  },
  {
    pieceName: "004_bb",
    dateLabel: "~2016-2015",
    imageDescription: "a multi-color digital square pattern",
    originalWidth: 24576,
    originalHeight: 24576,
    imageEncodings: {
      804: { method: "nearLossless", level: 40 },
      1206: { method: "nearLossless", level: 40 },
      1608: { method: "nearLossless", level: 40 },
    },
  },
  {
    pieceName: "004_aa",
    dateLabel: "~2016-2015",
    imageDescription: "a multi-color digital square pattern",
    originalWidth: 24576,
    originalHeight: 24576,
    imageEncodings: {
      804: { method: "nearLossless", level: 40 },
      1206: { method: "nearLossless", level: 40 },
      1608: { method: "nearLossless", level: 40 },
    },
  },
  {
    pieceName: "003_bb",
    dateLabel: "~2015",
    imageDescription: "a tri-color digital square pattern",
    originalWidth: 24576,
    originalHeight: 24576,
    imageEncodings: {
      804: { method: "nearLossless", level: 40 },
      1206: { method: "nearLossless", level: 40 },
      1608: { method: "palette", colours: 256 },
    },
  },
  {
    pieceName: "003_aa",
    dateLabel: "~2015",
    imageDescription: "a tri-color digital square pattern",
    originalWidth: 24576,
    originalHeight: 24576,
    imageEncodings: {
      804: { method: "nearLossless", level: 40 },
      1206: { method: "nearLossless", level: 40 },
      1608: { method: "palette", colours: 256 },
    },
  },
  {
    pieceName: "002_aa",
    dateLabel: "~2015-2014",
    imageDescription: "a quad-color digital square pattern",
    originalWidth: 20000,
    originalHeight: 20000,
    imageEncodings: {
      804: { method: "palette", colours: 256 },
      1206: { method: "palette", colours: 256 },
      1608: { method: "palette", colours: 256 },
    },
  },
  {
    pieceName: "001_aa",
    dateLabel: "~2014",
    imageDescription: "a sea moss and burgundy digital square pattern",
    originalWidth: 16000,
    originalHeight: 16000,
    imageEncodings: {
      804: { method: "palette", colours: 256 },
      1206: { method: "palette", colours: 256 },
      1608: { method: "palette", colours: 256 },
    },
  },
  {
    pieceName: "000_bb",
    dateLabel: "~2014-2013",
    imageDescription: "a red/orange and black digital square pattern",
    originalWidth: 20000,
    originalHeight: 20000,
    imageEncodings: {
      804: { method: "palette", colours: 256 },
      1206: { method: "palette", colours: 256 },
      1608: { method: "palette", colours: 256 },
    },
  },
  {
    pieceName: "000_aa",
    dateLabel: "~2014-2013",
    imageDescription: "a lime, teal and black digital square pattern",
    originalWidth: 20000,
    originalHeight: 20000,
    imageEncodings: {
      804: { method: "palette", colours: 256 },
      1206: { method: "palette", colours: 256 },
      1608: { method: "palette", colours: 256 },
    },
  }, 
];

// the widths each piece's image is made at. The page shows images at most
// 804px wide (its 832px content, less the sections' padding), so these are
// that at 1x, 1.5x and 2x screen density; browsers pick the smallest that's
// still sharp on theirs.
export const imageWidths_graphicAsset = [804, 1206, 1608];

export interface Api__getConfigs_GraphicAsset {
  graphic: Graphic;
  imageWidths_graphicAsset: Array<number>;
}

export function getConfigs_GraphicAsset({
  graphic,
  imageWidths_graphicAsset,
}: Api__getConfigs_GraphicAsset) {
  return imageWidths_graphicAsset.map((imageWidth_current) => ({
    imageWidth: imageWidth_current,
    imageEncoding: graphic.imageEncodings[imageWidth_current],
    fileName: `${graphic.pieceName}-${imageWidth_current}.webp`,
  }));
}

export const [
  graphic_latest,
  ...graphics_subsequent
] = graphics;
