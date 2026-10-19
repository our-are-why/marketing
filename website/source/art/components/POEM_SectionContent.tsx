import type {
  ComponentChildren,
} from "preact";
import {
  __BASE_SectionContent,
} from "../../shared/__BASE_SectionContent.tsx";

export interface Poem_PoemCollection {
  title: string;
  signature: string;
  content: ComponentChildren;
}

export interface Props__POEM_SectionContent {
  poem: Poem_PoemCollection;
}

export function POEM_SectionContent({
  poem
}: Props__POEM_SectionContent) {
  return (
    <__BASE_SectionContent
      accessibilityLabel={`poem: ${poem.title}`}
      contentLabel={poem.title}
      content={
        <div
          role="presentation"
          className="container-poemContent"
        >
          {poem.content}
          <div className="signature-poemContent">
            {poem.signature}
          </div>
        </div>
      }
    />
  );
}

export interface Props__PoemStanza {
  stanzaLines: string[];
}

export function PoemStanza({
  stanzaLines
}: Props__PoemStanza) {
  return (
    <div role="paragraph" className="stanza-poemContent">
      {stanzaLines.map((line_current, index_line) => (
        <div key={index_line}>{line_current}</div>
      ))}
    </div>
  );
}

export interface Props__PoemPause {
  pauseBeats: number;
}

export function PoemPause({
  pauseBeats
}: Props__PoemPause) {
  return (
    <div role="presentation" className="pause-poemContent">
      {Array.from({ length: pauseBeats }, (_, index_beat) => (
        <div key={index_beat} />
      ))}
    </div>
  );
}
