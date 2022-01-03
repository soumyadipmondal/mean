import express, { response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
//import Post from "../../db/models/post";
import mongoose from "mongoose";
import postRouter from "./routes/posts";
import authRouter from "./routes/auth";
const app = express();

mongoose.set("bufferCommands", false);

//Connecting MongoDB:
/* How to Set up Mongo Set up
  1. Install mongoDB for windows, npm install mongoose, Install mongo compass
  2. Get the connection string from Mongo Atlas
  3. Local :: Run mongod on a cmd and mongo(for mongo shell) in another cmd
 */

//MEAN:: FfBZ832eUQSBuZ10
//meancourse :: nrJtvUGTuKsshrz0
//mongoshell = "mongodb+srv://meancourse:nrJtvUGTuKsshrz0@cluster0.scph2.mongodb.net/meancourse?retryWrites=true&w=majority"
//compass = "mongodb+srv://meancourse:nrJtvUGTuKsshrz0@cluster0.scph2.mongodb.net/meancourse"
//Local: mongodb://localhost:27017/dbName

/* Connection Process :: 1 */
mongoose
    .connect(
        "mongodb+srv://meancourse:XwmRkf5sGIK3ULkL@cluster0.scph2.mongodb.net/meancourse?retryWrites=true&w=majority", { useUnifiedTopology: true, useNewUrlParser: true }
    )
    .then((con) => {
        console.log(con.connections);
        console.log("Database is connected Successfully");
    })
    .catch((err) => console.log("Some error has occured" + err));

/* Connection Process :: 2 */
/* var uri = "mongodb://localhost:27017/meancourse";

mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true });

const connection = mongoose.connection;

connection.once("open", function () {
  console.log("MongoDB database connection established successfully");
}); */

//app.use(cors());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requsted-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );

    next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api", postRouter);
app.use("/api", authRouter);

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});