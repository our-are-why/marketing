import {
  ComponentChildren,
} from "preact";
import {
  __BASE_DocumentSection,
} from "../../../shared/__BASE_DocumentSection.tsx";

export interface Props__LABELED_DocumentSection {
  sectionDivider: ComponentChildren;
  accessibilityLabel: string;
  headerLabels: Array<ComponentChildren>
  bodyContent: ComponentChildren
}

export function __LABELED_DocumentSection({
  sectionDivider,
  accessibilityLabel,
  headerLabels,
  bodyContent
}: Props__LABELED_DocumentSection) {
  return (
    <__BASE_DocumentSection
      className_contentContainer="contentContainer-documentSection"
      sectionDivider={sectionDivider}
      accessibilityLabel={accessibilityLabel}
      content={
        <>
          <div 
            role="list" 
            className="headerContainer-documentSection"
          >
            {headerLabels.map((headerLabel_current, index_headerLabel) => (
              <div 
                role="listitem" 
                className="labelContainer-documentSection" 
                key={index_headerLabel}
              >
                {headerLabel_current}
              </div>
            ))}
          </div>
          <div 
            role="presentation"
            className="bodyContainer-documentSection"
          >
            <div
              role="group"
              className="bodyContent_container-documentSection"
            >
              {bodyContent}
            </div>
          </div>
        </>
      }
    />
  );
}
