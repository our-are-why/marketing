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
  TEXT_SectionContent,
} from "../SectionContent/TEXT_SectionContent.tsx";
import {
  COLUMNLIST_SectionContent,
} from "../SectionContent/COLUMNLIST_SectionContent.tsx";

export interface Props__LIFE_LABELED__DocumentSection {
  lifestyleName: string;
  roleName: string;
  dateRange: string;
  overviewText: string;
  lifeLearnings: string[];
}

export function LIFE_LABELED__DocumentSection({
  lifestyleName,
  roleName,
  dateRange,
  overviewText,
  lifeLearnings
}: Props__LIFE_LABELED__DocumentSection) {
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
        />,
        <TEXT_HeaderLabel__DocumentSection
          key={2}
          label={dateRange}
        />
      ]}
      bodyContent={[
        <TEXT_SectionContent
          key={0}
          accessibilityLabel={`overview: ${lifestyleName} - ${roleName}`}
          contentLabel="overview"
          textContent={overviewText}
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
