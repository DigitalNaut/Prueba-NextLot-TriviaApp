import { connect, connection, Types, Connection, Document } from 'mongoose';
import UserFactsModel, { UserFacts, UserFactsSchema } from './UserFacts.model';
import UserModel, { UserSchema } from './User.model';
import FactModel, { Fact } from './Fact.model';
import { IFact } from '../../../app.types';
import '../../Utility';

function handleError(error: Error) {
  console.error(`Internal database error:  ${error}`);
}

async function createRelationships(UserId: string, FactData: Fact): Promise<number> {
  return new Promise(async (resolve, reject) => {
    try {
      // Guards
      if (!Types.ObjectId.isValid(UserId)) {
        console.log(`UserId in URL is not valid: ${UserId}`); return 0;
      }

      // Create a User if none found
      let user: Document = await UserModel.findById(UserId);

      if (!user) {
        console.log("Creating User...");
        const newUser = await getNewUser();
        user = newUser;
      }
      console.log("Target User ID:", user._id);

      // Create a Fact if none found
      const fact = await FactModel.findOne({ _id: FactData.id });
      if (!fact) {

        // Transcribe fact JSON to object
        console.log("Saving fact...");

        await fact.updateOne({
          _id: FactData.id,
          User: "",
          Text: FactData.Text,
          Language: FactData.Language,
          Source: FactData.Source,
          Source_url: FactData.Source_url,
        });

        await fact.save();
      }

      console.log("Using Fact:", fact._id);

      // Create a UserFacts if none found

      let userFact = await UserFactsModel.findOne({ User: user._id, Fact: FactData._id });

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

export async function connectToDb(): Promise<boolean> {
  return new Promise<boolean>(async (resolve, reject) => {
    try {
      console.log(`Connection to DB is: ${connection.readyState}`);

      // Guard
      if (connection.readyState) { resolve(true); return true }

      // Connect to the DB
      await connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      // Report external errors
      connection.on('error', error => { throw new Error(`Could not connect to DB: ${error}`) });

      if (connection.readyState)
        return true;
      else {
        // Success callback
        connection.once('open',
          async () => {
            console.log("Connected to DB");
            resolve(true)
            return true;
          });
      }
    }
    catch (error) {
      reject();
    }
  });
}

// Store fact in DB
export async function storeFact(factoid: IFact, resolve: (error?: Error) => void) {
  try {
    await connectToDb();

    console.log("DB: Building relations...");
    await createRelationships(factoid.userId, factoid.fact); resolve();

    resolve();
  } catch (error) {
    handleError(new Error("Could not store fact in DB."));
    resolve(error);
  }

  if (connection.readyState) {
    // Disconnect DB
    console.log("Disconnected Mongoose");
    await connection.close();
  }
}

// Get new userId from DB
export function getNewUser(): Promise<Document> {
  return new Promise(async (resolve, reject) => {
    // Connect to DB
    await connectToDb();

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

    // Disconnect DB
    console.log("Disconnected MongoDB");
    await connection.close();

    return newUser;
  });
}

function getFactsFromIds(factIds: string[]): Promise<Fact[]> {
  return new Promise((resolve, reject) => {
    try {
      // Build Facts array
      const factsList: Fact[] = new Array();
      if (factIds.length)
        factIds.forEach(

          // Parse individual fact
          async (factId: string, index: number, array: string[]) => {
            await FactModel.findById(
              { _id: factId },
              '',
              { useFindAndModify: false, limit: 100, },
              async (error: Error, doc: Fact) => {

                // Display progress
                const progress = ((index + 1) / array.length * 100).clamp(0, 100);
                process.stdout.write(`Inspecting ${progress}% : ${error ? `Error: ${error}` : `OK!`}\r`/* ,
                  (err) => err && process.stdout.clearLine(-1) */);

                // If valid, push it to the array,
                // else log error
                if (error) console.log("Error parsing: ", factId, " Error:", error);
                else factsList.push(doc);
              })

            // Once reached the end of the array
            // Resolve promise
            if (index === array.length - 1) {
              console.log(`Facts retrieved: ${factsList.length} `);
              resolve(factsList);
            }
          });
    } catch (error) {
      reject([])
    }
  });

}

export async function getUserFacts(userId: string): Promise<Fact[]> {
  return new Promise(async (resolve, reject) => {
    try {
      await connectToDb();

      // Find UserFacts by given userId
      console.log(`Fetching UserFacts for ID ${userId}`);
      const userFacts = await UserFactsModel.find({ User: userId },
        async (error: Error, docs: Document<UserFacts>[]) => {

          // Guards
          if (error) throw new Error(`Could not find UserFacts: ${error} `);

          // Find UserFacts for user
          const factIds = docs.map((doc: UserFacts) => {
            if (doc.User.length)
              return doc.Fact[0];
            else return "";
          });
          console.log(`Found ${factIds.length} Facts for user...`);

          // Construct
          const factsList = await getFactsFromIds(factIds);
          resolve(factsList);
        });
    } catch (error) {
      reject([]);
    }
  });
}