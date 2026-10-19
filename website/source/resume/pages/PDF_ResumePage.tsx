import {
  PDF_ASSET__PageDocument,
} from "../../shared/PageDocument.tsx";
import type {
  Props_Page,
} from "../../shared/Props_Page.ts";
import {
  _socialProfiles_,
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
import "./PDF_ResumePage.css";

export function PDF_ResumePage({
  stylesheetHref_page,
}: Props_Page) {
  return (
    <PDF_ASSET__PageDocument
      title_pageHead={_pageTitle_resume_}
      description_pageHead={_pageDescription_resume_}
      href_stylesheet__pageHead={stylesheetHref_page}
      accessibilityLabel_bodyContent="resume"
      mainContent_bodyContent={
        <ResumeSections />
      }
      routeLinks_navigationFooter={[
        {
          name: "website",
          href: `${_siteOrigin_}${_sitePages_["home"].path}`,
        },
        {
          name: _socialProfiles_["github"].name,
          href: _socialProfiles_["github"].href,
        },
      ]}
      pdfLink_navigationFooter={null}
    />
  );
}
