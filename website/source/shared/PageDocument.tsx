import {
  ComponentChildren,
} from "preact";
import {
  HAIRLINE_Divider,
} from "./Divider.tsx";

export interface Props__HOME_PUBLIC__PageDocument
  extends Pick<
    Props__PUBLIC_PageDocument,
    | "title_pageHead"
    | "description_pageHead"
    | "href_stylesheet__pageHead"
    | "additionalDeclarations_pageHead"
    | "filenames_preloadFonts__pageHead"
    | "pageUrl_linkPreview"
    | "pageTitle_linkPreview"
    | "pageDescription_linkPreview"
    | "imageUrl_linkPreview"
    | "altText_imageUrl__linkPreview"
    | "children_pageBody"
  > {}

export function HOME_PUBLIC__PageDocument({
  title_pageHead,
  description_pageHead,
  href_stylesheet__pageHead,
  additionalDeclarations_pageHead,
  filenames_preloadFonts__pageHead,
  pageUrl_linkPreview,
  pageTitle_linkPreview,
  pageDescription_linkPreview,
  imageUrl_linkPreview,
  altText_imageUrl__linkPreview,
  children_pageBody,
}: Props__HOME_PUBLIC__PageDocument) {
  return (
    <__PUBLIC_PageDocument
      title_pageHead={title_pageHead}
      description_pageHead={description_pageHead}
      href_stylesheet__pageHead={href_stylesheet__pageHead}
      additionalDeclarations_pageHead={additionalDeclarations_pageHead}
      filenames_preloadFonts__pageHead={filenames_preloadFonts__pageHead}
      pageUrl_linkPreview={pageUrl_linkPreview}
      pageTitle_linkPreview={pageTitle_linkPreview}
      pageDescription_linkPreview={pageDescription_linkPreview}
      imageUrl_linkPreview={imageUrl_linkPreview}
      altText_imageUrl__linkPreview={altText_imageUrl__linkPreview}
      children_pageBody={children_pageBody}
    />
  );
}

export interface Props__CONTENT_PUBLIC__PageDocument
  extends
    Pick<
      Props__PUBLIC_PageDocument,
      | "title_pageHead"
      | "description_pageHead"
      | "href_stylesheet__pageHead"
      | "filenames_preloadFonts__pageHead"
      | "pageUrl_linkPreview"
      | "pageTitle_linkPreview"
      | "pageDescription_linkPreview"
      | "imageUrl_linkPreview"
      | "altText_imageUrl__linkPreview"
    >,
    Pick<
      Props__COLUMN_BodyContent__PageDocument,
      | "routeLinks_navigationFooter"
      | "pdfLink_navigationFooter"
    > {
  accessibilityLabel_bodyContent: Props__COLUMN_BodyContent__PageDocument["accessibilityLabel"];
  mainContent_bodyContent: Props__COLUMN_BodyContent__PageDocument["mainContent"];
}

export function CONTENT_PUBLIC__PageDocument({
  title_pageHead,
  description_pageHead,
  href_stylesheet__pageHead,
  filenames_preloadFonts__pageHead,
  pageUrl_linkPreview,
  pageTitle_linkPreview,
  pageDescription_linkPreview,
  imageUrl_linkPreview,
  altText_imageUrl__linkPreview,
  accessibilityLabel_bodyContent,
  mainContent_bodyContent,
  routeLinks_navigationFooter,
  pdfLink_navigationFooter,
}: Props__CONTENT_PUBLIC__PageDocument) {
  return (
    <__PUBLIC_PageDocument
      title_pageHead={title_pageHead}
      description_pageHead={description_pageHead}
      href_stylesheet__pageHead={href_stylesheet__pageHead}
      additionalDeclarations_pageHead={null}
      filenames_preloadFonts__pageHead={filenames_preloadFonts__pageHead}
      pageUrl_linkPreview={pageUrl_linkPreview}
      pageTitle_linkPreview={pageTitle_linkPreview}
      pageDescription_linkPreview={pageDescription_linkPreview}
      imageUrl_linkPreview={imageUrl_linkPreview}
      altText_imageUrl__linkPreview={altText_imageUrl__linkPreview}
      children_pageBody={
        <COLUMN_BodyContent__PageDocument
          className_container="container-body"
          accessibilityLabel={accessibilityLabel_bodyContent}
          mainContent={mainContent_bodyContent}
          routeLinks_navigationFooter={routeLinks_navigationFooter}
          pdfLink_navigationFooter={pdfLink_navigationFooter}
        />
      }
    />
  );
}

