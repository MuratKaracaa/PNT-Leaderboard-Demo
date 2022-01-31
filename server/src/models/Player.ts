import { model, Schema, SchemaTypes } from "mongoose";

import { IPlayer } from "../typings";
import { mongoConstants } from "../constants";

// Simple Player model for MongoDB, using npm mongoose package, implementing the IPlayer interface

const Player = new Schema(
  {
    userName: {
      type: SchemaTypes.String,
      required: true,
      unique: true,
    },
    name: {
      type: SchemaTypes.String,
      required: true,
    },
    country: {
      type: SchemaTypes.String,
      required: true,
    },
    money: {
      type: SchemaTypes.Number,
      default: 0,
    },
  },
  { collection: mongoConstants.collection.player }
);

export default model<IPlayer>(mongoConstants.models.player, Player);
