const express = require("express");
const path = require("path");
const app = express();
const bodyparser = require("body-parser");
const mongoose = require("mongoose");

// Linking the mongoose schema with the app.js file
const employee = require("./models/employees");
const admin = require("./models/admins");
const patient = require("./models/patients");

const port = 3000;
// START THE SERVER
app.listen(port, () => {
  console.log(`The application started successfully on port ${port}`);
});

mongoose.connect("mongodb://localhost:27017/SmartHealthCareSystem");

// Setting view engine as ejs
app.set("view engine", "ejs");

// EXPRESS SPECIFIC STUFF
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// ENDPOINTS
app.get("/", (req, res) => {
  res.render("index", { title: "Home Page" });
  mongoose.connection.db.dropCollection("admins", (err, result) => {
    (result) => {
      console.log("Collection droped");
    };
  });
 
  var admin_data = {
    UserName: "admin",
    Password: "1234",
  };
  var myData = new admin(admin_data);
  myData.save(function(err,admin){
    if (err) return console.error(err);
    console.log("Admin added succesfully");
  })
});


app.get("/login", (req, res) => {
  res.render("login", { title: "Login" });
});

app.get("/patient_signup", (req, res) => {
  res.render("patient_signup", { title: "Patient SignUp" });
});

app.get("/admin_signup", (req, res) => {
  res.render("admin_signup", { title: "Employees SignUp" });
});

app.post("/admin_signup", (req, res) => {
  var myData = new employee(req.body);
  myData
    .save()
    .then(() => {
      setTimeout(()=>{
        res.redirect('/');
      }, 3000);
    })
    .catch(() => {
      res.status(400).send("Item was not saved to the database");
    });
});


app.post("/patient_signup", (req, res) => {
  var myData = new patient(req.body);
  myData
    .save()
    .then(() => {
      setTimeout(()=>{
        res.redirect('/');
      }, 3000);
    })
    .catch(() => {
      res.status(400).send("Item was not saved to the database");
    });
});

app.post("/login", (req, res) => {
  const UserName = req.body.UserName;
  const Password = req.body.Password;

  var title_display = "DashBoard | " + UserName;

  employee.findOne({UserName : UserName, Password : Password}, function (err, doc){
    if (doc){
      res.render("patient_dashboard", {title: title_display, User : UserName});
    }
  });

  patient.findOne({UserName : UserName, Password : Password}, function (err, doc){
    if (doc){
      res.render("patient_dashboard", {title: title_display, User : UserName});
    }
  });
  
  admin.findOne({UserName : UserName, Password : Password}, function (err, doc){
    if (doc){
      res.render("patient_dashboard", {title: title_display, User : UserName});
    }
  });

});

