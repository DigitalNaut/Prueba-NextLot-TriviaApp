import { Schema, model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

export const UserSchema = new Schema({
  _id: String
}, { timestamps: true });

UserSchema.plugin(uniqueValidator, { message: "User already exists." });

export default model('User', UserSchema);
