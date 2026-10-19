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
  Temporal__ListItem_Column,
} from "../SectionContent/COLUMNLIST_SectionContent.tsx";

export interface Props__TRAVEL_LABELED__DocumentSection {
  regionName: string;
  roleName: string;
  dateRanges: string[];
  overviewText: string;
  regionTrips: Array<{
    countryNames: string;
    cityNames: string;
    dateRange: string;
  }>;
  lifeLearnings: string[];
}

export function TRAVEL_LABELED__DocumentSection({
  regionName,
  roleName,
  dateRanges,
  overviewText,
  regionTrips,
  lifeLearnings
}: Props__TRAVEL_LABELED__DocumentSection) {
  return (
    <__LABELED_DocumentSection
      sectionDivider={<BAR_Divider />}
      accessibilityLabel={`travel: ${regionName} - ${roleName}`}
      headerLabels={[
        <TEXT_HeaderLabel__DocumentSection
          key={0}
          label={regionName}
        />,
        <TEXT_HeaderLabel__DocumentSection
          key={1}
          label={roleName}
        />,
        ...dateRanges.map((dateRange_current, index_dateRange) => (
          <TEXT_HeaderLabel__DocumentSection
            key={2 + index_dateRange}
            label={dateRange_current}
          />
        ))
      ]}
      bodyContent={[
        <TEXT_SectionContent
          key={0}
          accessibilityLabel={`overview: ${regionName} - ${roleName}`}
          contentLabel="overview"
          textContent={overviewText}
        />,
        <COLUMNLIST_SectionContent
          key={1}
          accessibilityLabel={`trips: ${regionName} - ${roleName}`}
          contentLabel="trips"
          listItems={regionTrips.map((regionTrip_current) => (
            <Temporal__ListItem_Column
              itemName={regionTrip_current.countryNames}
              itemDetail={regionTrip_current.cityNames}
              dateRange={regionTrip_current.dateRange}
            />
          ))}
        />,
        <COLUMNLIST_SectionContent
          key={2}
          accessibilityLabel={`learnings: ${regionName} - ${roleName}`}
          contentLabel="learnings"
          listItems={lifeLearnings}
        />
      ]}
    />
  );
}
