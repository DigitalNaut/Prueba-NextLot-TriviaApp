import { default as axios, AxiosResponse } from 'axios'; // Provides autocomplete and parameter typings
import { storeFact } from './db/database';

import { IFact } from '../../app.types';

const uri = `https://uselessfacts.jsph.pl/${process.env.FIXED ? 'today' : 'random'}.json`;

export async function getNewFact(userId: number): Promise<IFact> {
  try {
    const data: IFact = await axios.get(uri).then((value: AxiosResponse<IFact>) => value.data);

    console.log("Data:", data);

    const fact: IFact = {
      status: "OK",
      error: null,
      fact: data.fact
    };

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
