export const _siteOrigin_ = "https://our.are.why.soy";

export interface SitePage {
  name: string;
  path: string;
}

export const _sitePages_ = {
  home: {
    name: "home",
    path: "/",
  },
  art: {
    name: "art",
    path: "/art/",
  },
  resume: {
    name: "resume",
    path: "/resume/",
  },
} satisfies Record<string, SitePage>;

export interface Api__mapComplementSet_SitePage {
  baseSet_sitePages: Record<string, SitePage>;
  subject_sitePage: SitePage;
}

export function mapComplementSet_SitePage({
  baseSet_sitePages,
  subject_sitePage,
}: Api__mapComplementSet_SitePage) {
  return Object.values(baseSet_sitePages).filter((sitePage_current) =>
    sitePage_current !== subject_sitePage
  );
}

export interface SocialProfile {
  name: string;
  href: string;
}

export const _socialProfiles_ = {
  github: {
    name: "github",
    href: "https://github.com/our-are-why",
  },
  hackernews: {
    name: "hackernews",
    href: "https://news.ycombinator.com/user?id=our_are_why",
  },
  x: {
    name: "xxx",
    href: "https://x.com/our_are_why",
  },
} satisfies Record<string, SocialProfile>;

export const _fontFiles_ = {
  regular: "CourierPrime-Regular.woff2",
  italic: "CourierPrime-Italic.woff2",
  bold: "CourierPrime-Bold.woff2",
  boldItalic: "CourierPrime-BoldItalic.woff2",
};
