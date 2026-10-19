// Build the MOO US Standard business card (3.5" x 2") as print-ready PDFs:
//   out/front.pdf           the logo in black ink only; the one to upload
//   out/back.pdf            QR code, name and email, in black and the
//                           website's purple
//   out/card.pdf            front.pdf and back.pdf as pages 1 and 2
//   out/front-raised-gloss.pdf  where the raised spot gloss goes on the front:
//                           the wordmark, black on white
//   out/front-original.pdf  the logo JPEG embedded byte for byte, in RGB
//
// Pages are the bleed size, 3.66" x 2.16", with TrimBox and BleedBox set.
// The logo is scaled so its artwork fills MOO's safe area.
//
// front.pdf protects the logo's dither. The art is pure black and white; its
// in-between greys are JPEG blur along the black/white edges. The JPEG's
// luma, thresholded at mid-grey, becomes a 1-bit stencil at the image's
// native pixel size, no resampling, filled with 100% K: each pixel prints as
// solid black ink or bare paper, never as halftone dots or four-ink black.
// front-original.pdf keeps the untouched JPEG for comparison; the printer
// converts its RGB itself.
//
// The back is vector, with the text converted to outlines; each element's
// ink is set in `back`.
//
// Usage: deno run --allow-read --allow-write scripts/buildCard.ts
//
// The caller guarantees:
//   - ../assets/ourarewhy.original.jpg exists, relative to this
//     project, and is a baseline YCbCr JPEG
//   - ../assets/fonts/ holds Courier Prime Regular and Bold Italic, the
//     website's typeface (licence in ../assets/fonts/OFL.txt)

import ClipperLib from "npm:clipper-lib@6.4.2";
import jpeg from "npm:jpeg-js@0.4.4";
import opentype from "npm:opentype.js@1.3.4";
import QRCode from "npm:qrcode@1.5.4";
import { deflateSync } from "node:zlib";

const projectDir = new URL("..", import.meta.url).pathname;
const logoPath = `${projectDir}../assets/ourarewhy.original.jpg`;
const fontsDir = `${projectDir}../assets/fonts`;
const outDir = `${projectDir}out`;

// MOO US Standard, in points (72 per inch)
const inch = 72;
const bleed = 0.08 * inch;
const trimWidth = 3.5 * inch;
const trimHeight = 2 * inch;
const pageWidth = trimWidth + 2 * bleed;
const pageHeight = trimHeight + 2 * bleed;
const safeInset = 0.08 * inch; // inside the trim

// Black is black ink alone, for crisp edges. Purple is the website's
// #5e4d75 for GRACoL 2006 Coated, MOO's press profile, without yellow: three
// inks rather than four keep small text sharper, and it prints within
// ΔE2000 0.13 of the screen colour (LittleCMS, relative colorimetric).
const black = "0 0 0 1 k";
const purple = "0.53 0.6 0 0.44 k";

// Back layout, measured from the approved MOO preview; distances are from
// the trim's top edge, and everything is centred horizontally. The email
// keeps its gap below the name at any size, and the whole group is then
// centred vertically on the trim. Sizes meet MOO's special-finish minimums
// (text 10pt, lines 1pt), stricter than plain cards' 8pt and 0.5pt.
const back = {
  qrText: "https://our.are.why.soy",
  qrErrorCorrection: "M",
  qrSide: 0.686 * inch,
  qrTop: 0.403 * inch,
  // Struck through with the font's own strikeout position and thickness, as
  // a browser draws line-through
  name: "jared mathews",
  nameFont: "CourierPrime-Regular.ttf",
  nameSize: 16,
  // pt shaved off each side of every stroke, for a lighter weight of the
  // same monoline design; the strikethrough thins to match, down to
  // nameStrikeMin. 0 is the font as drawn; 0.065 leaves the stems at 1pt.
  nameThinning: 0.065,
  nameStrikeMin: 1, // pt
  nameBaseline: 1.4257 * inch,
  email: "our.are.why@gmail.com",
  emailFont: "CourierPrime-BoldItalic.ttf",
  emailSize: 10,
  // Where the email's baseline sat at 8pt, the size it was measured at
  emailBaseline8pt: 1.6057 * inch,
  // Ink per element; the strikethrough takes the name's
  qrInk: purple,
  nameInk: black,
  emailInk: purple,
};

