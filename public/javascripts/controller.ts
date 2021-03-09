import fetch from 'node-fetch';
import { storeFact } from './db/database';

import '../../app.types';

export async function getNewFact(sessionId: number): Promise<Fact> {
  try {
    const apiCall = await fetch("https://uselessfacts.jsph.pl/random.json", {
      method: "GET",
    });

    const fact: Fact = {
      status: "OK",
      fact: await apiCall.json()
    }

    if (fact)
      storeFact({
        userId: sessionId, fact
      }, () => {
        console.log("Finished talking to Mongoose");
      }, (error: Error) => {
        console.log("Error connecting to Mongoose:", error);
      });

    return fact;
  } catch (error) {
    return { status: "Error", error }
  }
}
