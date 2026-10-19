import {
  ComponentChildren,
} from "preact";
import {
  __BASE_SectionContent,
  type Props__BASE_SectionContent,
} from "../../../shared/__BASE_SectionContent.tsx";

export interface Props__WRAPLIST_SectionContent
  extends Pick<
    Props__BASE_SectionContent,
    | "accessibilityLabel"
    | "contentLabel"
  > {
  listItems: ComponentChildren[];
}

export function WRAPLIST_SectionContent({
  accessibilityLabel,
  contentLabel,
  listItems
}: Props__WRAPLIST_SectionContent) {
  return (
    <__BASE_SectionContent
      accessibilityLabel={accessibilityLabel}
      contentLabel={contentLabel}
      content={
        <div 
          role="list" 
          className="wrapList_container-sectionContent"
        >
          {listItems.map((listItem_current, index_listItem) => (
            <div
              key={index_listItem}
              role="listitem"
              className="itemContainer-wrapList--sectionContent"
            >
              <div role="paragraph">
                {listItem_current}
              </div>
            </div>
          ))}
        </div>
      }
    />
  );
}
