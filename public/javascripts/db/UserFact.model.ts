import { Schema, model, Document } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import '../../../app.types';

export const UserFactSchema = new Schema({
  User: { type: String, ref: 'User' },
  Fact: { type: String, ref: 'Fact' },
}, { timestamps: true });

UserFactSchema.plugin(uniqueValidator, { message: "UserFacts already exists." });

export interface UserFact extends Document {
  User: string,
  Fact: string,
}

export default model<UserFact>('UserFact', UserFactSchema);
