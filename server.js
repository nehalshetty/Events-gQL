const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const PORT = 4000;
const graphQLHttp = require("express-graphql");

const gQLSchema = require("./graphQL/schema");
const gQLResolvers = require("./graphQL/resolvers");
const checkAuth = require("./middleware/checkAuth");

const app = express();

app.use(bodyParser.json());
app.use(checkAuth);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(
  "/graphQLEndpoint",
  graphQLHttp({
    graphiql: true,
    schema: gQLSchema,
    rootValue: gQLResolvers,
  })
);

app.get("/", (req, res, next) => {
  res.send("Welcome to back-end world!");
});
console.log(process.env.MONGO_PASSWORD);

mongoose
  .connect(
    `mongodb+srv://nehal:${process.env.MONGO_PASSWORD}@cluster0-meykv.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    app.listen(PORT, () => {
      console.log("👂 at " + PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });
