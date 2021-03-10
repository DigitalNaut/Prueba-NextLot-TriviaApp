import { Fact } from "./public/javascripts/db/Fact.model";

export interface IFact {
  status: string
  fact: Fact
  error?: unknown
}