const fmt = (n: number) => {
  const s = n.toFixed(4).replace(/\.?0+$/, "");
  return s === "-0" ? "0" : s;
};

// Distance from the trim's top edge -> PDF y (origin at the page's bottom)
const yFromTrimTop = (d: number) => pageHeight - bleed - d;

// ---- Front: the logo JPEG ------------------------------------------------

interface Jpeg {
  bytes: Uint8Array;
  width: number;
  height: number;
  components: number;
}

function readJpeg(path: string): Jpeg {
  const bytes = Deno.readFileSync(path);
  let i = 2;
  while (i < bytes.length) {
    const marker = bytes[i + 1];
    const length = (bytes[i + 2] << 8) | bytes[i + 3];
    // Baseline or progressive frame header
    if (marker === 0xc0 || marker === 0xc1 || marker === 0xc2) {
      return {
        bytes,
        height: (bytes[i + 5] << 8) | bytes[i + 6],
        width: (bytes[i + 7] << 8) | bytes[i + 8],
        components: bytes[i + 9],
      };
    }
    i += 2 + length;
  }
  throw new Error(`no JPEG frame header in ${path}`);
}

interface Stencil {
  bits: Uint8Array; // rows packed MSB first, padded to whole bytes
  width: number;
  height: number;
  inkFraction: number;
}

// The JPEG's luma thresholded at mid-grey, at its native pixel size. A 0 bit
// paints, as an ImageMask's default /Decode [0 1] expects.
function logoStencil(logo: Jpeg): Stencil {
  // colorTransform: false keeps YCbCr, so channel 0 is the decoded luma
  // itself rather than one recomputed from rounded RGB
  const { width, height, data } = jpeg.decode(logo.bytes, {
    useTArray: true,
    formatAsRGBA: true,
    colorTransform: false,
    maxMemoryUsageInMB: 2048,
  });
  const rowBytes = Math.ceil(width / 8);
  const bits = new Uint8Array(rowBytes * height).fill(0xff);
  let ink = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4] < 128) {
        bits[y * rowBytes + (x >> 3)] &= ~(0x80 >> (x & 7));
        ink++;
      }
    }
  }
  return { bits, width, height, inkFraction: ink / (width * height) };
}

// The artwork's bounding box in image pixels, inclusive: pixels darker than
// mid-grey. Measured on ourarewhy.original.jpg; it centres the artwork on
// the card and scales it to the safe area.
const logoArtwork = { left: 218, top: 176, right: 2581, bottom: 1533 };

// The logo placed on the page; inBlack paints it with the current fill
// colour, set to 100% K, as a stencil needs
function frontContent(logo: Jpeg, inBlack: boolean) {
  const artWidth = logoArtwork.right - logoArtwork.left + 1;
  const artHeight = logoArtwork.bottom - logoArtwork.top + 1;
  const safeWidth = trimWidth - 2 * safeInset;
  const safeHeight = trimHeight - 2 * safeInset;
  const scale = Math.min(safeWidth / artWidth, safeHeight / artHeight);
  // Centre the artwork, not the image, on the trim
  const artCentreX = (logoArtwork.left + logoArtwork.right + 1) / 2;
  const artCentreY = (logoArtwork.top + logoArtwork.bottom + 1) / 2;
  const x = pageWidth / 2 - artCentreX * scale;
  const top = pageHeight / 2 + artCentreY * scale;
  const width = logo.width * scale;
  const height = logo.height * scale;
  const ppi = inch / scale;
  return {
    stream: `q ${inBlack ? `${black} ` : ""}${fmt(width)} 0 0 ${fmt(height)} ${fmt(x)} ${
      fmt(top - height)
    } cm /Logo Do Q\n`,
    ppi,
    // Image pixel (column, row) -> page point
    toPage: (col: number, row: number) => [x + col * scale, top - row * scale],
  };
}

// ---- Front: raised spot gloss on the wordmark -----------------------------

