import { connect } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const DbConnection = async () => {
  connect(process.env.MONGO_URI);
};

export default DbConnection;
