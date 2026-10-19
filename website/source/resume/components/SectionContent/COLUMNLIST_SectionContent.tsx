import {
  ComponentChildren,
} from "preact";
import {
  __BASE_SectionContent,
  type Props__BASE_SectionContent,
} from "../../../shared/__BASE_SectionContent.tsx";

export interface Props__COLUMNLIST_SectionContent 
  extends Pick<
    Props__BASE_SectionContent,
    | "contentLabel"
    | "accessibilityLabel"
  > {
  listItems: Array<ComponentChildren>
}

export function COLUMNLIST_SectionContent({
  accessibilityLabel,
  contentLabel,
  listItems
}: Props__COLUMNLIST_SectionContent) {
  return (
    <__BASE_SectionContent
      accessibilityLabel={accessibilityLabel}
      contentLabel={contentLabel}
      content={
        <div 
          role="list"
          className="columnList_container-sectionContent"
        >
          {listItems.map((listItem_current, index_listItem) => (
            <div
              key={index_listItem}
              role="listitem"
              className="itemContainer-columnList--sectionContent"
            >
              <div role="presentation">
                -
              </div>
              <div
                role="paragraph"
                className="item-columnList--sectionContent"
              >
                {listItem_current}
              </div>
            </div>
          ))}
        </div>
      }
    />
  );
}

export interface Props___Temporal__ListItem_Column {
  itemName: string;
  itemDetail: string;
  dateRange: string;
}

export function Temporal__ListItem_Column({
  itemName,
  itemDetail,
  dateRange
}: Props___Temporal__ListItem_Column) {
  return (
    <>
      {itemName}:{" "}
      <span className="detail-listItem--temporal---sectionContent">
        {itemDetail}
      </span>{" "}
      <span className="dateRange-listItem--temporal---sectionContent">
        ({dateRange})
      </span>
    </>
  );
}