// Square morphology on a 0/1 mask: erode (min) or dilate (max) with a
// size x size square, done as two 1-D passes
function morph(mask: Uint8Array, width: number, height: number, size: number, erode: boolean) {
  const r = size >> 1;
  const pass = (src: Uint8Array, horizontal: boolean) => {
    const out = new Uint8Array(src.length);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let v = erode ? 1 : 0;
        for (let d = -r; d <= r; d++) {
          const xx = horizontal ? x + d : x, yy = horizontal ? y : y + d;
          const s = xx < 0 || yy < 0 || xx >= width || yy >= height ? 0 : src[yy * width + xx];
          if (erode ? !s : s) {
            v = erode ? 0 : 1;
            break;
          }
        }
        out[y * width + x] = v;
      }
    }
    return out;
  };
  return pass(pass(mask, true), false);
}

// The gloss area, in image pixels: the wordmark's solid letters and periods.
// From the stencil's own pixels: an opening removes the checkered drop shadow
// (its dots are about 0.5pt, under MOO's 1pt minimum); the components that
// start above the tagline are the wordmark; a choke keeps the gloss off the
// letters' edges, so a slightly misregistered gloss pass can't show on the
// paper; a last opening drops anything left thinner than 1pt.
const gloss = {
  shadowOpening: 15, // px, wider than the dither's dots
  wordmarkMaxTop: 520, // px; the tagline's components start at 563
  choke: 4, // px per side, 0.14mm at 738 ppi
  minFeature: 11, // px, just over 1pt
};

function glossMask(stencil: Stencil) {
  const { width, height, bits } = stencil;
  const rowBytes = Math.ceil(width / 8);
  const ink = new Uint8Array(width * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      ink[y * width + x] = (bits[y * rowBytes + (x >> 3)] >> (7 - (x & 7))) & 1 ? 0 : 1;
    }
  }
  const open = (m: Uint8Array, size: number) => morph(morph(m, width, height, size, true), width, height, size, false);
  const solid = open(ink, gloss.shadowOpening);

  // Keep the 4-connected components that start above the tagline
  const keep = new Uint8Array(width * height);
  const seen = new Uint8Array(width * height);
  let components = 0;
  for (let i = 0; i < solid.length; i++) {
    if (!solid[i] || seen[i]) continue;
    const pixels: number[] = [];
    const stack = [i];
    seen[i] = 1;
    let top = height;
    while (stack.length) {
      const p = stack.pop()!;
      pixels.push(p);
      const x = p % width, y = (p / width) | 0;
      top = Math.min(top, y);
      for (const [q, ok] of [[p - 1, x > 0], [p + 1, x < width - 1], [p - width, y > 0], [p + width, y < height - 1]] as const) {
        if (ok && solid[q] && !seen[q]) {
          seen[q] = 1;
          stack.push(q);
        }
      }
    }
    if (top < gloss.wordmarkMaxTop) {
      components++;
      for (const p of pixels) keep[p] = 1;
    }
  }

  const choked = morph(keep, width, height, 2 * gloss.choke + 1, true);
  const mask = open(choked, gloss.minFeature);
  return { mask, ink, components };
}

// A 0/1 pixel mask's outlines as closed polygons in pixel corner
// coordinates, each boundary edge directed with the mask on its left
function traceMask(mask: Uint8Array, width: number, height: number) {
  const at = (x: number, y: number) => x >= 0 && y >= 0 && x < width && y < height && mask[y * width + x] === 1;
  // Directed edges keyed by start corner; rows grow downward
  const edges = new Map<number, number[]>();
  const key = (x: number, y: number) => y * (width + 1) + x;
  const addEdge = (x0: number, y0: number, x1: number, y1: number) => {
    const k = key(x0, y0);
    const list = edges.get(k);
    if (list) list.push(key(x1, y1));
    else edges.set(k, [key(x1, y1)]);
  };
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (!at(x, y)) continue;
      if (!at(x, y - 1)) addEdge(x + 1, y, x, y); // top, leftward
      if (!at(x, y + 1)) addEdge(x, y + 1, x + 1, y + 1); // bottom, rightward
      if (!at(x - 1, y)) addEdge(x, y, x, y + 1); // left, downward
      if (!at(x + 1, y)) addEdge(x + 1, y + 1, x + 1, y); // right, upward
    }
  }
  const loops: [number, number][][] = [];
  for (const [start, list] of edges) {
    while (list.length) {
      const loop: [number, number][] = [];
      let k = start;
      let next = list.pop()!;
      loop.push([k % (width + 1), Math.floor(k / (width + 1))]);
      while (next !== start) {
        k = next;
        loop.push([k % (width + 1), Math.floor(k / (width + 1))]);
        const out = edges.get(k)!;
        next = out.pop()!;
      }
      // Drop corners that sit on a straight run
      const simple = loop.filter((p, i) => {
        const a = loop[(i + loop.length - 1) % loop.length], b = loop[(i + 1) % loop.length];
        return !((a[0] === p[0] && p[0] === b[0]) || (a[1] === p[1] && p[1] === b[1]));
      });
      loops.push(simple);
    }
  }
  return loops;
}

