import {
  HOME_PUBLIC__PageDocument,
} from "../shared/PageDocument.tsx";
import type {
  Props_Page,
} from "../shared/Props_Page.ts";
import {
  _fontFiles_,
  mapComplementSet_SitePage,
  _socialProfiles_,
  type SitePage,
  _siteOrigin_,
  _sitePages_,
} from "../shared/site.ts";
import "./HTML_HomePage.css";

const _pageTitle_home_ = "our.are.why";

const _pageDescription_home_ = "live fast, eat trash";

const _animationDescription_home_ =
  "A pixel-art sloth sits beside a tipped-over trash can, holding a sign that reads “got ******? anything helps”";

export function HTML_HomePage({
  stylesheetHref_page,
}: Props_Page) {
  return (
    <HOME_PUBLIC__PageDocument
      title_pageHead={_pageTitle_home_}
      description_pageHead={_pageDescription_home_}
      href_stylesheet__pageHead={stylesheetHref_page}
      pageTitle_linkPreview={_pageTitle_home_}
      pageDescription_linkPreview={_pageDescription_home_}
      pageUrl_linkPreview={`${_siteOrigin_}${_sitePages_["home"].path}`}
      imageUrl_linkPreview={`${_siteOrigin_}/assets/ourarewhy.social.png`}
      altText_imageUrl__linkPreview={`our.are.why: live fast, eat trash. ${_animationDescription_home_}`}
      filenames_preloadFonts__pageHead={[
        _fontFiles_["bold"],
        _fontFiles_["boldItalic"],
      ]}
      additionalDeclarations_pageHead={
        <link
          rel="preload"
          href="/assets/ourarewhy.poster.webp"
          as="image"
          fetchpriority="high"
        />
      }
      children_pageBody={
        <main>
          <h1 className="accessibilityOnly">our.are.why: live fast, eat trash</h1>
          <Animation_HomePage
            accessibilityLabel={_animationDescription_home_}
          />
          <Quote_HomePage
            quoteSpeaker="sloth"
            quoteClauses={[
              "“sharpie on whiteboard isn’t negligence —",
              "it’s psychological warfare.”",
            ]}
          />
          <ContentLinks_HomePage
            contentPages={
              mapComplementSet_SitePage({
                baseSet_sitePages: _sitePages_,
                subject_sitePage: _sitePages_["home"],
              })
            }
          />
          <ProfileLinks_HomePage
            socialProfiles={_socialProfiles_}
          />
        </main>
      }
    />
  );
}

interface Props__Animation_HomePage {
  accessibilityLabel: string;
}

function Animation_HomePage({
  accessibilityLabel,
}: Props__Animation_HomePage) {
  return (
    <div className="art" role="img" aria-label={accessibilityLabel}>
      <video
        autoplay
        muted
        loop
        playsinline
        disablePictureInPicture
        disableremoteplayback
        poster="/assets/ourarewhy.poster.webp"
      >
        <source
          src="/assets/ourarewhy.av1.mp4#t=0.001"
          type='video/mp4; codecs="av01.0.08M.08"'
          media="(prefers-reduced-motion: no-preference)"
        />
        <source
          src="/assets/ourarewhy.h264.mp4#t=0.001"
          type='video/mp4; codecs="avc1.640028"'
          media="(prefers-reduced-motion: no-preference)"
        />
        <source
          src="/assets/ourarewhy.still.h264.mp4#t=0.001"
          type='video/mp4; codecs="avc1.640028"'
        />
      </video>
    </div>
  );
}

interface Props__Quote_HomePage {
  quoteClauses: [string, string];
  quoteSpeaker: string;
}

function Quote_HomePage({
  quoteClauses,
  quoteSpeaker,
}: Props__Quote_HomePage) {
  const [quoteClause_first, quoteClause_second] = quoteClauses;
  return (
    <figure>
      <blockquote>
        <p>
          <span className="clause">{quoteClause_first}</span>{" "}
          <span className="clause">{quoteClause_second}</span>
        </p>
      </blockquote>
      <figcaption className="accessibilityOnly">— {quoteSpeaker}</figcaption>
    </figure>
  );
}

interface Props__ContentLinks_HomePage {
  contentPages: Array<SitePage>;
}

function ContentLinks_HomePage({
  contentPages,
}: Props__ContentLinks_HomePage) {
  return (
    <nav aria-label="Pages">
      <ul>
        {contentPages.map((sitePage_current) => (
          <li key={sitePage_current.path}>
            <a href={sitePage_current.path}>{sitePage_current.name}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

interface Props__ProfileLinks_HomePage {
  socialProfiles: typeof _socialProfiles_;
}

function ProfileLinks_HomePage({
  socialProfiles,
}: Props__ProfileLinks_HomePage) {
  return (
    <nav aria-label="Links">
      <ul>
        <li>
          <a href={socialProfiles["github"].href} rel="me">
            {socialProfiles["github"].name}
          </a>
        </li>
        <li>
          <a href={socialProfiles["hackernews"].href} rel="me">
            {socialProfiles["hackernews"].name}
          </a>
        </li>
        <li>
          <a href={socialProfiles["x"].href} rel="me">
            {socialProfiles["x"].name}
            <span className="accessibilityOnly">{" (x.com)"}</span>
          </a>
        </li>
      </ul>
    </nav>
  );
}
