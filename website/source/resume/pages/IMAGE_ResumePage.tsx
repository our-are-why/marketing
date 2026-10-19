import {
  IMAGE_ASSET__PageDocument,
} from "../../shared/PageDocument.tsx";
import type {
  Props_Page,
} from "../../shared/Props_Page.ts";
import {
  ResumeHeader,
} from "../components/ResumeSections.tsx";
import {
  _pageDescription_resume_,
  _pageTitle_resume_,
} from "../constants.ts";
import "./IMAGE_ResumePage.css";

export function IMAGE_ResumePage({
  stylesheetHref_page,
}: Props_Page) {
  return (
    <IMAGE_ASSET__PageDocument
      title_pageHead={_pageTitle_resume_}
      description_pageHead={_pageDescription_resume_}
      href_stylesheet__pageHead={stylesheetHref_page}
      children_pageBody={
        <div className="card-socialPage">
          <ResumeHeader />
        </div>
      }
    />
  );
}