function glossContent(stencil: Stencil, toPage: (col: number, row: number) => number[]) {
  const { mask, ink, components } = glossMask(stencil);
  const loops = traceMask(mask, stencil.width, stencil.height);
  let path = "";
  for (const loop of loops) {
    path += loop.map(([c, r], i) => {
      const [px, py] = toPage(c, r);
      return `${fmt(px)} ${fmt(py)} ${i ? "l" : "m"}`;
    }).join("\n") + "\nh\n";
  }
  // Black marks the gloss; even-odd fill, since the loops never cross
  return { stream: `0 g\n${path}f*\n`, mask, ink, components, loops: loops.length };
}

// ---- Back: QR code and outlined text --------------------------------------

// The QR code with its top edge at `top`, in PDF space
function qrContent(top: number) {
  const qr = QRCode.create(back.qrText, {
    errorCorrectionLevel: back.qrErrorCorrection,
  });
  const n = qr.modules.size;
  const module = back.qrSide / n;
  const left = (pageWidth - back.qrSide) / 2;
  // One rectangle per horizontal run of dark modules, all in one path
  let path = "";
  for (let row = 0; row < n; row++) {
    let col = 0;
    while (col < n) {
      if (!qr.modules.get(row, col)) {
        col++;
        continue;
      }
      const start = col;
      while (col < n && qr.modules.get(row, col)) col++;
      path += `${fmt(left + start * module)} ${fmt(top - (row + 1) * module)} ${
        fmt((col - start) * module)
      } ${fmt(module)} re\n`;
    }
  }
  return { stream: `${back.qrInk}\n${path}f\n`, version: qr.version, size: n, module };
}

// A glyph run as PDF path operators, starting at (x, baseline) in PDF space
function textPath(font: opentype.Font, text: string, size: number, x: number, baseline: number) {
  // opentype.js gives y-down coordinates; flip around the baseline
  const path = font.getPath(text, 0, 0, size);
  const px = (v: number) => fmt(x + v);
  const py = (v: number) => fmt(baseline - v);
  let out = "";
  let cx = 0, cy = 0;
  for (const c of path.commands) {
    switch (c.type) {
      case "M":
        out += `${px(c.x)} ${py(c.y)} m\n`;
        [cx, cy] = [c.x, c.y];
        break;
      case "L":
        out += `${px(c.x)} ${py(c.y)} l\n`;
        [cx, cy] = [c.x, c.y];
        break;
      case "Q": {
        // Quadratic -> cubic Bezier
        const c1x = cx + (2 / 3) * (c.x1 - cx), c1y = cy + (2 / 3) * (c.y1 - cy);
        const c2x = c.x + (2 / 3) * (c.x1 - c.x), c2y = c.y + (2 / 3) * (c.y1 - c.y);
        out += `${px(c1x)} ${py(c1y)} ${px(c2x)} ${py(c2y)} ${px(c.x)} ${py(c.y)} c\n`;
        [cx, cy] = [c.x, c.y];
        break;
      }
      case "C":
        out += `${px(c.x1)} ${py(c.y1)} ${px(c.x2)} ${py(c.y2)} ${px(c.x)} ${py(c.y)} c\n`;
        [cx, cy] = [c.x, c.y];
        break;
      case "Z":
        out += "h\n";
        break;
    }
  }
  return out;
}