export interface Props__NOTFOUND_UNLISTED__PageDocument
  extends Pick<
    Props__UNLISTED_PageDocument,
    | "title_pageHead"
    | "description_pageHead"
    | "href_stylesheet__pageHead"
    | "filenames_preloadFonts__pageHead"
    | "children_pageBody"
  > {}

export function NOTFOUND_UNLISTED__PageDocument({
  title_pageHead,
  description_pageHead,
  href_stylesheet__pageHead,
  filenames_preloadFonts__pageHead,
  children_pageBody,
}: Props__NOTFOUND_UNLISTED__PageDocument) {
  return (
    <__UNLISTED_PageDocument
      title_pageHead={title_pageHead}
      description_pageHead={description_pageHead}
      href_stylesheet__pageHead={href_stylesheet__pageHead}
      filenames_preloadFonts__pageHead={filenames_preloadFonts__pageHead}
      children_pageBody={children_pageBody}
    />
  );
}

export interface Props__PDF_ASSET__PageDocument
  extends
    Pick<
      Props__ASSET_PageDocument,
      | "title_pageHead"
      | "description_pageHead"
      | "href_stylesheet__pageHead"
    >,
    Pick<
      Props__COLUMN_BodyContent__PageDocument,
      | "routeLinks_navigationFooter"
      | "pdfLink_navigationFooter"
    > {
  accessibilityLabel_bodyContent: Props__COLUMN_BodyContent__PageDocument["accessibilityLabel"];
  mainContent_bodyContent: Props__COLUMN_BodyContent__PageDocument["mainContent"];
}

export function PDF_ASSET__PageDocument({
  title_pageHead,
  description_pageHead,
  href_stylesheet__pageHead,
  accessibilityLabel_bodyContent,
  mainContent_bodyContent,
  routeLinks_navigationFooter,
  pdfLink_navigationFooter,
}: Props__PDF_ASSET__PageDocument) {
  return (
    <__ASSET_PageDocument
      title_pageHead={title_pageHead}
      description_pageHead={description_pageHead}
      href_stylesheet__pageHead={href_stylesheet__pageHead}
      children_pageBody={
        <COLUMN_BodyContent__PageDocument
          className_container="container-body bodyContainer-pdf"
          accessibilityLabel={accessibilityLabel_bodyContent}
          mainContent={mainContent_bodyContent}
          routeLinks_navigationFooter={routeLinks_navigationFooter}
          pdfLink_navigationFooter={pdfLink_navigationFooter}
        />
      }
    />
  );
}

export interface Props__IMAGE_ASSET__PageDocument
  extends Pick<
    Props__ASSET_PageDocument,
    | "title_pageHead"
    | "description_pageHead"
    | "href_stylesheet__pageHead"
    | "children_pageBody"
  > {}

export function IMAGE_ASSET__PageDocument({
  title_pageHead,
  description_pageHead,
  href_stylesheet__pageHead,
  children_pageBody,
}: Props__IMAGE_ASSET__PageDocument) {
  return (
    <__ASSET_PageDocument
      title_pageHead={title_pageHead}
      description_pageHead={description_pageHead}
      href_stylesheet__pageHead={href_stylesheet__pageHead}
      children_pageBody={children_pageBody}
    />
  );
}

interface Props__COLUMN_BodyContent__PageDocument {
  className_container: string;
  accessibilityLabel: string;
  mainContent: ComponentChildren;
  routeLinks_navigationFooter: Props__NavigationFooter_PageDocument["routeLinks"];
  pdfLink_navigationFooter: Props__NavigationFooter_PageDocument["pdfLink"];
}

function COLUMN_BodyContent__PageDocument({
  className_container,
  accessibilityLabel,
  mainContent,
  routeLinks_navigationFooter,
  pdfLink_navigationFooter,
}: Props__COLUMN_BodyContent__PageDocument) {
  return (
    <div
      role="presentation"
      className={className_container}
    >
      <div
        role="main"
        className="contentContainer-body"
      >
        <div
          role="heading"
          className="accessibilityOnly"
          aria-level={1}
        >
          {accessibilityLabel}
        </div>
        {mainContent}
        <NavigationFooter_PageDocument
          routeLinks={routeLinks_navigationFooter}
          pdfLink={pdfLink_navigationFooter}
        />
      </div>
    </div>
  );
}

