import { Fact } from "./public/javascripts/db/Fact.model";

export interface IFact {
  fact: Fact
  errors?: unknown
}