// A glyph run with every stroke inset by `thinning` pt, as PDF path
// operators: outlines flattened finely, merged, and offset inward
function thinnedTextPath(
  font: opentype.Font,
  text: string,
  size: number,
  x: number,
  baseline: number,
  thinning: number,
) {
  const C = ClipperLib;
  const unit = 10000; // Clipper's integer units per point
  const steps = 32; // segments per Bezier curve
  const outlines: { X: number; Y: number }[][] = [];
  let poly: { X: number; Y: number }[] = [];
  let cx = 0, cy = 0;
  const point = (px: number, py: number) => poly.push({ X: Math.round((x + px) * unit), Y: Math.round((baseline - py) * unit) });
  for (const c of font.getPath(text, 0, 0, size).commands) {
    if (c.type === "M") {
      if (poly.length) outlines.push(poly);
      poly = [];
      point(c.x, c.y);
    } else if (c.type === "L") {
      point(c.x, c.y);
    } else if (c.type === "Q") {
      for (let i = 1; i <= steps; i++) {
        const t = i / steps, a = (1 - t) ** 2, b = 2 * (1 - t) * t, d = t * t;
        point(a * cx + b * c.x1 + d * c.x, a * cy + b * c.y1 + d * c.y);
      }
    } else if (c.type === "C") {
      for (let i = 1; i <= steps; i++) {
        const t = i / steps, a = (1 - t) ** 3, b = 3 * (1 - t) ** 2 * t, e = 3 * (1 - t) * t * t, d = t ** 3;
        point(a * cx + b * c.x1 + e * c.x2 + d * c.x, a * cy + b * c.y1 + e * c.y2 + d * c.y);
      }
    } else if (c.type === "Z") {
      if (poly.length) outlines.push(poly);
      poly = [];
    }
    if ("x" in c) [cx, cy] = [c.x, c.y];
  }
  if (poly.length) outlines.push(poly);

  const merged: { X: number; Y: number }[][] = [];
  const clipper = new C.Clipper();
  clipper.AddPaths(outlines, C.PolyType.ptSubject, true);
  clipper.Execute(C.ClipType.ctUnion, merged, C.PolyFillType.pftNonZero, C.PolyFillType.pftNonZero);
  const thinned: { X: number; Y: number }[][] = [];
  const offset = new C.ClipperOffset(2, 0.0005 * unit);
  offset.AddPaths(merged, C.JoinType.jtRound, C.EndType.etClosedPolygon);
  offset.Execute(thinned, -thinning * unit);

  let out = "";
  for (const p of thinned) {
    out += p.map((pt, i) => `${fmt(pt.X / unit)} ${fmt(pt.Y / unit)} ${i ? "l" : "m"}`).join("\n") + "\nh\n";
  }
  return out;
}

