import { Schema, model, Document } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import '../../../app.types';

const FactSchema = new Schema({
  _id: String,
  User: Number,
  Text: String,
  Source: String,
  SourceUrl: String,
}, { timestamps: true });

FactSchema.plugin(uniqueValidator, { message: "Fact already exists." });

export interface IFact extends Document {
  _id: string,
  User: number,
  Text: string,
  Source: string,
  SourceUrl: string,
}

export default model<IFact>('Fact', FactSchema);
