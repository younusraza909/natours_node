const express = require("express");
const fs = require("fs");
const tourRouter = require("./routes/tourRouter");
const userRouter = require("./routes/userRouter");

const app = express();
// Express dont put body on request object by default so we have to add this middleware
app.use(express.json());

app.use("/api/v1/tours", tourRouter);

app.use("/api/v1/users", userRouter);

module.exports = app;
