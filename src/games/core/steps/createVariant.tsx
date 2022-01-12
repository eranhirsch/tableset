import LinkIcon from "@mui/icons-material/Link";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import { Box, Grid, IconButton, Stack, Typography } from "@mui/material";
import { invariant_violation, Random, Vec } from "common";
import { instanceValue } from "features/instance/instanceValue";
import { MetaGameStep } from "features/instance/MetaGameStep";
import { templateValue } from "features/template/templateSlice";
import { useState } from "react";
import { PercentSlider } from "../ux/PercentSlider";
import createConstantValueMetaStep from "./createConstantValueMetaStep";
import { createGameStep } from "./createGameStep";
import { ConfigPanelProps, RandomGameStep } from "./createRandomGameStep";
import { NoConfigPanel } from "./NoConfigPanel";
import { OptionsWithDependencies } from "./OptionsWithDependencies";
import { buildQuery, Query } from "./Query";

interface TemplateConfig {
  // Numbers here are from 0 to 100!
  percent: number;
  conditionalPercent?: number;
}

export type VariantGameStep = RandomGameStep<boolean, TemplateConfig> &
  MetaGameStep<boolean>;

interface Options<
  D1 = never,
  D2 = never,
  D3 = never,
  D4 = never,
  D5 = never,
  D6 = never,
  D7 = never,
  D8 = never,
  D9 = never,
  D10 = never
> extends OptionsWithDependencies<D1, D2, D3, D4, D5, D6, D7, D8, D9, D10> {
  id: string;
  name: string;
  isTemplatable(
    query1: Query<D1>,
    query2: Query<D2>,
    query3: Query<D3>,
    query4: Query<D4>,
    query5: Query<D5>,
    query6: Query<D6>,
    query7: Query<D7>,
    query8: Query<D8>,
    query9: Query<D9>,
    query10: Query<D10>
  ): boolean;
  conditional?: VariantGameStep;
  incompatibleWith?: VariantGameStep;
  Description: (() => JSX.Element) | string;
  noConfig?: true;
}

interface OptionsInternal
  extends Options<
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown
  > {
  isTemplatable(...queries: Query[]): boolean;
}

export function createVariant<
  D1 = never,
  D2 = never,
  D3 = never,
  D4 = never,
  D5 = never,
  D6 = never,
  D7 = never,
  D8 = never,
  D9 = never,
  D10 = never
