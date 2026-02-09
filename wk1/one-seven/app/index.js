const express = require("express");
const app = express();
const router = require("./routes/routindex");

app.use(express.json());
// From localhost:3000/
// app.get("/", (req, res) => {
//     res.status(200).send({
//         message: "GET - root" ,
//         metadata:{
//           hostname: req.hostname,
//           method: req.method,
//         },
//     });
// });
app.get("/", (req, res) => {
  res.status(200).send("Service is up");
});

app.use("/api", router);
module.exports = app;