function backContent() {
  const loadFont = (file: string) => opentype.parse(Deno.readFileSync(`${fontsDir}/${file}`).buffer);
  const nameFont = loadFont(back.nameFont);
  const emailFont = loadFont(back.emailFont);

  // Vertical layout, as distances below the trim's top edge. The email's
  // tallest letters keep the gap they had below the name at 8pt.
  const inkTop = (font: opentype.Font, text: string, size: number) => -font.getPath(text, 0, 0, size).getBoundingBox().y1;
  const inkBottom = (font: opentype.Font, text: string, size: number) => font.getPath(text, 0, 0, size).getBoundingBox().y2;
  const emailBaseline = back.emailBaseline8pt +
    inkTop(emailFont, back.email, back.emailSize) - inkTop(emailFont, back.email, 8);
  // Then the group, QR top to email bottom, is centred on the trim
  const groupTop = back.qrTop;
  const groupBottom = emailBaseline + inkBottom(emailFont, back.email, back.emailSize);
  const shift = trimHeight / 2 - (groupTop + groupBottom) / 2;

  // Centred on the advance width, as text-align: center does
  const nameAdvance = nameFont.getAdvanceWidth(back.name, back.nameSize);
  const nameX = (pageWidth - nameAdvance) / 2;
  const nameBaseline = yFromTrimTop(back.nameBaseline + shift);
  const em = back.nameSize / nameFont.unitsPerEm;
  // OS/2 gives the top of the strikeout stroke, above the baseline. Thinning
  // trims both of its edges, as it does the letters', down to nameStrikeMin;
  // it stays centred where the font puts it.
  const thinning = back.nameThinning;
  const fontStrike = nameFont.tables.os2.yStrikeoutSize * em;
  const strikeCentre = nameBaseline + nameFont.tables.os2.yStrikeoutPosition * em - fontStrike / 2;
  const strikeThickness = Math.max(fontStrike - 2 * thinning, back.nameStrikeMin);
  const strikeY = strikeCentre - strikeThickness / 2;
  const namePath = thinning > 0
    ? thinnedTextPath(nameFont, back.name, back.nameSize, nameX, nameBaseline, thinning)
    : textPath(nameFont, back.name, back.nameSize, nameX, nameBaseline);

  const emailAdvance = emailFont.getAdvanceWidth(back.email, back.emailSize);
  const emailX = (pageWidth - emailAdvance) / 2;

  const qr = qrContent(yFromTrimTop(back.qrTop + shift));
  // The strikethrough is filled on its own: in one path with the glyphs, its
  // winding could cancel theirs where they overlap and leave white gaps
  const stream = qr.stream +
    `${back.nameInk}\n` +
    namePath + "f\n" +
    `${fmt(nameX)} ${fmt(strikeY)} ${fmt(nameAdvance)} ${fmt(strikeThickness)} re\nf\n` +
    `${back.emailInk}\n` +
    textPath(emailFont, back.email, back.emailSize, emailX, yFromTrimTop(emailBaseline + shift)) +
    "f\n";
  return { stream, qr, strikeThickness, shift };
}

// ---- PDF writer -----------------------------------------------------------

interface Page {
  content: string;
  // The page's /Logo image: the JPEG as is, or a 1-bit stencil
  logo?: Jpeg;
  stencil?: Stencil;
}