>(options: Options<D1, D2, D3, D4, D5, D6, D7, D8, D9, D10>): VariantGameStep;
export function createVariant({
  conditional,
  dependencies,
  Description,
  id,
  incompatibleWith,
  isTemplatable,
  name,
  noConfig,
}: OptionsInternal): VariantGameStep {
  const baseStep = createGameStep({
    id: `variant_${id}`,
    labelOverride: name,
  });

  return {
    ...baseStep,

    isVariant: true,

    // computeInstanceValue is always called when the value is missing from the
    // instance. This makes it possible for us to hack the system so that we
    // return `false` when a value is missing from the instance instead of null.
    computeInstanceValue: () => false,

    dependencies: Vec.concat(
      [conditional ?? createConstantValueMetaStep(true)],
      [incompatibleWith ?? createConstantValueMetaStep(false)],
      dependencies
    ),

    // Variants are not part of the regular display and don't run this method
    skip: () =>
      invariant_violation(
        `'skip' should never be called on variant: ${baseStep.id}!`
      ),

    InstanceVariableComponent: () =>
      typeof Description === "string" ? (
        <Typography variant="body1">{Description}</Typography>
      ) : (
        <Description />
      ),

    canBeTemplated: (template, context) =>
      (incompatibleWith == null ||
        incompatibleWith.query(template, context).canResolveTo(false)) &&
      isTemplatable(
        ...Vec.map(dependencies, (dependency) =>
          dependency.query(template, context)
        )
      ),

    refreshTemplateConfig({ percent, conditionalPercent }, template, context) {
      if (conditionalPercent == null) {
        templateValue("unchanged");
      }

      // conditional must be non-null here because the config already has a
      // conditional component to it.
      const conditionalQuery = conditional!.query(template, context);

      if (!conditionalQuery.canResolveTo(true)) {
        // If conditional can no longer resolve to true we need to remove the
        // conditional part as it's no longer relevant.
        return { percent };
      }

      if (!conditionalQuery.canResolveTo(false)) {
        // Similarly, when the conditional is always true we no longer need a
        // setting for that case, and because the case for the conditional being
        // enabled is stored in the conditionalPercent, we need to copy the
        // value into `percent` and drop that extra field.
        return { percent: conditionalPercent };
      }

      // In any other case we don't need to change anything
      templateValue("unchanged");
    },

    initialConfig: { percent: 100 },

    resolve({ percent, conditionalPercent }, instance, context) {
      if (
        incompatibleWith != null &&
        instanceValue(incompatibleWith, instance, context)
      ) {
        // The incompatible variant is enabled so this variant can't be.
        return null;
      }

      if (
        dependencies.some(
          (step) =>
            // We use the Boolean function instead of casting to cover all falsy
            // values (nulls, undefined, 0, empty arrays, etc...)
            !Boolean(instanceValue(step, instance, context))
        )
      ) {
        // At least one of the dependencies are falsy
        return null;
      }

      const relevantValue =
        conditionalPercent != null &&
        // If conditionalPercent is non-null then conditional itself must be
        // non-null too, so we can extract the instance value for it and
        // use it if it's true.
        instanceValue(conditional!, instance, context)
          ? conditionalPercent
          : percent;

      return Random.coin_flip(relevantValue / 100) ? true : null;
    },

    query: (template, context) =>
      buildQuery(baseStep.id, {
        canResolveTo(value) {
          const element = template[baseStep.id];
          if (element == null) {
            return !value;
          }

          if (value) {
            // If we have a config we always have at least a way to resolve to
            // true (by definition, otherwise we would remove the config)
            return true;
          }

          // From here on the only value in question is `false` ----------

          if (
            incompatibleWith != null &&
            incompatibleWith.query(template, context).canResolveTo(true)
          ) {
            // If the incompatible dependency can resolve to true then there are
            // cases where we wouldn't resolve this variant
            return true;
          }

          const { percent, conditionalPercent } =
            element.config as Readonly<TemplateConfig>;

          if (conditionalPercent != null) {
            // If conditionalPercent is present in the config by definition it
            // would have different value from config, and that would mean that
            // we can't be in a situation where either true or false can't be
            // resolved via the config.
            return true;
          }

          // a variant can resolve to false if the percent is lower than 100
          return percent < 100;
        },

        onlyResolvableValue() {
          const element = template[baseStep.id];
          if (element == null) {
            return false;
          }

          if (
            incompatibleWith != null &&
            incompatibleWith.query(template, context).onlyResolvableValue() !==
              false
          ) {
            // If the incompatible dependency isn't only resolvable to false
            // then it's value might cause us to return true or false, so we
            // can't say what our only resolvable value is.
            return undefined;
          }

          const { percent, conditionalPercent } =
            element.config as Readonly<TemplateConfig>;

          if (conditionalPercent == null) {
            return percent === 100 ? true : percent === 0 ? false : undefined;
          }

          // If we have conditionalPercent then by definition we don't have a
          // single resolvable value
          return undefined;
        },
      }),

    ConfigPanel: (props: ConfigPanelProps<TemplateConfig, boolean, boolean>) =>
      noConfig ? (
        <NoConfigPanel.ConfigPanel />
      ) : (
        <ConfigPanel
          {...props}
          conditionalLabel={conditional?.label}
          incompatibleWithLabel={incompatibleWith?.label}
        />
      ),
    ConfigPanelTLDR: (props) => (
      <ConfigPanelTLDR {...props} conditionalStep={conditional} />
    ),

    InstanceCards: () =>
      invariant_violation(
        `Variant ${baseStep.id} should not be displayed as a card!`
      ),

    instanceAvroType: "boolean",
  };
}

function ConfigPanel({
  config,
  queries: [conditional, incompatibleWith],
  onChange,
  conditionalLabel,
  incompatibleWithLabel,
}: ConfigPanelProps<TemplateConfig, boolean, boolean> & {
  conditionalLabel?: string;
  incompatibleWithLabel?: string;
}): JSX.Element {
  const sliders =
    !conditional.canResolveTo(true) || !conditional.canResolveTo(false) ? (
      <ConfigPanelSlider value={config.percent} onChange={onChange} />
    ) : (
      <MultiSliderConfigPanel
        config={config}
        onChange={onChange}
        label={conditionalLabel!}
      />
    );

  if (!incompatibleWith.canResolveTo(true)) {
    return sliders;
  }

  return (
    <Stack direction="column" spacing={1}>
      {sliders}
      <Typography
        variant="caption"
        color="error"
        paddingX={6}
        textAlign="center"
      >
        Ignored when {incompatibleWithLabel} is <strong>Enabled</strong>
      </Typography>
    </Stack>
  );
}

