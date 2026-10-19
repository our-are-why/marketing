import {
  ComponentChildren,
} from "preact";
import {
  __BASE_SectionContent,
  type Props__BASE_SectionContent,
} from "../../../shared/__BASE_SectionContent.tsx";

export interface Props__TEXT_SectionContent 
  extends Pick<
    Props__BASE_SectionContent,
    | "contentLabel"
    | "accessibilityLabel"
  > {
  textContent: ComponentChildren
}

export function TEXT_SectionContent({
  contentLabel,
  accessibilityLabel,
  textContent
}: Props__TEXT_SectionContent) {
  return (
    <__BASE_SectionContent
      contentLabel={contentLabel}
      accessibilityLabel={accessibilityLabel}
      content={
        <div 
          role="paragraph"
          className="textContainer-sectionContent"
        >
          {textContent}
        </div>
      }
    />
  );
}
