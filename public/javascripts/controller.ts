import { default as axios, AxiosResponse } from 'axios'; // Provides autocomplete and parameter typings
import { storeFact } from './db/database';

import { IFact } from '../../app.types';
import { Fact } from '../javascripts/db/Fact.model';

enum Languages {
  en="en",
  de="de",
}

const uri = `https://uselessfacts.jsph.pl/${process.env.FIXED ? 'today' : 'random'}.json`;

export async function getNewFact(userId: number, language?: Languages): Promise<IFact> {
  try {
    let customUri: string;
    if (language) customUri = uri + "?language=" + language;

    const data: Fact = await axios.get(uri).then((value: AxiosResponse<Fact>) => value.data);

    console.log("Data type:", typeof data);

    const fact: IFact = {
      status: "OK",
      error: null,
      fact: data
    };

    if (fact)
      storeFact({
        userId, fact
      }, () => {
        console.log("Finished talking to Mongoose");
      }, () => {
        console.log("Error connecting to Mongoose.");
      });

    return fact;
  } catch (error) {
    return { status: "Error", error, fact: null }
  }
}
