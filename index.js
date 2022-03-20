const express = require("express");
const path = require("path");
const app = express();
const port = 3000;
const data = require("./data");
const { createHash } = require("crypto");
var bodyParser = require("body-parser");

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

var jsonParser = bodyParser.json();

var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(express.static(path.join(__dirname, "public")));

function create256hash(string) {
  return createHash("sha256").update(string).digest("hex");
}

app.get("/", (req, res) => {
  res.render("pages/home", {
    title: "Welcome to our schedule website",
    footerclass: "relativefooter",
  });
});

app.get("/users", (req, res) => {
  res.render("pages/users", {
    users: data.users,
    title: "All Users",
    footerclass: "relativefooter",
  });
});

app.get("/schedules", (req, res) => {
  res.render("pages/schedules", {
    schedules: data.schedules,
    title: "Schedules",
    footerclass: "absolutefooter",
  });
});

app.get("/users/:id", (req, res) => {
  const users = data.users;
  res.send(users[req.params.id]);
});

app.get("/users/:id/schedules", (req, res) => {
  const schedule = data.schedules;
  const result = schedule.filter((item) => item.user_id == req.params.id); //using doble equals sign to compare the values only, not the data type
  res.send(result);
});

app.post("/users", urlencodedParser, (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  const newUser = {
    firstname: firstname,
    lastname: lastname,
    email: email,
    password: create256hash(password),
  };
  data.users.push(newUser);
  res.redirect("/users");
});

//  create new schedule object
app.post("/schedules", urlencodedParser, (req, res) => {
  const { user_id, day, start_at, end_at } = req.body;
  const newSchedule = {
    user_id: user_id,
    day: day,
    start_at: start_at,
    end_at: end_at,
  };
  data.schedules.push(newSchedule);
  res.redirect("/schedules");
});

app.get("*", (req, res) => {
  res.status(404).send("Requested resource is not available");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
