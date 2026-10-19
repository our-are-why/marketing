// Makes the fonts the site serves, in public/assets/fonts, from Courier
// Prime's TTFs in ../assets/fonts: each cut down to the latin characters
// (the set Google Fonts serves as "latin": Basic Latin, Latin-1, and the
// common punctuation and symbols), which covers all the site's text, and
// compressed as WOFF2. What this makes is committed, so building the website
// doesn't need to run it.

import subsetFont from "subset-font";
import { Buffer } from "node:buffer";

await makeFonts({
  originalsDirectoryPath: "../assets/fonts",
  fontsDirectoryPath: "./public/assets/fonts",
  fontNames: [
    "CourierPrime-Regular",
    "CourierPrime-Italic",
    "CourierPrime-Bold",
    "CourierPrime-BoldItalic",
  ],
  characterRanges: [
    [0x0d, 0x0d],
    [0x20, 0x7e],
    [0xa0, 0xff],
    [0x131, 0x131],
    [0x152, 0x153],
    [0x2c6, 0x2c6],
    [0x2da, 0x2da],
    [0x2dc, 0x2dc],
    [0x2013, 0x2014],
    [0x2018, 0x201a],
    [0x201c, 0x201e],
    [0x2022, 0x2022],
    [0x2026, 0x2026],
    [0x2032, 0x2033],
    [0x2039, 0x203a],
    [0x2044, 0x2044],
    [0x20ac, 0x20ac],
    [0x2122, 0x2122],
    [0x2212, 0x2212],
    [0x2215, 0x2215],
  ],
});

interface MakeFontsApi {
  originalsDirectoryPath: string;
  fontsDirectoryPath: string;
  fontNames: Array<string>;
  // the characters each font keeps, as inclusive ranges of code points
  characterRanges: Array<[number, number]>;
}

async function makeFonts({
  originalsDirectoryPath,
  fontsDirectoryPath,
  fontNames,
  characterRanges,
}: MakeFontsApi) {
  const keptCharacters = characterRanges
    .flatMap(([firstCodePoint, lastCodePoint]) =>
      Array.from(
        { length: lastCodePoint - firstCodePoint + 1 },
        (_, codePointIndex) =>
          String.fromCodePoint(firstCodePoint + codePointIndex),
      )
    )
    .join("");
  for (const someFontName of fontNames) {
    const fontBytes = await subsetFont(
      Buffer.from(
        Deno.readFileSync(`${originalsDirectoryPath}/${someFontName}.ttf`),
      ),
      keptCharacters,
      { targetFormat: "woff2" },
    );
    Deno.writeFileSync(
      `${fontsDirectoryPath}/${someFontName}.woff2`,
      fontBytes,
    );
    console.log(
      `${someFontName}.woff2: ${(fontBytes.length / 1024).toFixed(1)}KB`,
    );
  }
}
