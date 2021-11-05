import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
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
  Typography,
} from "@mui/material";
import { useAppSelector } from "app/hooks";
import { Dict, invariant, Random, Shape, Vec } from "common";
import {
  useOptionalInstanceValue,
  useRequiredInstanceValue,
} from "features/instance/useInstanceValue";
import { playersSelectors } from "features/players/playersSlice";
import { ConfigPanelProps } from "features/template/Templatable";
import { templateValue } from "features/template/templateSlice";
import {
  createRandomGameStep,
  VariableStepInstanceComponentProps,
} from "games/core/steps/createRandomGameStep";
import { Query } from "games/core/steps/Query";
import { GrammaticalList } from "games/core/ux/GrammaticalList";
import { playersMetaStep } from "games/global";
import { PlayerId } from "model/Player";
import React, { useMemo, useState } from "react";
import { ScytheProductId } from "../ScytheProductId";
import { FactionId, Factions } from "../utils/Factions";
import { MatId, PlayerMats } from "../utils/PlayerMats";
import playerMatsStep from "./playerMatsStep";
import productsMetaStep from "./productsMetaStep";

type BannedCombos = Partial<Record<MatId, readonly FactionId[]>>;

const DEFAULT_BANNED_COMBOS: Readonly<BannedCombos> = {
  // These were declared officially and added to the complete rule book
  // IMPORTANT: Keep sorted by mat id and internally by faction id!
  industrial: ["rusviet"],
  patriotic: ["crimea"],
};

type TemplateConfig = {
  always: readonly FactionId[];
  never: readonly FactionId[];
  banned: Readonly<BannedCombos>;
};

type Mode = "always" | "never" | "random";

