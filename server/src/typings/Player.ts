import { Document } from "mongoose";

// Simple Player interface for the MongoDB Player model, extending the Document type from npm mongoose package

export interface IPlayer extends Document {
  userName: string;
  name: string;
  country: string;
  money: number;
}

export type IPlayers = IPlayer[];
