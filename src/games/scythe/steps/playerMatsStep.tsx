import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HighlightOffTwoToneIcon from "@mui/icons-material/HighlightOffTwoTone";
import NotInterestedRoundedIcon from "@mui/icons-material/NotInterestedRounded";
import {
  Box,
  Button,
  Chip,
  Collapse,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography
} from "@mui/material";
import { useAppSelector } from "app/hooks";
import { C, Dict, Random, Shape, Vec } from "common";
import {
  useOptionalInstanceValue,
  useRequiredInstanceValue
} from "features/instance/useInstanceValue";
import { playersSelectors } from "features/players/playersSlice";
import { ConfigPanelProps } from "features/template/Templatable";
import {
  templateValue,
  UnchangedTemplateValue
} from "features/template/templateSlice";
import {
  createRandomGameStep,
  VariableStepInstanceComponentProps
} from "games/core/steps/createRandomGameStep";
import { Query } from "games/core/steps/Query";
import { GrammaticalList } from "games/core/ux/GrammaticalList";
import { playersMetaStep } from "games/global";
import { PlayerId } from "model/Player";
import React, { useMemo, useState } from "react";
import { ScytheProductId } from "../ScytheProductId";
import { FactionId, Factions } from "../utils/Factions";
import { MatId, PlayerMats } from "../utils/PlayerMats";
import factionsStep from "./factionsStep";
import productsMetaStep from "./productsMetaStep";

const MAX_ATTEMPTS = 5;

type BannedCombos = Partial<Record<FactionId, readonly MatId[]>>;

const DEFAULT_BANNED_COMBOS: Readonly<BannedCombos> = {
  // These were declared officially and added to the complete rule book
  // IMPORTANT: Keep sorted by mat id and internally by faction id!
  crimea: ["patriotic"],
  rusviet: ["industrial"],
};

type TemplateConfig = {
  always: readonly MatId[];
  never: readonly MatId[];
  banned?: Readonly<BannedCombos>;
};

type Mode = "always" | "never" | "random";

class MatConstraintsError extends Error {
  constructor(
    public factionId: FactionId | null,
    public always: readonly MatId[],
    public banned: Readonly<BannedCombos> | undefined
  ) {
    super();
  }
}

export default createRandomGameStep({
  id: "playerMats",
  dependencies: [playersMetaStep, productsMetaStep, factionsStep],

  isType: (x: unknown): x is string => typeof x === "string",

  isTemplatable: () => true,

  initialConfig: (players, products, factions): Readonly<TemplateConfig> =>
    refresh({ always: [], never: [] }, players, products, factions),

  resolve,
  refresh,

  ConfigPanel,
  ConfigPanelTLDR,

  InstanceVariableComponent,
});

function resolve(
  config: TemplateConfig,
  players: readonly PlayerId[] | null,
  products: readonly ScytheProductId[] | null,
  factionIds: readonly FactionId[] | null
): string {
  const available = PlayerMats.availableForProducts(products!);

  // Random mats are those that aren't required by `always` and aren't
  // disallowed by `never`
  const randomMats = Vec.diff(Vec.diff(available, config.never), config.always);

  if (factionIds == null) {
    // When we don't have faction ids we simply need to pick a combination of
    // mats, we don't need to randomize the order, we also don't need all the
    // complex logic for checking and comparing against banned combos.
    const matIds = Vec.concat(
      config.always,
      Vec.sample(randomMats, players!.length - config.always.length)
    );
    return PlayerMats.encode(matIds, false, products!);
  }

  let attempts = 0;
  while (true) {
    // Candidates are all required mats (put first so they get priority) and
    // then the random mats. We randomize each section separately so that all
    // mats have the same probability of being chosen
    const candidates = Vec.concat(
      Random.shuffle(config.always),
      Random.shuffle(randomMats)
    );

    try {
      const matIds = Vec.range(0, players!.length - 1).reduce(
        (ongoing, index) =>
          Vec.concat(
            ongoing,
            randomMat(
              ongoing,
              factionIds[index],
              players!.length,
              candidates,
              config
            )
          ),
        [] as readonly MatId[]
      );
      return PlayerMats.encode(matIds, true, products!);
    } catch (error) {
      if (!(error instanceof MatConstraintsError)) {
        throw error;
      }

      if (attempts >= MAX_ATTEMPTS) {
        throw error;
      }

      // Swallow the error and retry
      attempts++;
    }
  }
}