export default createRandomGameStep({
  id: "factions",
  dependencies: [playersMetaStep, productsMetaStep, playerMatsStep],

  isTemplatable: () => true,

  initialConfig: (): Readonly<TemplateConfig> => ({
    always: [],
    never: [],
    banned: DEFAULT_BANNED_COMBOS,
  }),

  resolve,

  refresh({ always, never, ...rest }, players, products) {
    const available = Factions.availableForProducts(
      products.onlyResolvableValue()!
    );

    if (!Vec.is_empty(Vec.diff(always, available))) {
      // If always has values which are now unavailable, we can't fix the config
      // because we don't know how to fill the gap created by the missing
      // faction trivially (do we just remove it? do we replace it? etc...)
      templateValue("unfixable");
    }

    if (!players.willContainNumElements({ min: always.length })) {
      // There are more values in the always array then there are players, we
      // can't use the array and there's no trivial way to fix it either (what
      // faction do you remove?)
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
    return { always, never: Vec.intersect(never, available), ...rest };
  },

  ConfigPanel,
  ConfigPanelTLDR,

  InstanceVariableComponent,
});

function resolve(
  config: TemplateConfig,
  players: readonly PlayerId[] | null,
  products: readonly ScytheProductId[] | null,
  playerMatsIdx: number | null
): number {
  const available = Factions.availableForProducts(products!);

  const playerMats =
    playerMatsIdx != null
      ? PlayerMats.decode(playerMatsIdx, players!.length, products!)
      : null;

  // Random factions are those that aren't required by `always` and aren't
  // disallowed by `never`
  const randomFactions = Vec.diff(
    Vec.diff(available, config.never),
    config.always
  );

  // Candidates are all required factions (put first so they get priority) and
  // then the random factions. We randomize each section separately so that all
  // factions have the same probability of being chosen
  const candidates = Vec.concat(
    Random.shuffle(config.always),
    Random.shuffle(randomFactions)
  );

  const factionIds = Vec.range(0, players!.length - 1).reduce(
    (ongoing, index) =>
      Vec.concat(
        ongoing,
        randomFaction(
          ongoing,
          playerMats != null ? playerMats[index] : null,
          players!.length,
          candidates,
          config
        )
      ),
    [] as readonly FactionId[]
  );

  invariant(
    factionIds.length === players!.length,
    `Mismatch in number of factions chosen: ${JSON.stringify(
      factionIds
    )}, expected: ${players!.length}`
  );

  return Factions.encode(factionIds, products!);
}

function randomFaction(
  ongoing: readonly FactionId[],
  matId: MatId | null,
  playersCount: number,
  candidates: readonly FactionId[],
  { always, banned }: Readonly<TemplateConfig>
): FactionId {
  // We might not have mats data (that step might be turned off in the template)
  const bannedForMat = matId != null ? banned[matId] ?? [] : [];

  // Remove any factions already selected
  const unused = Vec.diff(candidates, ongoing);

  // Remove banned factions (if any)
  const unBanned = Vec.diff(unused, bannedForMat);

  // We need to account for factions that are part of the always array that
  // are banned for this specific mat, if we don't take them into account we
  // might not use the factions as required.
  const remainingRequired = Vec.diff(always, ongoing);
  const bannedRequired = Vec.intersect(remainingRequired, bannedForMat);

  // We  take the first elements of this array depending on how many factions we
  // already have chosen and how many players. This makes sure we always include
  // all `always` factions.
  const actualCandidates = Vec.take(
    unBanned,
    // Take just enough elements so that we always include `always` factions
    playersCount - ongoing.length - bannedRequired.length
  );

  // Pick a candidates faction and add it to the ongoing arr for the reducer
  return Vec.sample(actualCandidates, 1);
}

function ConfigPanel({
  config,
  queries: [players, products],
  onChange,
}: ConfigPanelProps<
  TemplateConfig,
  readonly PlayerId[],
  readonly ScytheProductId[]
>): JSX.Element {
  const [showBanned, setShowBanned] = useState(false);

  const productIds = products.onlyResolvableValue()!;
  const available = useMemo(
    () => Vec.sort(Factions.availableForProducts(productIds)),
    [productIds]
  );

  return (
    <Stack direction="column" spacing={1} padding={3}>
      <FactionsSelector
        config={config}
        productIds={productIds}
        onClick={(factionId) =>
          onChange((current) =>
            switchModes(
              current,
              factionId,
              currentMode(current, factionId),
              nextMode(current, factionId, players, available.length)
            )
          )
        }
      />
      <Button onClick={() => setShowBanned((current) => !current)}>
        {showBanned ? "Hide" : "Show"} Banned Combos
      </Button>
      <Collapse in={showBanned}>
        <BannedCombosSelector
          banned={config.banned}
          productIds={productIds}
          onClick={(matId, factionId) =>
            onChange(({ banned, ...rest }) => ({
              ...rest,
              banned: toggleBannedState(banned, matId, factionId),
            }))
          }
        />
      </Collapse>
    </Stack>
  );
}

function toggleBannedState(
  banned: Readonly<BannedCombos>,
  matId: MatId,
  factionId: FactionId
): Readonly<BannedCombos> {
  const bannedForMat = banned[matId];
  return Dict.sort({
    ...banned,
    [matId]:
      bannedForMat == null
        ? [factionId]
        : bannedForMat.includes(factionId)
        ? Vec.filter(bannedForMat, (fid) => fid !== factionId)
        : Vec.sort(Vec.concat(bannedForMat, factionId)),
  });
}

function FactionsSelector({
  config,
  productIds,
  onClick,
}: {
  config: Readonly<TemplateConfig>;
  productIds: readonly ScytheProductId[];
  onClick(factionId: FactionId): void;
}): JSX.Element {
  const available = useMemo(
    () => Vec.sort(Factions.availableForProducts(productIds)),
    [productIds]
  );
  return (
    <Box display="flex" flexWrap="wrap" justifyContent="center" gap={1}>
      {Vec.map(available, (factionId) => (
        <FactionChip
          key={factionId}
          factionId={factionId}
          mode={currentMode(config, factionId)}
          onClick={() => onClick(factionId)}
        />
      ))}
    </Box>
  );
}

function BannedCombosSelector({
  banned,
  productIds,
  onClick,
}: {
  banned: Readonly<BannedCombos>;
  productIds: readonly ScytheProductId[];
  onClick(matId: MatId, factionId: FactionId): void;
}): JSX.Element {
  const availablePlayerMats = useMemo(
    () => PlayerMats.availableForProducts(productIds),
    [productIds]
  );
  const availableFactions = useMemo(
    () => Factions.availableForProducts(productIds),
    [productIds]
  );
  return (
    <TableContainer>
      <Table size="small" padding="none">
        <TableBody>
          {Vec.map(availablePlayerMats, (matId) => (
            <TableRow key={matId}>
              <TableCell>{PlayerMats[matId].name}</TableCell>
              {Vec.map(availableFactions, (factionId) => (
                <TableCell key={`${matId}_${factionId}`} align="center">
                  <IconButton
                    size="small"
                    color={Factions[factionId].color}
                    onClick={() => onClick(matId, factionId)}
                    sx={{ padding: 0 }}
                  >
                    {banned[matId]?.includes(factionId) ? (
                      <HighlightOffTwoToneIcon fontSize="small" />
                    ) : (
                      <AddCircleOutlineIcon
                        fontSize="small"
                        sx={{ opacity: 0.25 }}
                      />
                    )}
                  </IconButton>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function FactionChip({
  factionId,
  mode,
  onClick,
}: {
  factionId: FactionId;
  mode: "always" | "never" | "random";
  onClick(): void;
}): JSX.Element {
  const { name, color } = Factions[factionId];
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
      variant={mode === "never" ? "outlined" : "filled"}
      color={color}
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
          Shape.select_keys(Factions, always),
          (fid, { name, color }) => (
            <Chip
              key={fid}
              component="span"
              color={color}
              size="small"
              label={name}
            />
          )
        ),
        unassignedCount > 0
          ? [
              <>
                {unassignedCount} random faction
                {unassignedCount > 1 && "s"}
                {!Vec.is_empty(never) && (
                  <>
                    {" "}
                    (but not{" "}
                    <GrammaticalList finalConjunction="or">
                      {React.Children.toArray(
                        Vec.map(never, (fid) => Factions[fid].name)
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
  value: factionIdx,
}: VariableStepInstanceComponentProps<number>): JSX.Element {
  const matsIdx = useOptionalInstanceValue(playerMatsStep);
  const playerIds = useRequiredInstanceValue(playersMetaStep);
  const products = useRequiredInstanceValue(productsMetaStep);

  const playerMatIds = useMemo(
    () =>
      matsIdx == null
        ? null
        : PlayerMats.decode(matsIdx, playerIds.length, products),
    [matsIdx, playerIds.length, products]
  );

  const factionIds = useMemo(
    () => Factions.decode(factionIdx, playerIds.length, products),
    [factionIdx, playerIds.length, products]
  );

  return (
    <>
      <Typography variant="body1">
        The factions {playerMatIds != null && "and matching player mats "}are:
      </Typography>
      <Stack
        spacing={1}
        direction="column"
        textAlign="center"
        paddingX={8}
        paddingY={2}
      >
        {React.Children.toArray(
          Vec.map_with_key(
            // Don't use Dict.select_keys here because that uses the order from
            // the source dict, not the keys array
            Dict.from_keys(factionIds, (factionId) => Factions[factionId]),
            (_, { name, color }, index) => (
              <Chip
                color={color}
                label={
                  <>
                    {playerMatIds != null &&
                      `${PlayerMats[playerMatIds[index]].name} `}
                    <strong>{name}</strong>
                  </>
                }
              />
            )
          )
        )}
      </Stack>
    </>
  );
}

const currentMode = (
  { always, never }: Readonly<TemplateConfig>,
  factionId: FactionId
): Mode =>
  always.includes(factionId)
    ? "always"
    : never.includes(factionId)
    ? "never"
    : "random";

function nextMode(
  config: Readonly<TemplateConfig>,
  factionId: FactionId,
  players: Query<readonly PlayerId[]>,
  numMats: number
): Mode {
  const alwaysEnabled = players.willContainNumElements({
    min: config.always.length + 1,
  });
  const neverEnabled = players.willContainNumElements({
    max: numMats - config.never.length - 1,
  });

  switch (currentMode(config, factionId)) {
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
  factionId: FactionId,
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
            ...config,
            always: Vec.filter(config.always, (fid) => fid !== factionId),
            never: Vec.sort(Vec.concat(config.never, factionId)),
          };
        case "random":
          return {
            ...config,
            always: Vec.filter(config.always, (fid) => fid !== factionId),
          };
      }
      break;

    case "never":
      switch (nextMode) {
        case "always":
          return {
            ...config,
            always: Vec.sort(Vec.concat(config.always, factionId)),
            never: Vec.filter(config.never, (fid) => fid !== factionId),
          };
        case "never":
          return config;
        case "random":
          return {
            ...config,
            never: Vec.filter(config.never, (fid) => fid !== factionId),
          };
      }
      break;

    case "random":
      switch (nextMode) {
        case "always":
          return {
            ...config,
            always: Vec.sort(Vec.concat(config.always, factionId)),
          };
        case "never":
          return {
            ...config,
            never: Vec.sort(Vec.concat(config.never, factionId)),
          };
        case "random":
          return config;
      }
  }
}
