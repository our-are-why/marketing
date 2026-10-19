import {
  NOTFOUND_UNLISTED__PageDocument,
} from "../shared/PageDocument.tsx";
import type {
  Props_Page,
} from "../shared/Props_Page.ts";
import {
  _fontFiles_,
  _sitePages_,
} from "../shared/site.ts";
import "./HTML__NotFound_Page.css";

export function HTML__NotFound_Page({
  stylesheetHref_page,
}: Props_Page) {
  return (
    <NOTFOUND_UNLISTED__PageDocument
      title_pageHead="404 · our.are.why"
      description_pageHead="nothing here but trash."
      href_stylesheet__pageHead={stylesheetHref_page}
      filenames_preloadFonts__pageHead={[_fontFiles_["bold"], _fontFiles_["boldItalic"]]}
      children_pageBody={
        <main className="container-notFound--page">
          <img src="/apple-touch-icon.png" alt="" width="90" height="90" />
          <h1>404</h1>
          <p>nothing here but trash</p>
          <nav aria-label="Links">
            <ul>
              <li>
                <a href={_sitePages_["home"].path}>{_sitePages_["home"].name}</a>
              </li>
            </ul>
          </nav>
        </main>
      }
    />
  );
}
