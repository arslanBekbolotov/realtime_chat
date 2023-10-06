import express from 'express';
import expressWs from 'express-ws';
import cors from 'cors';
import * as mongoose from "mongoose";
import config from "./config";

const app = express();
const port = 8000;
expressWs(app);

app.use(cors());

const chatRouter = express.Router();

chatRouter.ws('/', (ws, req) => {
    console.log('client connected');
});

app.use(chatRouter);


const run = async () => {
    await mongoose.connect(config.db);

    app.listen(port, () => {
        console.log(`Server started on ${port} port!`);
    });

    process.on('exit', () => {
        mongoose.disconnect();
    });
};

run().catch((e) => console.log(e));