function randomMat(
  ongoing: readonly MatId[],
  factionId: FactionId | null,
  playersCount: number,
  candidates: readonly MatId[],
  { always, banned }: Readonly<TemplateConfig>
): MatId {
  // We might not have factions data (that step might be turned off in the
  // template)
  const bannedForFaction =
    factionId != null && banned != null ? banned[factionId] ?? [] : [];

  // Remove any mats already selected
  const unused = Vec.diff(candidates, ongoing);

  // Remove banned mats (if any)
  const notBanned = Vec.diff(unused, bannedForFaction);

  // We need to account for factions that are part of the always array that
  // are banned for this specific mat, if we don't take them into account we
  // might not use the factions as required.
  const remainingRequired = Vec.diff(always, ongoing);
  const bannedRequired = Vec.intersect(remainingRequired, bannedForFaction);

  // We  take the first elements of this array depending on how many factions we
  // already have chosen and how many players. This makes sure we always include
  // all `always` factions.
  const actualCandidates = Vec.take(
    notBanned,
    // Take just enough elements so that we always include `always` factions
    playersCount - ongoing.length - bannedRequired.length
  );

  if (Vec.is_empty(actualCandidates)) {
    throw new MatConstraintsError(factionId, always, banned);
  }

  // Pick a candidates faction and add it to the ongoing arr for the reducer
  return Vec.sample(actualCandidates, 1);
}

function refresh(
  config: Readonly<TemplateConfig>,
  players: Query<readonly PlayerId[]>,
  productsQuery: Query<readonly ScytheProductId[]>,
  factions: Query<readonly FactionId[]>
): Readonly<TemplateConfig> {
  const productIds = productsQuery.onlyResolvableValue()!;

  let refreshedAlwaysNever = null;
  try {
    refreshedAlwaysNever = refreshAlwaysNever(config, players, productIds);
  } catch (error) {
    if (!(error instanceof UnchangedTemplateValue)) {
      // Ignore these exceptions, we want to merge their logic
      throw error;
    }
  }

  const { banned } = refreshBanned(config, productIds, factions);

  return {
    always:
      refreshedAlwaysNever != null
        ? refreshedAlwaysNever.always
        : config.always,
    never:
      refreshedAlwaysNever != null ? refreshedAlwaysNever.never : config.never,
    banned,
  };
}

function refreshAlwaysNever(
  { always, never }: Readonly<TemplateConfig>,
  players: Query<readonly PlayerId[]>,
  productIds: readonly ScytheProductId[]
): Omit<TemplateConfig, "banned"> {
  const available = PlayerMats.availableForProducts(productIds);

  if (!Vec.is_empty(Vec.diff(always, available))) {
    // If always has values which are now unavailable, we can't fix the config
    // because we don't know how to fill the gap created by the missing
    // mat trivially (do we just remove it? do we replace it? etc...)
    templateValue("unfixable");
  }

  if (!players.willContainNumElements({ min: always.length })) {
    // There are more values in the always array then there are players, we
    // can't use the array and there's no trivial way to fix it either (what
    // mat do you remove?)
    templateValue("unfixable");
  }

  if (Vec.contained_in(never, available)) {
    // At this point the 'always' array is valid, so if the never array
    // doesn't require any fixing too, we don't need to touch the config.
    templateValue("unchanged");
  }

  // The only case we need to fix is when the 'never' array contains elements
  // which aren't available anymore; for normalization, we want to remove them
  // from the 'never' array too
  return { always, never: Vec.intersect(never, available) };
}

/**
 * This method take either the current or the default ban list, and updates it
 * based on the state of the factions step and products.
 * Important: DO NOT CALL templateValue('unchanged') as this method is also
 * used in the `initialConfig` config hook where it won't be able to handle the
 * special value.
 */
function refreshBanned(
  { banned, never }: Readonly<TemplateConfig>,
  productIds: readonly ScytheProductId[],
  factions: Query<readonly FactionId[]>
): Readonly<Pick<TemplateConfig, "banned">> {
  if (!factions.willResolve()) {
    return {};
  }

  const availableFactions = Factions.availableForProducts(productIds);
  const availableMats = PlayerMats.availableForProducts(productIds);

  const relevantFactions = Vec.filter(
    availableFactions,
    (fid) => factions.willContain(fid) !== false
  );
  const relevantMats = Vec.diff(availableMats, never);

  const refreshedBanned = Dict.sort(
    Shape.filter(
      Dict.map(
        Shape.select_keys(banned ?? DEFAULT_BANNED_COMBOS, relevantFactions),
        (bannedMats) => Vec.sort(Vec.intersect(bannedMats, relevantMats))
      ),
      (bannedMats) => !Vec.is_empty(bannedMats)
    )
  );

  if (
    !Dict.is_empty(
      Dict.filter(
        refreshedBanned,
        (bannedMats) => bannedMats.length === availableMats.length
      )
    )
  ) {
    // If at least one faction has all available mats banned then that faction
    // is unplayable. This is unfixable because we don't know what mat to un-
    // ban.
    templateValue("unfixable");
  }

  if (
    Dict.size(refreshedBanned) === relevantFactions.length &&
    availableMats.some((mid) =>
      Dict.is_empty(
        Dict.filter(refreshedBanned, (bannedMats) => !bannedMats.includes(mid))
      )
    )
  ) {
    // If all factions have at least one banned mat, and for a specific mat id
    // all factions have it included in their banned list, it means that this
    // mat is now banned for all factions. This is unfixable because we don't
    // know what faction to un-ban.
    templateValue("unfixable");
  }

  return { banned: refreshedBanned };
}