function ConfigPanelSlider({
  value,
  onChange,
}: {
  value: number;
  onChange(
    newConfig: (
      currentConfig: Readonly<TemplateConfig>
    ) => Readonly<TemplateConfig>
  ): void;
}): JSX.Element {
  return (
    <Box textAlign="center" paddingX={2}>
      <PercentSlider
        percent={value}
        onChange={(percent) =>
          onChange(({ percent: _currentPercent, ...rest }) => ({
            percent,
            ...rest,
          }))
        }
        preventZero
      />
    </Box>
  );
}

function MultiSliderConfigPanel({
  config: { percent, conditionalPercent },
  onChange,
  label,
}: {
  config: Readonly<TemplateConfig>;
  onChange(
    newConfig:
      | Readonly<TemplateConfig>
      | ((currentConfig: Readonly<TemplateConfig>) => Readonly<TemplateConfig>)
  ): void;
  label: string;
}): JSX.Element {
  const [isSync, setSync] = useState(conditionalPercent == null);

  return (
    <Grid container paddingX={1} textAlign="center">
      <Grid item xs={4} lineHeight={1}>
        <Typography variant="caption" lineHeight={1}>
          <em>Without</em> {label}
        </Typography>
      </Grid>
      <Grid item xs={7} textAlign="center" paddingX={1}>
        <PercentSlider
          percent={percent}
          onChange={(percent) =>
            onChange(({ percent: currentPercent, conditionalPercent }) => ({
              percent,
              // Remove conditionalPercent when it's value is identical to
              // regular percent
              ...(isSync || conditionalPercent === percent
                ? {}
                : { conditionalPercent: conditionalPercent ?? currentPercent }),
            }))
          }
          preventZero={isSync || conditionalPercent === 0}
        />
      </Grid>
      <Grid item xs={1} />
      <Grid item xs={4} lineHeight={1}>
        <Typography variant="caption" lineHeight={1}>
          <strong>With</strong> {label}
        </Typography>
      </Grid>
      <Grid item xs={7} textAlign="center" paddingX={1}>
        <PercentSlider
          disabled={isSync}
          percent={conditionalPercent ?? percent}
          onChange={(newConditionalPercent) =>
            onChange(({ percent }) => ({
              percent,
              // When conditionalPercent is equal to percent we remove it, we don't
              // want to store meaningless settings.
              ...(newConditionalPercent !== percent
                ? { conditionalPercent: newConditionalPercent }
                : {}),
            }))
          }
          preventZero={percent === 0}
        />
      </Grid>
      <Grid item xs={1} alignItems="center" justifyContent="center">
        <IconButton
          disabled={percent === 0}
          size="small"
          color={isSync ? "default" : "primary"}
          onClick={() => {
            setSync((current) => !current);
            if (!isSync) {
              // reenabling sync so remove conditional setting (we deconstruct
              // without the prop, and then build a new object without it)
              onChange(({ percent }) => ({ percent }));
            }
          }}
        >
          {isSync ? (
            <LinkIcon fontSize="small" />
          ) : (
            <LinkOffIcon fontSize="small" />
          )}
        </IconButton>
      </Grid>
    </Grid>
  );
}

function ConfigPanelTLDR({
  config: { percent, conditionalPercent },
  conditionalStep,
}: {
  config: TemplateConfig;
  conditionalStep?: VariantGameStep;
}): JSX.Element {
  if (percent === 0) {
    return (
      <>
        {conditionalPercent === 100
          ? "Always"
          : `${conditionalPercent}% chance when`}{" "}
        with {conditionalStep!.label}
      </>
    );
  }

  return (
    <>
      {percent === 100 ? "Always" : `${percent}% chance`}
      {conditionalPercent != null && conditionalPercent !== percent && (
        <>
          {" "}
          (
          {conditionalPercent === 0
            ? "Never"
            : conditionalPercent === 100
            ? "Always"
            : `${conditionalPercent}% chance when`}{" "}
          with {conditionalStep!.label})
        </>
      )}
    </>
  );
}
