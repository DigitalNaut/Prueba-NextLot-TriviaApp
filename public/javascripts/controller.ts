import { receiveMessageOnPort } from "worker_threads";

interface Fact {
  status?: string
  fact: object
}

export function getNewFact(): string {
  return "Not implemented";
}
