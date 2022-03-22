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

// app.get("/", (req, res) => {
//   res.render("pages/home", {
//     title: "Welcome to our schedule website",
//     footerclass: "relativefooter",
//   });
// });

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

app.get("/", async (req, res) => {
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
  // const users = data.users;
  // res.send(users[req.params.id]);
  db.any("select * from users where id=$1", [req.params.id])
    .then(function (data) {
      res.send(data);
    })
    .catch(function (error) {
      // error;
    });
});

app.get("/new", async (req, res) => {
  let users;
  try {
    users = await db.any("SELECT * FROM users"); //Retrieving data from database
    res.render("pages/newschedules", {
      allusers: users,
      title: "Schedules",
      footerclass: "absolutefooter",
    });
  } catch (e) {
    //To catch the exception
    console.log(e);
  }
});

app.get("/users/:id/schedules", (req, res) => {
  // const schedule = data.schedules;
  // const result = schedule.filter((item) => item.user_id == req.params.id); //using double equals sign to compare the values only, not the data type
  // res.send(result);
  db.any("select * from schedule where user_id=$1", [req.params.id])
    .then(function (data) {
      res.send(data);
    })
    .catch(function (error) {
      // error;
    });
});

app.post("/users", urlencodedParser, (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  db.none(
    "INSERT INTO users(firstname, lastname, email, password) VALUES($1, $2, $3, $4)",
    [firstname, lastname, email, create256hash(password)]
  )
    .then(() => {
      // success;
      res.redirect("/users");
    })
    .catch((error) => {
      // error;
      console.log(error);
    });
});

//  create new schedule object
app.post("/new", urlencodedParser, (req, res) => {
  const { user_id, day, start_at, end_at } = req.body;
  db.none(
    "INSERT INTO schedule(user_id, day, start_time, end_time) VALUES($1, $2, $3, $4)",
    [user_id, day, start_at, end_at]
  )
    .then(() => {
      // success;
      res.redirect("/");
    })
    .catch((error) => {
      // error;
      console.log(error);
    });
});

app.get("*", (req, res) => {
  res.status(404).send("Requested resource is not available");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
