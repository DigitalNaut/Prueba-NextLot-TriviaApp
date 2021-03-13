import { default as axios, AxiosResponse } from 'axios'; // Provides autocomplete and parameter typings
import * as db from './db/database';

import { IFact } from '../../app.types';
import { Fact } from '../javascripts/db/Fact.model';

export enum Language {
  EN = "en",
  DE = "de",
}

const uri = `https://uselessfacts.jsph.pl/${process.env.FIXED ? 'today' : 'random'}.json`;

export async function fetchNewFact(userId: string, language?: Language): Promise<IFact> {
  try {
    // Formulate composite URI
    let customUri: string = uri;
    customUri += language ? `?language=${language}` : "";
    console.log(`Calling external API: ${customUri}`)

    // Call API
    const factData: Fact = await axios.get(customUri)
      .then((response: AxiosResponse<Fact>) => response.data);

    // Construct new Fact wrapper
    const factoid: IFact = {
      // headers
      userId,
      errors: factData.errors,
      // payload
      fact: factData,
    };

    if (factoid)
      db.storeFactoid(factoid,
        (error: Error) => {
          if (error) throw new Error(`Could not store fact on DB: ${error}`);
          console.log("Stored the fact on DB.");
        });

    return factoid;
  } catch (error) {
    return { userId, errors: error, fact: null }
  }
}
