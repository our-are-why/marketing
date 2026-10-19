import {
  ComponentChildren,
} from "preact";

export interface Props__BASE_DocumentSection {
  className_contentContainer: string;
  sectionDivider: ComponentChildren;
  accessibilityLabel: string;
  content: ComponentChildren;
}

export function __BASE_DocumentSection({
  className_contentContainer,
  sectionDivider,
  accessibilityLabel,
  content,
}: Props__BASE_DocumentSection) {
  return (
    <div role="none" className="container-documentSection">
      {sectionDivider}
      <div
        role="region"
        aria-label={accessibilityLabel}
        className={className_contentContainer}
      >
        <div
          role="heading"
          aria-level={2}
          className="accessibilityOnly"
        >
          {accessibilityLabel}
        </div>
        {content}
      </div>
    </div>
  );
}

export interface Props__TEXT_HeaderLabel__DocumentSection {
  label: string;
}

export function TEXT_HeaderLabel__DocumentSection({
  label
}: Props__TEXT_HeaderLabel__DocumentSection) {
  return (
    <div
      className="headerLabel-documentSection"
    >
      {label}
    </div>
  );
}

export interface Props__LINK_HeaderLabel__DocumentSection {
  label: string;
  linkHref: string;
}

export function LINK_HeaderLabel__DocumentSection({
  linkHref,
  label
}: Props__LINK_HeaderLabel__DocumentSection) {
  return (
    <a 
      className="headerLabel-documentSection"
      href={linkHref}
    >
      {label}
    </a>
  );
}