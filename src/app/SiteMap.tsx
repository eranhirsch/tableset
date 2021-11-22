import { Collection } from "features/collection/Collection";
import { GameHomeWrapper } from "features/game/GameHome";
import { Games } from "features/game/Games";
import { Instance } from "features/instance/Instance";
import { PagedStep } from "features/instance/PagedStep";
import {
  TableOfContents,
  TABLE_OF_CONTENTS_PATH,
} from "features/instance/TableOfContents";
import { Players } from "features/players/Players";
import { Template } from "features/template/Template";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { App } from "./ux/App";

export function SiteMap(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Games />} />
          <Route path=":gameId" element={<GameHomeWrapper />} />
          <Route path="players" element={<Players />} />
          <Route path="template" element={<Template />} />
          <Route path="instance">
            <Route index element={<Instance />} />
            <Route
              path={TABLE_OF_CONTENTS_PATH}
              element={<TableOfContents />}
            />
            <Route path=":stepId" element={<PagedStep />} />
          </Route>
          <Route path="collection" element={<Collection />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
