import { createVariant } from "games/core/steps/createVariant";

export default createVariant({
  id: "swiftStart",
  name: "Swift-Start",
  dependencies: [],
  isTemplatable: () => true,
  noConfig: true,
  Description:
    "The easiest way to learn Wingspan is by following the Swift-Start guides.",
});
