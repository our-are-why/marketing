import {
  CONTENT_PUBLIC__PageDocument,
  PdfLink__NavigationFooter_PageDocument,
} from "../../shared/PageDocument.tsx";
import type {
  Props_Page,
} from "../../shared/Props_Page.ts";
import {
  _fontFiles_,
  mapComplementSet_SitePage,
  _siteOrigin_,
  _sitePages_,
} from "../../shared/site.ts";
import {
  ResumeSections,
} from "../components/ResumeSections.tsx";
import {
  _pageDescription_resume_,
  _pageTitle_resume_,
} from "../constants.ts";
import "./HTML_ResumePage.css";

export function HTML_ResumePage({
  stylesheetHref_page,
}: Props_Page) {
  return (
    <CONTENT_PUBLIC__PageDocument
      title_pageHead={_pageTitle_resume_}
      description_pageHead={_pageDescription_resume_}
      href_stylesheet__pageHead={stylesheetHref_page}
      filenames_preloadFonts__pageHead={[
        _fontFiles_["regular"],
        _fontFiles_["bold"],
        _fontFiles_["boldItalic"],
      ]}
      pageUrl_linkPreview={`${_siteOrigin_}${_sitePages_["resume"].path}`}
      pageTitle_linkPreview={_pageTitle_resume_}
      pageDescription_linkPreview={_pageDescription_resume_}
      imageUrl_linkPreview={`${_siteOrigin_}/assets/resume.social.png`}
      altText_imageUrl__linkPreview={"the top of jared mathews' resume: name, \"ex-homeless\", email, brief, status, and goals"}
      accessibilityLabel_bodyContent="resume"
      mainContent_bodyContent={
        <ResumeSections />
      }
      routeLinks_navigationFooter={
        mapComplementSet_SitePage({
          baseSet_sitePages: _sitePages_,
          subject_sitePage: _sitePages_["resume"],
        }).map((sitePage_current) => ({
          name: sitePage_current.name,
          href: sitePage_current.path,
        }))
      }
      pdfLink_navigationFooter={
        <PdfLink__NavigationFooter_PageDocument pdfHref="/assets/resume.pdf" />
      }
    />
  );
}
