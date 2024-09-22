dotenv.config();
import * as dotenv from "dotenv";
import http from "http";
import app from "./app.js";
import { connect } from "./dbConfig/dbConfig.js";

const server = http.createServer(app);

connect(process.env.MONGODB_URI);

//

server.listen(process.env.PORT || 8000, () => {
  console.log(`Server is running on  8000`);
});

export default app;
