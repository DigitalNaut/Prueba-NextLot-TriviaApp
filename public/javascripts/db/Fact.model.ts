import { Schema, model, Document } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import '../../../app.types';

const FactSchema = new Schema({
  _id: String,
  user: String,
  text: String,
  language: String,
  source: String,
  source_url: String,
  permalink: String,
}, { timestamps: true });

FactSchema.plugin(uniqueValidator, { message: "Fact already exists." });

export interface Fact extends Document {
  _id: string,
  user: string,
  text: string,
  language: string,
  source: string,
  source_url: string,
  permalink: string,
}

export default model<Fact>('Fact', FactSchema);
