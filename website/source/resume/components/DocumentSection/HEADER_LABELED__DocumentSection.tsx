import {
  LINK_HeaderLabel__DocumentSection,
  TEXT_HeaderLabel__DocumentSection,
} from "../../../shared/__BASE_DocumentSection.tsx";
import {
  __LABELED_DocumentSection,
} from "./__LABELED_DocumentSection.tsx";
import {
  TEXT_SectionContent,
} from "../SectionContent/TEXT_SectionContent.tsx";

export interface Props__HEADER_LABELED__DocumentSection {
  fullName: string;
  personDescriptors: string[];
  emailAddress: string;
  briefText: string;
  statusText: string;
  shortTerm_goalText: string;
  longTerm_goalText: string;
}

export function HEADER_LABELED__DocumentSection({
  fullName,
  personDescriptors,
  emailAddress,
  briefText,
  statusText,
  shortTerm_goalText,
  longTerm_goalText
}: Props__HEADER_LABELED__DocumentSection) {
  return (
    <__LABELED_DocumentSection
      sectionDivider={null}
      accessibilityLabel={`career overview: ${fullName}`}
      headerLabels={[
        <TEXT_HeaderLabel__DocumentSection
          key="name"
          label={fullName}
        />,
        ...personDescriptors.map((personDescriptor_current) => (
          <TEXT_HeaderLabel__DocumentSection
            key={personDescriptor_current}
            label={personDescriptor_current}
          />
        )),
        <LINK_HeaderLabel__DocumentSection
          key="email"
          label={emailAddress}
          linkHref={`mailto:${emailAddress}`}
        />
      ]}
      bodyContent={[
        <TEXT_SectionContent 
          key={0}
          accessibilityLabel={`career brief: ${fullName}`}
          contentLabel="brief"
          textContent={briefText}
        />,
        <TEXT_SectionContent 
          key={1}
          accessibilityLabel={`career status: ${fullName}`}
          contentLabel="status"
          textContent={statusText}
        />,
        <TEXT_SectionContent 
          key={2}
          accessibilityLabel={`short-term career goal: ${fullName}`}
          contentLabel="short-term goal"
          textContent={shortTerm_goalText}
        />,
        <TEXT_SectionContent 
          key={3}
          accessibilityLabel={`long-term career goal: ${fullName}`}
          contentLabel="long-term goal"
          textContent={longTerm_goalText}
        />
      ]}
    />
  );
}