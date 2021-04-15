import path from "path";

import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

const app = express();

app.use(express.json());
dotenv.config({
  path: path.join(__dirname, ".env"),
});

const withDB = async (operations) => {
  try {
    const client = await MongoClient.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const db = client.db("mern-blog");

    await operations(db);
    client.close();
  } catch (e) {
    console.log(e.message);
    console.log("Could not connect");
  }
};

app.get("/api/articles/:name", async (req, res) => {
  withDB(async (db) => {
    const articleName = req.params.name;
    const articleInfo = await db
      .collection("articles")
      .findOne({ name: articleName });
    res.status(200).json(articleInfo);
  });
});

app.post("/api/articles/:name/upvote", async (req, res) => {
  withDB(async (db) => {
    const articleName = req.params.name;

    const articleInfo = await db
      .collection("articles")
      .findOne({ name: articleName });
    await db.collection("articles").updateOne(
      { name: articleName },
      {
        $set: {
          upvotes: articleInfo.upvotes + 1,
        },
      }
    );
    const updatedArticleInfo = await db
      .collection("articles")
      .findOne({ name: articleName });
    res.status(200).json(updatedArticleInfo);
  });
});

app.post("/api/articles/:name/add-comment", async (req, res) => {
  withDB(async (db) => {
    const { username, text } = req.body;
    const articleName = req.params.name;

    const articleInfo = await db
      .collection("articles")
      .findOne({ name: articleName });
    await db.collection("articles").updateOne(
      { name: articleName },
      {
        $set: {
          comments: articleInfo.comments.concat({ username, text }),
        },
      }
    );
    const updatedArticleInfo = await db
      .collection("articles")
      .findOne({ name: articleName });
    res.status(200).json(updatedArticleInfo);
  });
});

app.listen(8000, () => console.log("Listening on port 8000"));
