import { connect } from "mongoose";

const DbConnection = async () => {
  connect(
    process.env.MONGO_URI ||
      "mongodb+srv://gumberrakshit:v9A9gA8XDmQBTOW8@maincluster.ouhdv9f.mongodb.net/?retryWrites=true&w=majority&appName=MainCluster"
  );
};

export default DbConnection;