function ConfigPanel({
  config,
  queries: [players, products, factions],
  onChange,
}: ConfigPanelProps<
  TemplateConfig,
  readonly PlayerId[],
  readonly ScytheProductId[],
  readonly FactionId[]
>): JSX.Element {
  const [showBanned, setShowBanned] = useState(false);

  const productIds = products.onlyResolvableValue()!;
  const available = useMemo(
    () =>
      Vec.sort_by(
        PlayerMats.availableForProducts(productIds),
        (mid) => PlayerMats[mid].rank
      ),
    [productIds]
  );

  return (
    <Stack direction="column" spacing={2} padding={3}>
      <MatsSelector
        config={config}
        productIds={productIds}
        onClick={(matId) =>
          onChange((current) =>
            switchModes(
              current,
              matId,
              currentMode(current, matId),
              nextMode(current, matId, players, available.length)
            )
          )
        }
      />
      {config.banned != null && (
        <>
          <Collapse in={showBanned}>
            <BannedCombosSelector
              config={config}
              productIds={productIds}
              factionsQuery={factions}
              onClick={(factionId, matId) =>
                onChange(({ banned, ...rest }) => ({
                  ...rest,
                  banned: toggleBannedState(banned!, factionId, matId),
                }))
              }
            />
          </Collapse>
          <Button
            size="small"
            onClick={() => setShowBanned((current) => !current)}
          >
            {showBanned ? "Hide" : "Show"} Banned Combos
          </Button>
        </>
      )}
    </Stack>
  );
}

function toggleBannedState(
  banned: Readonly<BannedCombos>,
  factionId: FactionId,
  matId: MatId
): Readonly<BannedCombos> {
  const bannedForFaction = banned[factionId];
  return Dict.sort({
    ...banned,
    [factionId]:
      bannedForFaction == null
        ? [matId]
        : bannedForFaction.includes(matId)
        ? Vec.filter(bannedForFaction, (mid) => mid !== matId)
        : Vec.sort(Vec.concat(bannedForFaction, matId)),
  });
}

function MatsSelector({
  config,
  productIds,
  onClick,
}: {
  config: Readonly<TemplateConfig>;
  productIds: readonly ScytheProductId[];
  onClick(matId: MatId): void;
}): JSX.Element {
  const available = useMemo(
    () =>
      Vec.sort_by(
        PlayerMats.availableForProducts(productIds),
        (mid) => PlayerMats[mid].rank
      ),
    [productIds]
  );
  return (
    <Box display="flex" flexWrap="wrap" justifyContent="center" gap={1}>
      {Vec.map(available, (matId) => (
        <MatChip
          key={matId}
          matId={matId}
          mode={currentMode(config, matId)}
          onClick={() => onClick(matId)}
        />
      ))}
    </Box>
  );
}

