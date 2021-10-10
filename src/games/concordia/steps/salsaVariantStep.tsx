import { InstanceStepLink } from "features/instance/InstanceStepLink";
import createProductDependencyMetaStep from "games/core/steps/createProductDependencyMetaStep";
import { createVariant } from "games/core/steps/createVariant";
import { BlockWithFootnotes } from "games/core/ux/BlockWithFootnotes";
import { ConcordiaProductId } from "../concordiaGame";
import { RESOURCE_NAME } from "../utils/resource";
import RomanTitle from "../ux/RomanTitle";

export default createVariant({
  id: "salsa",
  name: "Salsa",
  dependencies: [
    [createProductDependencyMetaStep<ConcordiaProductId>(), "salsa"],
  ],
  InstanceVariableComponent,
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
          Some cities now produce
          <Footnote index={1} /> <strong>{RESOURCE_NAME.salt}</strong>
          <Footnote index={2} /> which could be used as any other resource
          <Footnote index={3} />.
        </>
      )}
    </BlockWithFootnotes>
  );
}
