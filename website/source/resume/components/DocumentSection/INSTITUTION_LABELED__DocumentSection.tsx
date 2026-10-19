import {
  BAR_Divider,
} from "../../../shared/Divider.tsx";
import {
  TEXT_HeaderLabel__DocumentSection,
} from "../../../shared/__BASE_DocumentSection.tsx";
import {
  __LABELED_DocumentSection,
} from "./__LABELED_DocumentSection.tsx";
import {
  COLUMNLIST_SectionContent,
  Temporal__ListItem_Column,
} from "../SectionContent/COLUMNLIST_SectionContent.tsx";

export interface Props__INSTITUTION_LABELED__DocumentSection {
  lifestyleName: string;
  roleName: string;
  facilityStays: Array<{
    facilityName: string;
    stayLength: string;
    dateRange: string;
  }>;
  lifeLearnings: string[];
}

export function INSTITUTION_LABELED__DocumentSection({
  lifestyleName,
  roleName,
  facilityStays,
  lifeLearnings
}: Props__INSTITUTION_LABELED__DocumentSection) {
  return (
    <__LABELED_DocumentSection
      sectionDivider={<BAR_Divider />}
      accessibilityLabel={`life: ${lifestyleName} - ${roleName}`}
      headerLabels={[
        <TEXT_HeaderLabel__DocumentSection
          key={0}
          label={lifestyleName}
        />,
        <TEXT_HeaderLabel__DocumentSection
          key={1}
          label={roleName}
        />
      ]}
      bodyContent={[
        <COLUMNLIST_SectionContent
          key={0}
          accessibilityLabel={`stays: ${lifestyleName} - ${roleName}`}
          contentLabel="stays"
          listItems={facilityStays.map((facilityStay_current) => (
            <Temporal__ListItem_Column
              itemName={facilityStay_current.facilityName}
              itemDetail={facilityStay_current.stayLength}
              dateRange={facilityStay_current.dateRange}
            />
          ))}
        />,
        <COLUMNLIST_SectionContent
          key={1}
          accessibilityLabel={`learnings: ${lifestyleName} - ${roleName}`}
          contentLabel="learnings"
          listItems={lifeLearnings}
        />
      ]}
    />
  );
}
