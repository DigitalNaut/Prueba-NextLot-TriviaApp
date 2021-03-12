import { default as axios, AxiosResponse } from 'axios'; // Provides autocomplete and parameter typings
import { storeFact } from './db/database';

import { IFact } from '../../app.types';
import { Fact } from '../javascripts/db/Fact.model';
import { stringify } from 'node:querystring';

export enum Languages {
  en = "en",
  de = "de",
}

const uri = `https://uselessfacts.jsph.pl/${process.env.FIXED ? 'today' : 'random'}.json`;

export async function getNewFact(userId: string, language?: Languages): Promise<IFact> {
  try {
    // Formulate composite URI
    let customUri: string = uri;
    customUri += language ? `?language=${language}` : "";
    console.log(`Calling external API: ${customUri}`)

    // Call API
    const data: Fact = await axios.get(customUri).then((value: AxiosResponse<Fact>) => value.data);
    console.log(`Data type: ${typeof data}`);

    // Construct new Fact wrapper
    const factoid: IFact = {
      userId: data.id,
      errors: data.errors,
      fact: data,
    };

    if (factoid)
      storeFact(factoid,
        (error: Error) => {
          if (error) throw new Error(`Could not store fact on DB: ${error}`);
          else console.log("Stored the fact on DB.");
        });

    return factoid;
  } catch (error) {
    return { userId, errors: error, fact: null }
  }
}