function buildPdf(pages: Page[], title: string): Uint8Array {
  const enc = new TextEncoder();
  const objects: Uint8Array[][] = [];
  const add = (...parts: (string | Uint8Array)[]) => {
    objects.push(parts.map((p) => typeof p === "string" ? enc.encode(p) : p));
    return objects.length;
  };
  const stream = (dict: string, data: Uint8Array) =>
    [`<< ${dict} /Length ${data.length} >>\nstream\n`, data, "\nendstream"] as const;

  const catalog = add(""); // filled in below
  const pagesObj = add("");
  const info = add(`<< /Title (${title}) /Producer (buildCard.ts) >>`);
  const kids: number[] = [];
  for (const page of pages) {
    let resources = "<< >>";
    if (page.logo) {
      const { bytes, width, height, components } = page.logo;
      const colorSpace = components === 1 ? "/DeviceGray" : components === 4 ? "/DeviceCMYK" : "/DeviceRGB";
      const image = add(...stream(
        `/Type /XObject /Subtype /Image /Width ${width} /Height ${height} /ColorSpace ${colorSpace} /BitsPerComponent 8 /Filter /DCTDecode` +
          (components === 4 ? " /Decode [1 0 1 0 1 0 1 0]" : ""),
        bytes,
      ));
      resources = `<< /XObject << /Logo ${image} 0 R >> >>`;
    } else if (page.stencil) {
      const { bits, width, height } = page.stencil;
      const image = add(...stream(
        `/Type /XObject /Subtype /Image /Width ${width} /Height ${height} /ImageMask true /BitsPerComponent 1 /Filter /FlateDecode`,
        deflateSync(bits, { level: 9 }),
      ));
      resources = `<< /XObject << /Logo ${image} 0 R >> >>`;
    }
    const content = add(...stream("/Filter /FlateDecode", deflateSync(enc.encode(page.content), { level: 9 })));
    const box = (inset: number) =>
      `[${fmt(inset)} ${fmt(inset)} ${fmt(pageWidth - inset)} ${fmt(pageHeight - inset)}]`;
    kids.push(add(
      `<< /Type /Page /Parent ${pagesObj} 0 R /MediaBox ${box(0)} /BleedBox ${box(0)} /TrimBox ${box(bleed)} ` +
        `/Resources ${resources} /Contents ${content} 0 R >>`,
    ));
  }
  objects[catalog - 1] = [enc.encode(`<< /Type /Catalog /Pages ${pagesObj} 0 R >>`)];
  objects[pagesObj - 1] = [enc.encode(`<< /Type /Pages /Kids [${kids.map((k) => `${k} 0 R`).join(" ")}] /Count ${kids.length} >>`)];

  const chunks: Uint8Array[] = [enc.encode("%PDF-1.4\n%\xe2\xe3\xcf\xd3\n")];
  let offset = chunks[0].length;
  const offsets: number[] = [];
  objects.forEach((parts, i) => {
    offsets.push(offset);
    const all = [enc.encode(`${i + 1} 0 obj\n`), ...parts, enc.encode("\nendobj\n")];
    for (const p of all) {
      chunks.push(p);
      offset += p.length;
    }
  });
  const xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n` +
    offsets.map((o) => `${String(o).padStart(10, "0")} 00000 n \n`).join("") +
    `trailer\n<< /Size ${objects.length + 1} /Root ${catalog} 0 R /Info ${info} 0 R >>\nstartxref\n${offset}\n%%EOF\n`;
  chunks.push(enc.encode(xref));
  const out = new Uint8Array(chunks.reduce((n, c) => n + c.length, 0));
  let p = 0;
  for (const c of chunks) {
    out.set(c, p);
    p += c.length;
  }
  return out;
}

// ---- Build ----------------------------------------------------------------

const logo = readJpeg(logoPath);
const stencil = logoStencil(logo);
const front = frontContent(logo, true);
const frontOriginal = frontContent(logo, false);
const backSide = backContent();
const frontGloss = glossContent(stencil, front.toPage);

Deno.mkdirSync(outDir, { recursive: true });
const frontPage = { content: front.stream, stencil };
const frontOriginalPage = { content: frontOriginal.stream, logo };
const backPage = { content: backSide.stream };
Deno.writeFileSync(`${outDir}/front.pdf`, buildPdf([frontPage], "Business card - front"));
Deno.writeFileSync(`${outDir}/back.pdf`, buildPdf([backPage], "Business card - back"));
Deno.writeFileSync(`${outDir}/card.pdf`, buildPdf([frontPage, backPage], "Business card"));
Deno.writeFileSync(
  `${outDir}/front-raised-gloss.pdf`,
  buildPdf([{ content: frontGloss.stream }], "Business card - front, raised spot gloss"),
);
Deno.writeFileSync(
  `${outDir}/front-original.pdf`,
  buildPdf([frontOriginalPage], "Business card - front, original JPEG"),
);

console.log(
  `front: ${stencil.width}x${stencil.height} 1-bit stencil in 100% K at ${front.ppi.toFixed(0)} ppi, ` +
    `${(stencil.inkFraction * 100).toFixed(2)}% ink`,
);
const glossPixels = frontGloss.mask.reduce((n, v) => n + v, 0);
console.log(
  `front-raised-gloss: ${frontGloss.components} wordmark marks, ${frontGloss.loops} outlines, ` +
    `${(glossPixels / (front.ppi / inch) ** 2 / (trimWidth * trimHeight) * 100).toFixed(1)}% of the card`,
);
console.log(`front-original: ${logo.width}x${logo.height} JPEG, embedded unchanged`);
console.log(
  `back: QR version ${backSide.qr.version} (${backSide.qr.size}x${backSide.qr.size}), ` +
    `module ${(backSide.qr.module / inch * 25.4).toFixed(3)} mm; strikethrough ${backSide.strikeThickness.toFixed(2)} pt; group moved ${(backSide.shift / inch).toFixed(4)}" to centre`,
);
console.log(`wrote ${outDir}/front.pdf, back.pdf, card.pdf, front-raised-gloss.pdf, front-original.pdf`);
