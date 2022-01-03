import express from "express";
import mongoose from "mongoose";
import CheckAuth from "../middleware/check-auth";

const router = express.Router();

/* Model Creation :: Previously creted from DB forlder but did not work */
const Schema = mongoose.Schema;
let postSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auth",
        required: true,
    },
});

const Post = mongoose.model("Post", postSchema);

router.post("/sendPost", CheckAuth, async(req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        creator: req.userData.userId,
    });

    post
        .save()
        .then((result) => {
            console.log("note saved!");
            res.status(201).json({
                message: "Post has been successfully submitted",
                id: result._id,
            });
        })
        .catch((err) => {
            res.status(500).send(`Some error has occured in saving the post ${err}`);
        });
});

router.get("/posts", (req, res) => {
    const postsSize = +req.query.postsSize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPosts;
    if (postsSize && currentPage) {
        postQuery.skip(postsSize * (currentPage - 1)).limit(postsSize);
    }

    postQuery
        .then((documents) => {
            fetchedPosts = documents;
            return Post.count();
        })
        .then((count) => {
            const result = {
                maxCount: count,
                posts: fetchedPosts,
            };
            res.status(200).json({
                message: "Post has been successfully fetched",
                postsData: result,
            });
        });
});

router.get("/post/:id", CheckAuth, (req, res) => {
    const postId = req.params.id;
    Post.findOne({ _id: postId })
        .then((post) => {
            res.status(200).json(post);
        })
        .catch((err) => {
            res
                .status(201)
                .send(`Error has occured in fetching the single post ${postId}`);
        });
});

router.put("/post/:id", CheckAuth, (req, res) => {
    const postId = req.params.id;
    const post = new Post({
        _id: postId,
        title: req.body.title,
        content: req.body.content,
    });
    Post.updateOne({ _id: postId, creator: req.userData.userId }, post)
        .then((updateFeed) => {
            if (updateFeed.nModified === 0) {
                res
                    .status(401)
                    .json({ message: "You are not the creator of the post" });
            }
            res
                .status(200)
                .json({ message: `Post with ${postId} has successfully been updated` });
        })
        .catch((err) => {
            res
                .status(201)
                .send(`There is some error occured in updating the post ${err}`);
        });
});

router.delete("/post/:id", CheckAuth, (req, res) => {
    const postId = req.params.id;
    console.log(postId);
    Post.deleteOne({ _id: postId, creator: req.userData.userId },
        (err, result) => {
            if (err) {
                res
                    .status(201)
                    .send(`Some error has occured in getting the posts: ${err}`);
            } else {
                if (result.nModified === 0) {
                    res
                        .status(401)
                        .json({ message: "You are not the creator of the post" });
                }
                res.status(200).json({
                    message: `Post with ID ${postId} has been successfully Deleted`,
                });
            }
        }
    );
});

module.exports = router;