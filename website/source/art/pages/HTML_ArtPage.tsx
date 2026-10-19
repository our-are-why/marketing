import {
  CONTENT_PUBLIC__PageDocument,
} from "../../shared/PageDocument.tsx";
import type {
  Props_Page,
} from "../../shared/Props_Page.ts";
import {
  BAR_Divider,
  DOUBLEBAR_Divider,
} from "../../shared/Divider.tsx";
import {
  LAZY_GRAPHIC__DocumentSection,
  LEADING_GRAPHIC__DocumentSection,
} from "../components/GRAPHIC_DocumentSection.tsx";
import {
  POEMS_DocumentSection,
} from "../components/POEMS_DocumentSection.tsx";
import {
  graphic_latest,
  graphics_subsequent,
} from "../images.ts";
import {
  poemCollection_latest,
  poemCollections_subsequent,
} from "../poems.tsx";
import {
  _pageDescription_art_,
  _pageTitle_art_,
} from "../constants.ts";
import {
  _fontFiles_,
  mapComplementSet_SitePage,
  _siteOrigin_,
  _sitePages_,
} from "../../shared/site.ts";
import "./HTML_ArtPage.css";

export function HTML_ArtPage({
  stylesheetHref_page,
}: Props_Page) {
  return (
    <CONTENT_PUBLIC__PageDocument
      pdfLink_navigationFooter={null}
      accessibilityLabel_bodyContent="art"
      altText_imageUrl__linkPreview="a crop of our.are.why's newest piece, 005_bb: a black and white digital square pattern"
      title_pageHead={_pageTitle_art_}
      description_pageHead={_pageDescription_art_}
      href_stylesheet__pageHead={stylesheetHref_page}
      pageTitle_linkPreview={_pageTitle_art_}
      pageDescription_linkPreview={_pageDescription_art_}
      pageUrl_linkPreview={`${_siteOrigin_}${_sitePages_["art"].path}`}
      imageUrl_linkPreview={`${_siteOrigin_}/assets/art/art.social.png`}
      filenames_preloadFonts__pageHead={[
        _fontFiles_["bold"],
        _fontFiles_["boldItalic"],
      ]}
      routeLinks_navigationFooter={
        mapComplementSet_SitePage({
          baseSet_sitePages: _sitePages_,
          subject_sitePage: _sitePages_["art"],
        }).map((sitePage_current) => ({
          name: sitePage_current.name,
          href: sitePage_current.path,
        }))
      }
      mainContent_bodyContent={
        <>
          <LEADING_GRAPHIC__DocumentSection
            graphic={graphic_latest}
          />
          {graphics_subsequent.map((graphic_current) => (
            <LAZY_GRAPHIC__DocumentSection
              key={graphic_current.pieceName}
              graphic={graphic_current}
            />
          ))}
          <POEMS_DocumentSection
            sectionDivider={<DOUBLEBAR_Divider />}
            poemCollection={poemCollection_latest}
          />
          {poemCollections_subsequent.map((poemCollection_current) => (
            <POEMS_DocumentSection
              key={poemCollection_current.name}
              sectionDivider={<BAR_Divider />}
              poemCollection={poemCollection_current}
            />
          ))}
        </>
      }
    />
  );
}