interface RouteLink__NavigationFooter_PageDocument {
  name: string;
  href: string;
}

interface Props__NavigationFooter_PageDocument {
  routeLinks: Array<RouteLink__NavigationFooter_PageDocument>;
  pdfLink: ComponentChildren;
}

function NavigationFooter_PageDocument({
  routeLinks,
  pdfLink
}: Props__NavigationFooter_PageDocument) {
  return (
    <div role="presentation" className="container-navigationFooter">
      <HAIRLINE_Divider />
      <div role="navigation" className="navigationContainer-navigationFooter">
        <div role="list" className="linksContainer-navigationFooter">
          {routeLinks.map((routeLink_current) => (
            <div
              key={routeLink_current.name}
              role="listitem"
              className="linkContainer-navigationFooter"
            >
              <a
                className="link-navigationFooter"
                href={routeLink_current.href}
              >
                {routeLink_current.name}
              </a>
            </div>
          ))}
        </div>
        {pdfLink}
      </div>
    </div>
  );
}

export interface Props__PdfLink__NavigationFooter_PageDocument {
  pdfHref: string;
}

export function PdfLink__NavigationFooter_PageDocument({
  pdfHref
}: Props__PdfLink__NavigationFooter_PageDocument) {
  return (
    <div className="container-pdfLink">
      <a href={pdfHref}>view pdf</a>
    </div>
  );
}

interface Props__PUBLIC_PageDocument
  extends Pick<
    Props__BASE_PageDocument,
    | "title_pageHead"
    | "description_pageHead"
    | "href_stylesheet__pageHead"
    | "filenames_preloadFonts__pageHead"
    | "children_pageBody"
  > {
  additionalDeclarations_pageHead: Props__BASE_PageDocument["declarations_pageHead"];
  pageUrl_linkPreview: Props__LinkPreview__Head_PageDocument["pageUrl"];
  pageTitle_linkPreview: Props__LinkPreview__Head_PageDocument["pageTitle"];
  pageDescription_linkPreview: Props__LinkPreview__Head_PageDocument["pageDescription"];
  imageUrl_linkPreview: Props__LinkPreview__Head_PageDocument["imageUrl"];
  altText_imageUrl__linkPreview: Props__LinkPreview__Head_PageDocument["altText_imageUrl"];
}

function __PUBLIC_PageDocument({
  title_pageHead,
  description_pageHead,
  href_stylesheet__pageHead,
  additionalDeclarations_pageHead,
  filenames_preloadFonts__pageHead,
  pageUrl_linkPreview,
  pageTitle_linkPreview,
  pageDescription_linkPreview,
  imageUrl_linkPreview,
  altText_imageUrl__linkPreview,
  children_pageBody,
}: Props__PUBLIC_PageDocument) {
  return (
    <__BASE_PageDocument
      title_pageHead={title_pageHead}
      description_pageHead={description_pageHead}
      href_stylesheet__pageHead={href_stylesheet__pageHead}
      declarations_pageHead={
        <>
          <LinkPreview__Head_PageDocument
            pageUrl={pageUrl_linkPreview}
            pageTitle={pageTitle_linkPreview}
            pageDescription={pageDescription_linkPreview}
            imageUrl={imageUrl_linkPreview}
            altText_imageUrl={altText_imageUrl__linkPreview}
          />
          {additionalDeclarations_pageHead}
        </>
      }
      filenames_preloadFonts__pageHead={filenames_preloadFonts__pageHead}
      children_pageBody={children_pageBody}
    />
  );
}

interface Props__UNLISTED_PageDocument
  extends Pick<
    Props__BASE_PageDocument,
    | "title_pageHead"
    | "description_pageHead"
    | "href_stylesheet__pageHead"
    | "filenames_preloadFonts__pageHead"
    | "children_pageBody"
  > {}

function __UNLISTED_PageDocument({
  title_pageHead,
  description_pageHead,
  href_stylesheet__pageHead,
  filenames_preloadFonts__pageHead,
  children_pageBody,
}: Props__UNLISTED_PageDocument) {
  return (
    <__BASE_PageDocument
      title_pageHead={title_pageHead}
      description_pageHead={description_pageHead}
      href_stylesheet__pageHead={href_stylesheet__pageHead}
      declarations_pageHead={
        <meta
          name="robots"
          content="noindex"
        />
      }
      filenames_preloadFonts__pageHead={filenames_preloadFonts__pageHead}
      children_pageBody={children_pageBody}
    />
  );
}

