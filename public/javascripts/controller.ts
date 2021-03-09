import fetch from 'node-fetch';
import { storeFact } from './db/database';

import '../../app.types';
import { rejects } from 'assert';

const uri = `https://uselessfacts.jsph.pl/${process.env.FIXED ? 'today' : 'random'}.json`;

export async function getNewFact(userId: number): Promise<Fact> {
  try {
    const apiCall = await fetch(uri, {
      method: "GET",
    });

    const fact: Fact = {
      status: "OK",
      fact: await apiCall.json()
    }

    if (fact)
      storeFact({
        userId, fact
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
