import {
  ComponentChildren,
} from "preact";
import {
  BAR_Divider,
} from "../../shared/Divider.tsx";
import {
  __BASE_DocumentSection,
} from "../../shared/__BASE_DocumentSection.tsx";
import {
  type Graphic,
  getConfigs_GraphicAsset,
  imageWidths_graphicAsset,
} from "../images.ts";
import {
  LINKED_LabelRow_DocumentSection,
} from "./LabelRow_DocumentSection.tsx";

export interface Props__LEADING_GRAPHIC__DocumentSection
  extends Pick<
    Props__BASE_GRAPHIC__DocumentSection,
    | "graphic"
  > {}

export function LEADING_GRAPHIC__DocumentSection({
  graphic,
}: Props__LEADING_GRAPHIC__DocumentSection) {
  return (
    <__BASE_GRAPHIC__DocumentSection
      imageLoading="eager"
      imageFetchPriority="high"
      sectionDivider={null}
      graphic={graphic}
    />
  );
}

export interface Props__LAZY_GRAPHIC__DocumentSection
  extends Pick<
    Props__BASE_GRAPHIC__DocumentSection,
    | "graphic"
  > {}

export function LAZY_GRAPHIC__DocumentSection({
  graphic,
}: Props__LAZY_GRAPHIC__DocumentSection) {
  return (
    <__BASE_GRAPHIC__DocumentSection
      imageLoading="lazy"
      imageFetchPriority="auto"
      sectionDivider={<BAR_Divider />}
      graphic={graphic}
    />
  );
}

interface Props__BASE_GRAPHIC__DocumentSection {
  sectionDivider: ComponentChildren;
  graphic: Graphic;
  imageLoading: "eager" | "lazy";
  imageFetchPriority: "high" | "auto";
}

function __BASE_GRAPHIC__DocumentSection({
  sectionDivider,
  graphic,
  imageLoading,
  imageFetchPriority,
}: Props__BASE_GRAPHIC__DocumentSection) {
  const imageFiles = getConfigs_GraphicAsset({
    graphic,
    imageWidths_graphicAsset,
  });
  const largestImageFile = imageFiles[imageFiles.length - 1];
  return (
    <__BASE_DocumentSection
      className_contentContainer="contentContainer-graphicSection"
      sectionDivider={sectionDivider}
      accessibilityLabel={`art: ${graphic.pieceName}`}
      content={
        <>
          <img
            className="image-graphicSection"
            decoding="async"
            sizes="(min-width: 832px) 804px, calc(100vw - 28px)"
            alt={graphic.imageDescription}
            width={largestImageFile.imageWidth}
            loading={imageLoading}
            fetchpriority={imageFetchPriority}
            src={`/assets/art/${largestImageFile.fileName}`}
            height={Math.round(
              largestImageFile.imageWidth * graphic.originalHeight /
                graphic.originalWidth,
            )}
            srcset={imageFiles
              .map((imageFile_current) =>
                `/assets/art/${imageFile_current.fileName} ${imageFile_current.imageWidth}w`
              )
              .join(", ")}
          />
          <LINKED_LabelRow_DocumentSection
            rowLabels={[graphic.pieceName, graphic.dateLabel]}
            rowLinks={[{
              label: "full size",
              href: `/assets/originals/${graphic.pieceName}.png`,
            }]}
          />
        </>
      }
    />
  );
}
