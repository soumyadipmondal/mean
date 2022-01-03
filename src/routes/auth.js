import express from "express";
import mongoose from "mongoose";
import unique from "unique";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const authRouter = express.Router();

/* Model Creation :: Previously creted from DB forlder but did not work */
const Schema = mongoose.Schema;
let authSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const Auth = mongoose.model("Auth", authSchema);

authRouter.post("/user/signup", (req, res, next) => {
    const saltRounds = 10;
    bcrypt.hash(req.body.password, 10).then(function(hash) {
        const user = new Auth({
            email: req.body.email,
            password: hash,
        });

        user
            .save()
            .then((result) => {
                res.status(201).json({
                    message: "User Created Successfully",
                    result,
                });
            })
            .catch((err) => {
                res.status(500).json({
                    message: "Some error has occured",
                });
            });
    });
});

authRouter.post("/user/login", (req, res, next) => {
    let fetchedUser;
    console.log(req.body);
    if (req.body.password.length < 100) {
        return res.status(400).json({ message: "password incorrect" });
    }
    Auth.findOne({ email: req.body.email })
        .then((user) => {
            if (!user) {
                return res.status(401).json({ message: "User not Found" });
            }
            fetchedUser = user;
            return bcrypt.compare(req.body.password, user.password);
        })
        .then((result) => {
            if (!result) {
                return res.status(401).json({ message: "Authentication Failed" });
            }
            const token = jwt.sign({
                    email: fetchedUser.email,
                    userId: fetchedUser._id,
                },
                "secret_code_needs_to_be_sent", { expiresIn: "1h" }
            );

            res
                .status(200)
                .json({ token: token, expiresIn: 3600, userId: fetchedUser._id });
        })
        .catch((err) => {
            res.status(401).json({ message: "User is Invalid" });
        });
});

module.exports = authRouter;