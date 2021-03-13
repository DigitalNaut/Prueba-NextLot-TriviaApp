import { connect, connection, Types } from 'mongoose';
import UserFactModel, { UserFact } from './UserFact.model';
import UserModel, { User } from './User.model';
import FactModel, { Fact } from './Fact.model';
import { IFact } from '../../../app.types';
import '../../Utility';

function handleError(error: string) {
  console.error(`Internal database error:  ${error}`);
}

async function createFactOnDb(factData: Fact): Promise<Fact> {
  // Connect to DB
  await connectToDb();
  console.log(`----- Creating Fact on DB ------`);


  return new Promise(async (resolve, reject) => {
    try {
      console.log(`Attempting to store Fact with ID (${factData.id})`);
      const fact = await FactModel.findOneAndUpdate({ _id: factData.id }, factData, { new: true, upsert: true });

      resolve(fact);
      // Error handling
    } catch (error) {
      reject(error);
    }
  });
}

async function buildUserFactOnDb(factoid: IFact): Promise<number> {
  // Connect to DB
  await connectToDb();
  console.log(`----- Building UserFact on DB ------`);

  return new Promise(async (resolve, reject) => {
    try {
      console.log(`User ID on Factoid:`, factoid.userId);

      // Find user from factoid
      const user: User = await UserModel.findOneAndUpdate({ _id: factoid.userId }, {}, { new: true, upsert: true });
      console.log(`User with ID ${factoid.userId} was: ${user}`);

      // Create a UserFact on DB if none found
      const userFact: UserFact = await createUserFact(factoid.userId, factoid.fact.id);

      console.log("Using UserFact:", userFact.id);

      // Resolve promise
      resolve(userFact.id);

      // Handle errors
    } catch (error) {
      console.log("Could not build UserFact on DB:", error);
      reject(0);
    }
  });
}

export async function createUserFact(userId: string, factId: string): Promise<UserFact> {
  // Connect to DB
  await connectToDb();
  console.log(`----- Creating UserFact ------`);


  return new Promise<UserFact>(async (resolve, reject) => {
    try {
      let userFact = await UserFactModel.findOne({ User: userId, Fact: factId });

      if (!userFact) {
        console.log(`UserFact not found, creating: { userId: ${userId}, factId: ${factId}`);
        userFact = await UserFactModel.create({ User: userId, Fact: factId });
        await userFact.save();
        console.log(`Saved UserFact with ID (${userFact.id})`);
      } else
        console.log("Found UserFact on DB.");

      resolve(userFact);

    } catch (error) {
      // Handle errors
      handleError(`Could not create UserFact: ${error}`)
      reject(error);
    }
  })
}

export async function connectToDb(): Promise<boolean> {
  return new Promise<boolean>(async (resolve, reject) => {
    try {
      // Guard
      function guard() {
        process.stdout.write(`DB status: `);

        switch (connection.readyState) {
          case 1:
            process.stdout.write(`Connected.\n`);
            resolve(true);
            return true;
          case 2:
          case 3:
            process.stdout.write(`Not ready.\n`);
            resolve(false);
            return false;
          default:
            process.stdout.write(`Disconnected.\n`);
            return false;
        }
      }
      if (guard()) return;

      // Connect to the DB
      console.log("Attempting connection to DB.")
      await connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      // Report external errors
      connection.on('error', (error) => { throw new Error(`Could not connect to DB: ${error}`) });

      // Reguard
      if (guard()) return;

      // Success callback
      connection.once('open',
        async () => {
          console.log("Connected to DB");
          resolve(true)
          return true;
        });
    }
    catch (error) {
      reject();
    }
  });
}

// Store fact in DB
export async function storeFactoid(factoid: IFact, resolve: (error?: Error) => void) {
  // Connect to DB
  await connectToDb();
  console.log(`----- Storing Factoid ------`);

  try {
    if (!factoid.fact) throw new Error(`Fact was null: ${factoid.fact}`);

    // Create a new fact if it doesn't exist
    await createFactOnDb(factoid.fact);

    await buildUserFactOnDb(factoid);

    resolve();
  } catch (error) {
    handleError("Could not store fact in DB.");
    resolve(error);
  }
}

// Get new userId from DB
export async function getNewUserID(): Promise<string> {
  // Connect to DB
  await connectToDb();
  console.log(`----- Getting New User ID ------`);


  return new Promise(async (resolve, reject) => {
    // Create new user
    process.stdout.write('Creating a new user...');
    const newUser: User = await UserModel.create({ _id: Types.ObjectId() });

    // Save it to DB
    try {
      process.stdout.write("Saving to DB....");
      await newUser.save();
      process.stdout.write("OK.\n");
      resolve(newUser._id);
    } catch (error) {
      // Report error on failure
      process.stdout.write("failed.\n");
      handleError(error);
      reject("");
    }

    return newUser;
  });
}

export async function getUserFacts(userId: string): Promise<Fact[]> {
  // Connect to DB
  await connectToDb();
  console.log(`----- Getting User's Facts ------`);

  return new Promise(async (resolve, reject) => {
    try {
      // Find UserFact's by given userId
      console.log(`Fetching User's Facts for ID ${userId}`);

      const userFacts = await UserFactModel.find({ User: userId }, 'Fact');
      const factIds: string[] = userFacts.map((userFact) => userFact.Fact);

      // Find the User's Facts
      const facts: Fact[] = await FactModel.find({
        '_id': { $in: factIds }
      });

      console.log(`Found ${userFacts.length} Fact IDs for user and ${facts.length} related Facts.`);

      // Guard zero-length
      if (!facts.length) { resolve([]); return; }

      // Construct
      resolve(facts);
    } catch (error) {
      // Handle errors
      handleError(`Could not find User's Facts: ${error} `);
      reject([]);
    }
  });
}