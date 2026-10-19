import {
  ComponentChildren,
} from "preact";
import {
  LINK_HeaderLabel__DocumentSection,
  TEXT_HeaderLabel__DocumentSection,
} from "../../shared/__BASE_DocumentSection.tsx";

export interface Props__LabelRow_DocumentSection
  extends Pick<
    Props__BASE_LabelRow_DocumentSection,
    | "rowLabels"
  > {}

export function LabelRow_DocumentSection({
  rowLabels,
}: Props__LabelRow_DocumentSection) {
  return (
    <__BASE_LabelRow_DocumentSection
      rowLabels={rowLabels}
      linkList={null}
    />
  );
}

export interface Props__LINKED_LabelRow_DocumentSection
  extends Pick<
    Props__BASE_LabelRow_DocumentSection,
    | "rowLabels"
  > {
  rowLinks: Array<{
    label: string;
    href: string;
  }>;
}

// where to go from what the labels describe, at the right end of the row
export function LINKED_LabelRow_DocumentSection({
  rowLabels,
  rowLinks,
}: Props__LINKED_LabelRow_DocumentSection) {
  return (
    <__BASE_LabelRow_DocumentSection
      rowLabels={rowLabels}
      linkList={
        <div role="list" className="linksContainer-labelRow">
          {rowLinks.map((rowLink_current) => (
            <div
              key={rowLink_current.href}
              role="listitem"
              className="labelContainer-documentSection"
            >
              <LINK_HeaderLabel__DocumentSection
                label={rowLink_current.label}
                linkHref={rowLink_current.href}
              />
            </div>
          ))}
        </div>
      }
    />
  );
}

interface Props__BASE_LabelRow_DocumentSection {
  rowLabels: Array<string>;
  linkList: ComponentChildren;
}

function __BASE_LabelRow_DocumentSection({
  rowLabels,
  linkList,
}: Props__BASE_LabelRow_DocumentSection) {
  return (
    <div role="presentation" className="container-labelRow">
      <div role="list" className="labelsContainer-labelRow">
        {rowLabels.map((rowLabel_current, index_rowLabel) => (
          <div
            key={index_rowLabel}
            role="listitem"
            className="labelContainer-documentSection"
          >
            <TEXT_HeaderLabel__DocumentSection label={rowLabel_current} />
          </div>
        ))}
      </div>
      {linkList}
    </div>
  );
}
