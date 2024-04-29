import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

import { UserRouter } from "./Routes/user.routes.js";
import { DonorRouter } from "./Routes/donor.routes.js";
import { DropdownRoute } from "./Routes/dropdown.routes.js";
import { OfficeRouter } from "./Routes/office.routes.js";
import { MilkVolumeRoute } from "./Routes/milkVolume.routes.js";
import { BottleRouter } from "./Routes/bottle.routes.js";
import { RequsitionRoute } from "./Routes/requsition.routes.js";
import { pasteurizationRouter } from "./Routes/pasteurization.routes.js";
import { babyRoute } from "./Routes/baby.routes.js";
import { SearchRouter } from "./Routes/search.routes.js";
import { fiscalRouter } from "./Routes/fiscal.routes.js";
import {DashboardRouter} from './Routes/dashboard.routes.js'
import { CultureRoute } from "./Routes/culture.routes.js";
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api/v1/user", UserRouter);
app.use("/api/v1/donor", DonorRouter);
app.use("/api/v1/dropdown", DropdownRoute);
app.use("/api/v1/office", OfficeRouter);
app.use("/api/v1/milkVolume", MilkVolumeRoute);
app.use("/api/v1/bottle", BottleRouter);
app.use("/api/v1/milkRequsition", RequsitionRoute);
app.use("/api/v1/pasteurization", pasteurizationRouter);
app.use("/api/v1/baby", babyRoute);
app.use("/api/v1/search", SearchRouter);
app.use("/api/v1/fiscal", fiscalRouter);
app.use("/api/v1/dashboard",DashboardRouter); 
app.use("/api/v1/culture",CultureRoute);
app.get("/*", (req, res) => {
  res.status(200).json({ message: "Message from app express" });
});
export default app;
