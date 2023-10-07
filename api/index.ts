import express from "express";
import expressWs from "express-ws";
import cors from "cors";
import * as mongoose from "mongoose";
import config from "./config";
import chatRouter, { chatWrapper } from "./routers/chat";

const app = express();
const port = 8000;
expressWs(app);
chatWrapper();

app.use(cors());
app.use("/chat", chatRouter);

const run = async () => {
  await mongoose.connect(config.db);

  app.listen(port, () => {
    console.log(`Server started on ${port} port!`);
  });

  process.on("exit", () => {
    mongoose.disconnect();
  });
};

run().catch((e) => console.log(e));
