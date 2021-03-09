import { Schema, model, Document } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import '../../../app.types';

const SessionFactsSchema = new Schema({
  User: [{ type: Number, ref: 'User' }],
  Fact: [{ type: String, ref: 'Fact' }],
}, { timestamps: true });

SessionFactsSchema.plugin(uniqueValidator, { message: "UserFacts already exists." });

export interface IUserFacts extends Document {
  User: number,
  Fact: string,
}

export default model<IUserFacts>('UserFacts', SessionFactsSchema);
