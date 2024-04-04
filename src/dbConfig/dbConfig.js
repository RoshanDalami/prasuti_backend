import mongoose from "mongoose";

export async function connect(connectionUrl) {
  if (!connectionUrl) {
    console.log("Connection string not found");
    return;
  }

  mongoose.connect(connectionUrl);
  const connection = mongoose.connection;

  connection.on("connect", () => {
    console.log("connected to database");
  });
  connection.on("error", (error) => {
    console.log("Couldnot connect to database" + error);
    process.exit();
  });
}
