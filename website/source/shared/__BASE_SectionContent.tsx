import {
  ComponentChildren,
} from "preact";

export interface Props__BASE_SectionContent {
  accessibilityLabel: string;
  contentLabel: string;
  content: ComponentChildren
}

export function __BASE_SectionContent({
  accessibilityLabel,
  contentLabel,
  content
}: Props__BASE_SectionContent) {
  return (
    <div
      role="region"
      aria-label={accessibilityLabel}
      className="container-sectionContent"
    >
      <div
        role="heading"
        aria-level={3}
        className="labelContainer-sectionContent"
      >
        {contentLabel}
        <div
          role="separator"
          className="labelUnderline-sectionContent"
        />
      </div>
      {content}
    </div>
  );
}