import { Schema, model, Document } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import '../../../app.types';

const FactSchema = new Schema({
  _id: String,
  User: String,
  Text: String,
  Language: String,
  Source: String,
  SourceUrl: String,
}, { timestamps: true });

FactSchema.plugin(uniqueValidator, { message: "Fact already exists." });

export interface Fact extends Document {
  _id: string,
  User: string,
  Text: string,
  Language: string,
  Source: string,
  Source_url: string,
}

export default model<Fact>('Fact', FactSchema);
