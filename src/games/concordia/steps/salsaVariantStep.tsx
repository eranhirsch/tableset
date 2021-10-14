import { InstanceStepLink } from "features/instance/InstanceStepLink";
import { createVariant } from "games/core/steps/createVariant";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import { RESOURCE_NAME } from "../utils/resource";
import RomanTitle from "../ux/RomanTitle";
import productsMetaStep from "./productsMetaStep";

export default createVariant({
  id: "salsa",
  name: "Salsa",
  dependencies: [productsMetaStep],
  InstanceVariableComponent,
  isTemplatable: (products) => products.willContain("salsa"),
});

function InstanceVariableComponent(): JSX.Element {
  return (
    <BlockWithFootnotes
      footnotes={[
        <InstanceStepLink stepId="cityTiles" />,
        <InstanceStepLink stepId="resourcePiles" />,
        <>
          e.g. paying for houses via an <RomanTitle>Architect</RomanTitle>,
          buying cards via a <RomanTitle>Senator</RomanTitle> or a{" "}
          <RomanTitle>Consul</RomanTitle>, buying colonists with a{" "}
          <RomanTitle>Colonist</RomanTitle> or a{" "}
          <RomanTitle>Tribune</RomanTitle>, or <em>selling</em> resources via a{" "}
          <RomanTitle>Mercator</RomanTitle>.
        </>,
      ]}
    >
      {(Footnote) => (
        <>
          Some cities
          <Footnote index={1} /> now produce{" "}
          <strong>{RESOURCE_NAME.salt}</strong>
          <Footnote index={2} /> which could be used as any other resource
          <Footnote index={3} />.
        </>
      )}
    </BlockWithFootnotes>
  );
}
