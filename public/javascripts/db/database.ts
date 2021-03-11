import { connect, connection, Types, Connection, ObjectId, Document } from 'mongoose';
import UserFactsModel from './UserFacts.model';
import UserModel from './User.model';
import FactModel from './Fact.model';
import { IFact } from '../../../app.types';

function handleError(error: Error) {
  console.error(`Internal database error:  ${error}`);
}

async function createRelationships(UserId: number, FactData: IFact): Promise<number> {
  return new Promise(async (resolve, reject) => {
    try {
      // Guards
      if (!Types.ObjectId.isValid(UserId) || UserId <= 0) {
        console.log(`UserId request int URL is not valid: ${UserId}`); return 0;
      }

      // Create a User if none found

      let user: Document = await UserModel.findById(UserId);

      if (!user) {
        console.log("Creating User...");
        const newUser = await getNewUser();
        user = newUser;
      }

      console.log("User:", user._id);

      // Create a Fact if none found

      let fact = await FactModel.findOne({ _id: FactData.fact.id });

      if (!fact) {
        console.log("Saving fact...");

        fact = new FactModel();
        fact._id = FactData.fact.id;
        await fact.save();

        fact.updateOne({
          Text: FactData.fact.Text,
          Source: FactData.fact.Source,
          SourceUrl: FactData.fact.Source_url,
        });
      }

      console.log("Using Fact:", fact._id);

      // Create a UserFacts if none found

      let userFact = await UserFactsModel.findOne({ User: user._id, Fact: FactData.fact._id });

      if (!userFact) {
        console.log("Creating UserFact...");

        userFact = new UserFactsModel();

        userFact._id = Types.ObjectId();
        await userFact.save();
        await userFact.updateOne({
          User: user._id,
          Fact: fact._id
        });
      }

      console.log("Using UserFact:", userFact.id);

      // Resolve promise
      resolve(user._id);

      // Handle errors
    } catch (error) {
      console.log("Could not create relationship:", error);
      reject(0);
    }
  });
}

export function connectToDb(succeed: (db?: Connection) => void, fail?: (error?: Error) => void) {
  try {
    console.log("Attempting connection to DB...");

    // Connect to the DB
    connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const db = connection;

    // Report external errors
    db.on('error', error => fail(error));

    // Success callback
    db.once('open', async () => {
      console.log("Connected to DB");
      await succeed(db);

      await db.close();
      console.log("Disconnected Mongoose")
    });

    // Handle internal errors
  } catch (error) {
    handleError(error);
    fail()
  }
}

export function storeFact(data: { userId: number, fact: IFact }, succeed: () => void, fail?: () => void) {
  try {
    connectToDb(
      async () => {
        console.log("DB: Building relations...");
        await createRelationships(data.userId, data.fact); succeed();
        succeed();
      },
      () => {
        handleError(new Error("Could not store fact in DB."));
        if (fail) fail();
      });

  } catch (error) {
    handleError(error);
    return;
  }
}

export function getNewUser(): Promise<Document> {
  return new Promise((resolve, reject) => {
    // Connect to DB
    connectToDb(async () => {

      // Create new user
      process.stdout.write('Creating a new user...');
      const newUser = new UserModel();

      // Create new ID
      const newId = Types.ObjectId();
      process.stdout.write(`with ID: ${newId}...\n`)
      newUser._id = newId;

      // Save it to DB
      try {
        process.stdout.write("Saving to DB....");
        await newUser.save();
        process.stdout.write("OK.\n");
        resolve(newUser);
      } catch (error) {
        // Report error on failure
        process.stdout.write("failed.\n");
        handleError(error);
        reject(null);
      }
      return newUser;

    }, () => {
      // Errors
      handleError(new Error("Could not create new user on DB."));
      reject(null);
    });
  });
}

export async function getUserFacts(userId: number): Promise<IFact[]> {
  return new Promise((resolve, reject) => {
    try {
      UserFactsModel.find({}, (err, docs) => {
        const facts = docs.map((doc) => doc)
        resolve([]);
      });
    } catch (error) {
      reject(error);
      return null;
    }
  });
}