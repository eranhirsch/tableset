import { Templatable } from "features/template/Templatable";
import { ContextBase } from "features/useFeaturesContext";
import { Query } from "./Query";

export interface Queryable<T> {
  query(
    template: Parameters<Templatable["canBeTemplated"]>[0],
    context: ContextBase
  ): Query<T>;
}