import { Schema, model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const SessionSchema = new Schema({
  _id: Number
}, { timestamps: true });

SessionSchema.plugin(uniqueValidator, { message: "User already exists." });

export default model('User', SessionSchema);
