import { Schema, model, Document } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import '../../../app.types';

export const UserFactsSchema = new Schema({
  User: [{ type: String, ref: 'User' }],
  Fact: [{ type: String, ref: 'Fact' }],
}, { timestamps: true });

UserFactsSchema.plugin(uniqueValidator, { message: "UserFacts already exists." });

export interface UserFacts extends Document {
  User: string,
  Fact: string,
}

export default model<UserFacts>('UserFacts', UserFactsSchema);