function BannedCombosSelector({
  config: { banned, never },
  productIds,
  factionsQuery,
  onClick,
}: {
  config: Readonly<TemplateConfig>;
  productIds: readonly ScytheProductId[];
  factionsQuery: Query<readonly FactionId[]>;
  onClick(factionId: FactionId, matId: MatId): void;
}): JSX.Element {
  const availableFactions = useMemo(
    () =>
      Vec.sort(
        Vec.filter(
          Factions.availableForProducts(productIds),
          (factionId) => factionsQuery.willContain(factionId) !== false
        )
      ),
    [factionsQuery, productIds]
  );
  const availablePlayerMats = useMemo(
    () =>
      Vec.sort(Vec.diff(PlayerMats.availableForProducts(productIds), never)),
    [never, productIds]
  );

  const requiredFactionsForMat = useMemo(
    () =>
      Dict.map(
        Shape.group_by(
          Vec.entries(
            Shape.filter_nulls(
              Dict.map(banned!, (bannedMats) =>
                C.only(Vec.diff(availablePlayerMats, bannedMats))
              )
            )
          ),
          ([_, matId]) => matId
        ),
        (pairs) => Vec.map(pairs, ([factionId]) => factionId)
      ),
    [availablePlayerMats, banned]
  );

  return (
    <TableContainer>
      <Table size="small" padding="none">
        <TableBody>
          {Vec.map(availablePlayerMats, (matId) => (
            <BannedComboMatRow
              key={matId}
              matId={matId}
              factionIds={availableFactions}
              bannedPerFaction={banned!}
              requiredFactions={requiredFactionsForMat[matId]}
              onClick={(factionId) => onClick(factionId, matId)}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function BannedComboMatRow({
  matId,
  factionIds,
  bannedPerFaction,
  requiredFactions,
  onClick,
}: {
  matId: MatId;
  factionIds: readonly FactionId[];
  bannedPerFaction: Readonly<BannedCombos>;
  requiredFactions: readonly FactionId[] | undefined;
  onClick(factionId: FactionId): void;
}): JSX.Element {
  const banned = useMemo(
    () =>
      Vec.keys(Shape.filter(bannedPerFaction, (mats) => mats.includes(matId))),
    [bannedPerFaction, matId]
  );
  return (
    <TableRow>
      <TableCell sx={{ opacity: Vec.is_empty(banned) ? 0.25 : 1.0 }}>
        {PlayerMats[matId].name}
      </TableCell>
      {Vec.map(factionIds, (factionId) => (
        <BannedComboFactionButton
          key={`${matId}_${factionId}`}
          factionId={factionId}
          mode={
            banned.includes(factionId)
              ? "banned"
              : banned.length >= factionIds.length - 1 ||
                requiredFactions?.includes(factionId)
              ? "required"
              : "optional"
          }
          onClick={() => onClick(factionId)}
        />
      ))}
    </TableRow>
  );
}

function BannedComboFactionButton({
  factionId,
  mode,
  onClick,
}: {
  factionId: FactionId;
  mode: "banned" | "optional" | "required";
  onClick(): void;
}): JSX.Element {
  return (
    <TableCell align="center">
      <IconButton
        size="small"
        color={Factions[factionId].color}
        onClick={mode !== "required" ? onClick : undefined}
        sx={{ padding: 0 }}
      >
        {mode === "banned" ? (
          <HighlightOffTwoToneIcon fontSize="small" />
        ) : mode === "optional" ? (
          <AddRoundedIcon fontSize="small" sx={{ opacity: 0.25 }} />
        ) : (
          <CheckCircleIcon fontSize="small" />
        )}
      </IconButton>
    </TableCell>
  );
}

function MatChip({
  matId,
  mode,
  onClick,
}: {
  matId: MatId;
  mode: "always" | "never" | "random";
  onClick(): void;
}): JSX.Element {
  const { name } = PlayerMats[matId];
  return (
    <Chip
      sx={{
        opacity: mode === "never" ? 0.75 : 1.0,
        paddingX:
          mode === "random" ? "13px" : mode === "always" ? undefined : "3px",
      }}
      icon={
        mode === "always" ? (
          <CheckCircleIcon fontSize="small" />
        ) : mode === "never" ? (
          <NotInterestedRoundedIcon fontSize="small" />
        ) : undefined
      }
      color={mode === "always" ? "primary" : undefined}
      variant={mode === "never" ? "outlined" : "filled"}
      label={
        mode === "always" ? (
          <strong>{name}</strong>
        ) : mode === "never" ? (
          <em>{name}</em>
        ) : (
          name
        )
      }
      onClick={onClick}
    />
  );
}

function ConfigPanelTLDR({
  config: { always, never },
}: {
  config: Readonly<TemplateConfig>;
}): JSX.Element {
  const playersCount = useAppSelector(playersSelectors.selectTotal);

  if (Vec.is_empty(always) && Vec.is_empty(never)) {
    // Just for consistency with other templatables
    return <>Random</>;
  }

  const unassignedCount = playersCount - always.length;

  return (
    <GrammaticalList>
      {Vec.concat(
        Vec.map_with_key(
          Dict.select_keys(PlayerMats, always),
          (mid, { name }) => <React.Fragment key={mid}>{name}</React.Fragment>
        ),
        unassignedCount > 0
          ? [
              <>
                {unassignedCount} random mat
                {unassignedCount > 1 && "s"}
                {!Vec.is_empty(never) && (
                  <>
                    {" "}
                    (but not{" "}
                    <GrammaticalList finalConjunction="or">
                      {React.Children.toArray(
                        Vec.map(never, (mid) => PlayerMats[mid].name)
                      )}
                    </GrammaticalList>
                    )
                  </>
                )}
              </>,
            ]
          : []
      )}
    </GrammaticalList>
  );
}

function InstanceVariableComponent({
  value: matsHash,
}: VariableStepInstanceComponentProps<string>): JSX.Element {
  const factionIds = useOptionalInstanceValue(factionsStep);
  const playerIds = useRequiredInstanceValue(playersMetaStep);
  const products = useRequiredInstanceValue(productsMetaStep);

  const matIds = useMemo(
    () =>
      Vec.sort_by(
        PlayerMats.decode(
          matsHash,
          playerIds.length,
          factionIds != null,
          products
        ),
        (mid) => PlayerMats[mid].rank
      ),
    [factionIds, matsHash, playerIds.length, products]
  );

  return (
    <Stack direction="column" spacing={1} alignItems="center">
      <Typography variant="body1" sx={{ width: "100%" }}>
        The player mats {factionIds != null && "and matching factions "}are:
      </Typography>
      <Stack spacing={1} direction="column" textAlign="center">
        {React.Children.toArray(
          Vec.map(
            // Don't use Dict.select_keys here because that uses the order from
            // the source dict, not the keys array
            Vec.zip(
              Vec.map(matIds, (matId) => PlayerMats[matId]),
              factionIds != null
                ? Vec.map(factionIds, (fid) => Factions[fid])
                : Vec.fill(matIds.length, null)
            ),
            ([{ name }, faction]) =>
              faction == null ? (
                <strong>{name}</strong>
              ) : (
                <Chip
                  color={faction.color}
                  label={
                    <>
                      <em>{name}</em> {faction.name}
                    </>
                  }
                />
              )
          )
        )}
      </Stack>
    </Stack>
  );
}

const currentMode = (
  { always, never }: Readonly<TemplateConfig>,
  matId: MatId
): Mode =>
  always.includes(matId)
    ? "always"
    : never.includes(matId)
    ? "never"
    : "random";

function nextMode(
  config: Readonly<TemplateConfig>,
  matId: MatId,
  players: Query<readonly PlayerId[]>,
  numMats: number
): Mode {
  const alwaysEnabled = players.willContainNumElements({
    min: config.always.length + 1,
  });
  const neverEnabled = players.willContainNumElements({
    max: numMats - config.never.length - 1,
  });

  switch (currentMode(config, matId)) {
    case "always":
      return neverEnabled ? "never" : "random";
    case "never":
      return "random";
    case "random":
      return alwaysEnabled ? "always" : neverEnabled ? "never" : "random";
  }
}

function switchModes(
  config: Readonly<TemplateConfig>,
  matId: MatId,
  currentMode: Mode,
  nextMode: Mode
): Readonly<TemplateConfig> {
  switch (currentMode) {
    case "always":
      switch (nextMode) {
        case "always":
          return config;
        case "never":
          return {
            always: Vec.filter(config.always, (mid) => mid !== matId),
            never: Vec.sort(Vec.concat(config.never, matId)),
            banned:
              config.banned == null
                ? undefined
                : removeFromBannedCombos(config.banned, matId),
          };
        case "random":
          return {
            ...config,
            always: Vec.filter(config.always, (mid) => mid !== matId),
          };
      }
      break;

    case "never":
      switch (nextMode) {
        case "always":
          return {
            ...config,
            always: Vec.sort(Vec.concat(config.always, matId)),
            never: Vec.filter(config.never, (mid) => mid !== matId),
          };
        case "never":
          return config;
        case "random":
          return {
            ...config,
            never: Vec.filter(config.never, (mid) => mid !== matId),
          };
      }
      break;

    case "random":
      switch (nextMode) {
        case "always":
          return {
            ...config,
            always: Vec.sort(Vec.concat(config.always, matId)),
          };
        case "never":
          return {
            ...config,
            never: Vec.sort(Vec.concat(config.never, matId)),
            banned:
              config.banned == null
                ? undefined
                : removeFromBannedCombos(config.banned, matId),
          };
        case "random":
          return config;
      }
  }
}

const removeFromBannedCombos = (
  banned: Readonly<BannedCombos>,
  matId: MatId
): Readonly<BannedCombos> =>
  Shape.filter(
    Dict.map(banned, (bannedMats) =>
      Vec.filter(bannedMats, (mid) => mid !== matId)
    ),
    (bannedMats) => !Vec.is_empty(bannedMats)
  );
