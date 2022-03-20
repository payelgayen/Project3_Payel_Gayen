const express = require("express");
const path = require("path");
const app = express();
const port = 3000;
const data = require("./data");

const { db } = require("./database");

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

app.get("/users", async (req, res) => {
  let users;
  try {
    users = await db.any("SELECT * FROM users"); //Retrieving data from database
  } catch (e) {
    //To catch the exception
    console.log(e);
    users = []; //If any exception occurs, then setting users with empty array
  }
  res.render("pages/users", {
    users: users,
    title: "All Users",
    footerclass: "relativefooter",
  });
});

app.get("/schedules", async (req, res) => {
  //using async to use await inside the function
  let schedule;
  let allusers;
  try {
    schedule = await db.any(
      "select * from schedule, users where schedule.user_id=users.id"
    ); //Retrieving all the data from both users and schedule tables

    allusers = await db.any("SELECT * FROM users");
  } catch (e) {
    //To catch the exception
    console.log(e);
    allusers = [];
    schedule = []; //If any exception occurs, then setting schedule with empty array
  }
  res.render("pages/schedules", {
    schedules: schedule,
    allusers: allusers,
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
