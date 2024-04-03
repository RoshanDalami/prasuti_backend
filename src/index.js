import * as dotenv from "dotenv";
dotenv.config();
import http from "http";
import app from "./app.js";
import { connect } from "./dbConfig/dbConfig.js";

const server = http.createServer(app);

connect(process.env.MONGODB_URI)

// 

server.listen(process.env.PORT, () => {
  console.log(`Server is running on  ${process.env.PORT} `);
});