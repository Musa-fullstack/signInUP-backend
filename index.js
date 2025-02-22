const express = require("express");
const app = express();
const port = 3000;
const fs = require("fs");
const cors = require("cors");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.text());
app.use(cors());

app.post("/register", (req, res) => {
  const { username, email, password } = req.body;
  const emailStatus = email || "Log In";
  const userData = { username, email: emailStatus, password };

  let data = [];
  try {
    const fileData = fs.readFileSync("data.json", "utf-8");
    data = JSON.parse(fileData);
  } catch (err) {
    if (err) {
      console.log("Error while reading json.data");
    }
  }

  data.push(userData);

  fs.writeFileSync(
    "data.json",
    JSON.stringify(data, null, 2),
    "utf-8",
    (err) => {
      if (err) {
        console.log("Error while writing to data.json");
      }
    }
  );
  res.send("Data submitted!");
});

app.set("view engine", "ejs");

let rawData;
let usersData;
let userFound;
app.post("/", (req, res) => {
  rawData = fs.readFileSync("data.json", "utf-8");
  if (!rawData) {
    res.json("Data file is empty!");
    return;
  }
  usersData = JSON.parse(rawData);

  const { username, password } = req.body;
  userFound = usersData.find(
    (userFound) =>
      userFound.username === username && userFound.password === password
  );
  if (userFound) {
    res.json(userFound.username);
  } else {
    res.json("user not found");
  }
});

app.get("/profiles/:user", (req, res) => {
  res.render("profile.ejs", { userFound });
});

// app.get("/profile", (req, res) => {
//   res.render("profile.ejs");
// });

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${post}`);
});
