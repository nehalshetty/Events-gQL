const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const PORT = 4000;
const graphQLHttp = require("express-graphql");

const gQLSchema = require("./graphQL/schema");
const gQLResolvers = require("./graphQL/resolvers");

const app = express();

app.use(bodyParser.json());

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
