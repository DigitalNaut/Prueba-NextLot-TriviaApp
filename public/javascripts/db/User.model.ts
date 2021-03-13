import { Schema, model, Document } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const UserSchema = new Schema({
  _id: String
}, { timestamps: true });

UserSchema.plugin(uniqueValidator, { message: "User already exists." });

export interface User extends Document {
  _id: string,
}

export default model<User>('User', UserSchema);
