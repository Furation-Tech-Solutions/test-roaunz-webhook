const express = require("express");
const bodyParser = require("body-parser");
var zlib = require("zlib");

const app = express();
const port = 5000;

function rawBody(req, res, next) {
  req.rawBody = "";
  req.chunks = [];

  req.on("data", function (chunk) {
    console.log("Chunk", chunk, typeof chunk);
    req.chunks.push(Buffer.from(chunk));
  });
  req.on("end", function () {
    next();
  });
}

app.use(bodyParser.json());
app.use(rawBody);

app.get("/helth", function (req, res) {
  res.status(200).send("Welcome to home route");
});

// const ROANUZ_PROJECT_KEY = "RS_P_1744648817841672196";
const ROANUZ_API_KEY = "RS5:e9d2ee67cebda9cab0f180f317f5cd55";


app.post("/match/feed/v1/", function (req, res) {
  console.log("Received");
  var buffer = Buffer.concat(req.chunks);
  if (req.headers["rs-api-key"] == ROANUZ_API_KEY) {
    zlib.unzip(buffer, (err, buffer) => {
      if (!err) {
        data = JSON.parse(buffer.toString());
        console.log("Data", data, typeof data);
        res.send(JSON.stringify({ status: true }));
      } else {
        res.send(JSON.stringify({ status: false }));
      }
    });
  } else {
    console.log("Auth Failed");
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
