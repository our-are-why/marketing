import {
  ComponentChildren,
} from "preact";
import {
  LabelRow_DocumentSection,
} from "./LabelRow_DocumentSection.tsx";
import {
  type Poem_PoemCollection,
  POEM_SectionContent,
} from "./POEM_SectionContent.tsx";
import {
  __BASE_DocumentSection,
} from "../../shared/__BASE_DocumentSection.tsx";

export interface PoemCollection {
  name: string;
  date: string;
  poems: Array<Poem_PoemCollection>;
}

export interface Props__POEMS_DocumentSection {
  sectionDivider: ComponentChildren;
  poemCollection: PoemCollection;
}

export function POEMS_DocumentSection({
  sectionDivider,
  poemCollection,
}: Props__POEMS_DocumentSection) {
  return (
    <__BASE_DocumentSection
      className_contentContainer="contentContainer-poemsSection"
      sectionDivider={sectionDivider}
      accessibilityLabel={`poems: ${poemCollection.name}`}
      content={
        <>
          <LabelRow_DocumentSection
            rowLabels={[
              poemCollection.name,
              poemCollection.date,
            ]}
          />
          <div role="presentation" className="poemsContainer-poemsSection">
            {poemCollection.poems.map((poem_current) => (
              <POEM_SectionContent
                key={poem_current.title}
                poem={poem_current}
              />
            ))}
          </div>
        </>
      }
    />
  );
}
