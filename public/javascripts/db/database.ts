import { connect, connection, Types } from 'mongoose';
import UserFactsModel from './UserFacts.model';
import UserModel from './User.model';
import FactModel from './Fact.model';
import '../../../app.types';

async function createRelationships(UserId: number, Fact: Fact): Promise<number> {
  return new Promise(async (resolve, reject) => {
    try {
      // Guards
      if (!Types.ObjectId.isValid(UserId) || UserId <= 0) {
        console.log(`UserId request int URL is not valid: ${UserId}`); return;
      }

      // Create a User if none found

      let user = await UserModel.findById(UserId);

      if (!user) {
        console.log("Creating User...");
        const newUser = new UserModel();
        newUser._id = UserId;
        await newUser.save();

        user = newUser;
      }

      console.log("User:", user._id);

      // Create a Fact if none found

      let fact = await FactModel.findOne({ _id: Fact.fact.id });

      if (!fact) {
        console.log("Saving fact...");

        fact = new FactModel();
        fact._id = Fact.fact.id;
        await fact.save();

        fact.updateOne({
          Text: Fact.fact.text,
          Source: Fact.fact.source,
          SourceUrl: Fact.fact.source_url,
        });
      }

      console.log("Using Fact:", fact._id);

      // Create a UserFacts if none found

      let userFact = await UserFactsModel.findOne({ User: user._id, Fact: Fact.fact.id });

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

export function storeFact(data: { userId: number, fact: Fact }, succeed: () => void, fail: (error?: Error) => void) {
  try {
    // Connect to the DB
    connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const db = connection;

    // Report errors
    db.on('error', error => fail(error));

    // Success callback
    db.once('open', async () => {
      await createRelationships(data.userId, data.fact);
      await db.close();
      console.log("Disconnected Mongoose")
      succeed();
    });
  } catch (error) {
    fail(error);
  }
}