interface Props__ASSET_PageDocument
  extends Pick<
    Props__BASE_PageDocument,
    | "title_pageHead"
    | "description_pageHead"
    | "href_stylesheet__pageHead"
    | "children_pageBody"
  > {}

function __ASSET_PageDocument({
  title_pageHead,
  description_pageHead,
  href_stylesheet__pageHead,
  children_pageBody,
}: Props__ASSET_PageDocument) {
  return (
    <__BASE_PageDocument
      title_pageHead={title_pageHead}
      description_pageHead={description_pageHead}
      href_stylesheet__pageHead={href_stylesheet__pageHead}
      declarations_pageHead={null}
      filenames_preloadFonts__pageHead={[]}
      children_pageBody={children_pageBody}
    />
  );
}

interface Props__BASE_PageDocument {
  title_pageHead: Props__Head_PageDocument["title"];
  description_pageHead: Props__Head_PageDocument["description"];
  href_stylesheet__pageHead: Props__Head_PageDocument["href_stylesheet"];
  declarations_pageHead: Props__Head_PageDocument["declarations"];
  filenames_preloadFonts__pageHead: Props__Head_PageDocument["filenames_preloadFonts"];
  children_pageBody: ComponentChildren;
}

function __BASE_PageDocument({
  title_pageHead,
  description_pageHead,
  href_stylesheet__pageHead,
  declarations_pageHead,
  filenames_preloadFonts__pageHead,
  children_pageBody,
}: Props__BASE_PageDocument) {
  return (
    <html
      lang="en"
    >
      <Head_PageDocument
        title={title_pageHead}
        description={description_pageHead}
        href_stylesheet={href_stylesheet__pageHead}
        declarations={declarations_pageHead}
        filenames_preloadFonts={filenames_preloadFonts__pageHead}
      />
      <body>{children_pageBody}</body>
    </html>
  );
}

interface Props__Head_PageDocument {
  title: string;
  description: string;
  href_stylesheet: string;
  declarations: ComponentChildren;
  filenames_preloadFonts: Array<string>;
}

function Head_PageDocument({
  title,
  description,
  href_stylesheet,
  declarations,
  filenames_preloadFonts,
}: Props__Head_PageDocument) {
  return (
    <head>
      <meta
        charset="utf-8"
      />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1"
      />
      <title>{title}</title>
      <meta
        name="description"
        content={description}
      />
      <meta
        name="color-scheme"
        content="only light"
      />
      <meta
        name="theme-color"
        content="#ffffff"
      />
      <link
        rel="icon"
        href="/favicon.ico"
      />
      <link
        rel="apple-touch-icon"
        href="/apple-touch-icon.png"
      />
      <link
        rel="stylesheet"
        href={href_stylesheet}
      />
      {declarations}
      {filenames_preloadFonts.map((filename_preloadFont__current) => (
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          crossorigin="anonymous"
          key={filename_preloadFont__current}
          href={`/assets/fonts/${filename_preloadFont__current}`}
        />
      ))}
    </head>
  );
}

interface Props__LinkPreview__Head_PageDocument {
  pageUrl: string;
  pageTitle: string;
  pageDescription: string;
  imageUrl: string;
  altText_imageUrl: string;
}

function LinkPreview__Head_PageDocument({
  pageUrl,
  pageTitle,
  pageDescription,
  imageUrl,
  altText_imageUrl,
}: Props__LinkPreview__Head_PageDocument) {
  return (
    <>
      <link
        rel="canonical"
        href={pageUrl}
      />
      <meta
        property="og:type"
        content="website"
      />
      <meta
        property="og:url"
        content={pageUrl}
      />
      <meta
        property="og:title"
        content={pageTitle}
      />
      <meta
        property="og:description"
        content={pageDescription}
      />
      <meta
        property="og:image"
        content={imageUrl}
      />
      <meta
        property="og:image:width"
        content="1200"
      />
      <meta
        property="og:image:height"
        content="630"
      />
      <meta
        property="og:image:alt"
        content={altText_imageUrl}
      />
      <meta
        name="twitter:card"
        content="summary_large_image"
      />
    </>
  );
}
