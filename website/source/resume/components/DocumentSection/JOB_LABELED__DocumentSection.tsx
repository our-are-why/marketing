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
import {
  WRAPLIST_SectionContent,
} from "../SectionContent/WRAPLIST_SectionContent.tsx";

export interface Props__JOB_LABELED__DocumentSection {
  companyName: string;
  teamName: string;
  jobTitle: string;
  dateRange: string;
  productDescription: string;
  workResponsibilities: string[];
  techStack: string[];
}

export function JOB_LABELED__DocumentSection({
  companyName,
  jobTitle,
  teamName,
  dateRange,
  productDescription,
  workResponsibilities,
  techStack
}: Props__JOB_LABELED__DocumentSection) {
  return (
    <__LABELED_DocumentSection
      sectionDivider={<BAR_Divider />}
      accessibilityLabel={`job: ${companyName} - ${jobTitle}`}
      headerLabels={[
        <TEXT_HeaderLabel__DocumentSection 
          key={0}
          label={companyName}
        />,
        <TEXT_HeaderLabel__DocumentSection 
          key={1}
          label={teamName}
        />,
        <TEXT_HeaderLabel__DocumentSection 
          key={2}
          label={jobTitle}
        />,
        <TEXT_HeaderLabel__DocumentSection 
          key={3}
          label={dateRange}
        />
      ]}
      bodyContent={[
        <TEXT_SectionContent
          key={0}
          accessibilityLabel={`product description: ${companyName} - ${jobTitle}`}
          contentLabel="product"
          textContent={productDescription}
        />,
        <COLUMNLIST_SectionContent
          key={1}
          accessibilityLabel={`job responsibilities: ${companyName} - ${jobTitle}`}
          contentLabel="responsibilities"
          listItems={workResponsibilities}
        />,
        <WRAPLIST_SectionContent
          key={2}
          accessibilityLabel={`technology used: ${companyName} - ${jobTitle}`}
          contentLabel="tech"
          listItems={techStack}
        />
      ]}
    />
  );
}