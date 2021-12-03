import LinkIcon from "@mui/icons-material/Link";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import { Box, Grid, IconButton, Typography } from "@mui/material";
import { coerce, invariant_violation, Random, Vec } from "common";
import { templateValue } from "features/template/templateSlice";
import { useEffect, useState } from "react";
import { PercentSlider } from "../ux/PercentSlider";
import { createGameStep } from "./createGameStep";
import {
  ConfigPanelProps,
  InstanceContext,
  RandomGameStep,
  TemplateContext,
} from "./createRandomGameStep";
import { OptionsWithDependencies } from "./OptionsWithDependencies";
import { buildQuery, Query } from "./Query";

interface TemplateConfig {
  // Numbers here are from 0 to 100!
  percent: number;
  conditionalPercent?: number;
}

type VariantGameStep = RandomGameStep<boolean, TemplateConfig>;

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
  InstanceVariableComponent(): JSX.Element;
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
  id,
  name,
  dependencies,
  conditional,
  InstanceVariableComponent,
  isTemplatable,
}: OptionsInternal): VariantGameStep {
  const baseStep = createGameStep({
    id: `variant_${id}`,
    labelOverride: name,
  });

  return {
    ...baseStep,

    isVariant: true,

    dependencies:
      conditional != null ? [conditional, ...dependencies] : dependencies,

    // Variants are not part of the regular display and don't run this method
    skip: () =>
      invariant_violation(
        `'skip' should never be called on variant: ${baseStep.id}!`
      ),

    extractInstanceValue: ({ [baseStep.id]: instanceValue }) =>
      coerce(
        instanceValue,
        (x: unknown): x is boolean | undefined =>
          x == null || typeof x === "boolean"
      ) ?? false,

    InstanceVariableComponent,

    canBeTemplated: (template, context) =>
      isTemplatable(
        ...Vec.map(dependencies, (dependency) =>
          dependency.query(template, context)
        )
      ),

    // The value can never be changed following changes in the template, it
    // could only be disabled via `canBeTemplated`
    refreshTemplateConfig(config, template, context) {
      if (config.conditionalPercent == null) {
        templateValue("unchanged");
      }

      // conditional must be non-null here because the config already has a
      // conditional component to it.
      const conditionalQuery = conditional!.query(template, context);
      if (
        conditionalQuery.canResolveTo(true) &&
        conditionalQuery.canResolveTo(false)
      ) {
        templateValue("unchanged");
      }

      // We only need to refresh the config if conditional is part of the
      // config, but is no longer a variant state (it's either never, or always,
      // both not requiring a specific conditional setting)
      return { percent: config.percent };
    },

    initialConfig: () => ({ percent: 100 }),

    hasValue: (_: TemplateContext | InstanceContext) => true,

    resolve: ({ percent, conditionalPercent }, instance, context) =>
      dependencies.every((dependency) =>
        // We check generally for falsy values (nulls, false, etc...)
        Boolean(dependency.extractInstanceValue(instance, context))
      )
        ? Random.coin_flip(
            (conditionalPercent != null &&
            // If conditionalPercent is non-null then conditional itself must be
            // non-null too, so we can extract the instance value for it and
            // use it if it's true.
            Boolean(conditional!.extractInstanceValue(instance, context))
              ? conditionalPercent
              : percent) / 100
          )
          ? true
          : null
        : null,

    query: (template) =>
      buildQuery(baseStep.id, {
        canResolveTo(value: boolean) {
          const element = template[baseStep.id];
          if (element == null) {
            return !value;
          }

          const { percent, conditionalPercent } =
            element.config as Readonly<TemplateConfig>;

          if (conditionalPercent == null) {
            // a variant can resolve to false if the percent is lower than 100
            // it can always resolve to true when a config is present
            return value || percent < 100;
          }

          // If both percent and conditionalPercent are present in the config,
          // by definition they would have different values, and that would mean
          // that we can't be in a situation where either true or false can't be
          // resolved via the config.
          return true;
        },

        onlyResolvableValue() {
          const element = template[baseStep.id];
          if (element == null) {
            return false;
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

    ConfigPanel: (props: ConfigPanelProps<TemplateConfig>) =>
      conditional != null ? (
        <ConditionalConfigPanel {...props} conditionalStep={conditional} />
      ) : (
        <SimpleConfigPanel {...props} />
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

function SimpleConfigPanel({
  config: { percent },
  onChange,
}: ConfigPanelProps<TemplateConfig>): JSX.Element {
  return <ConfigPanelSlider value={percent} onChange={onChange} />;
}

function ConditionalConfigPanel({
  config: { percent, conditionalPercent },
  queries: [conditional],
  onChange,
  conditionalStep,
}: ConfigPanelProps<TemplateConfig, boolean> & {
  conditionalStep: VariantGameStep;
}): JSX.Element {
  if (!conditional.canResolveTo(true) || !conditional.canResolveTo(false)) {
    return <ConfigPanelSlider value={percent} onChange={onChange} />;
  }

  return (
    <MultiSliderConfigPanel
      config={{ percent, conditionalPercent }}
      onChange={onChange}
      label={conditionalStep.label}
    />
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

  useEffect(() => {
    // Make sure that when sync is on we don't have a specific setting for the
    // conditional
    if (isSync) {
      if (conditionalPercent != null) {
        onChange(
          // This is equivalent to removing conditionalPercent from the config
          ({ percent }) => ({ percent })
        );
      }
    } else {
      if (conditionalPercent == null) {
        onChange(({ percent }) => ({
          percent,
          conditionalPercent: percent,
        }));
      }
    }
  }, [conditionalPercent, isSync, onChange]);

  return (
    <Grid container paddingX={1} textAlign="center">
      <Grid item xs={4} lineHeight={1}>
        <Typography variant="caption">
          <em>Without</em> {label}
        </Typography>
      </Grid>
      <Grid item xs={7} textAlign="center" paddingX={1}>
        <PercentSlider
          percent={percent}
          onChange={(percent) =>
            onChange(({ percent: _currentPercent, ...rest }) => ({
              percent,
              ...rest,
            }))
          }
          preventZero={isSync}
        />
      </Grid>
      <Grid item xs={1} />
      <Grid item xs={4} lineHeight={1}>
        <Typography variant="caption">
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
              conditionalPercent:
                newConditionalPercent !== percent
                  ? newConditionalPercent
                  : undefined,
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
          onClick={() => setSync((current) => !current)}
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
