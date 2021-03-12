import { Fact } from "./public/javascripts/db/Fact.model";

export interface IFact {
  userId: string
  fact: Fact
  errors?: unknown
}
