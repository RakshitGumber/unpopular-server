import { connect } from "mongoose";

const DbConnection = async () => {
  connect(process.env.MONGO_URI);
};

export default DbConnection;
