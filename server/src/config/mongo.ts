import { connect } from "mongoose";
import { config } from "dotenv";

config();

const { DB_STRING } = process.env;

connect(DB_STRING!, () => console.log("DB Connected"));
