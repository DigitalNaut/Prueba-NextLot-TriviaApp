import fetch from 'node-fetch';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

interface Fact {
  status: string
  fact?: object
  error?: unknown
}

function saveFactToDB(fact: Fact, succeed: () => void, fail: (error?: Error) => void) {
  try {
    mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const db = mongoose.connection;

    db.on('error', error => fail(error));
    db.once('open', () => {
      const collection = db.collection("Facts");

      

      succeed();
    })
  } catch (error) {
    fail(error);
  }
}

export async function getNewFact(): Promise<Fact> {
  try {
    const apiCall = await fetch("https://uselessfacts.jsph.pl/random.json", {
      method: "GET",
    });

    const json = apiCall.json();


    const fact: Fact = {
      status: "OK",
      fact: json
    }

    if (fact)
      saveFactToDB(fact, () => {
        console.log("Connected to Mongoose");
      }, (error) => {
        console.log("Could not connect to Mongoose:", error);
      });

    return fact;
  } catch (error) {
    return { status: "Error", error }
  }
}
