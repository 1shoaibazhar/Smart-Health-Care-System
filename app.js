const express = require("express");
const path = require("path");
const app = express();
const morgan = require('morgan');
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

// app.use(morgan('dev'));

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
  })
});


app.get("/login", (req, res) => {
  res.render("login", { title: "Login" , unavailable : ""});
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


app.get("/update_patient/:id", (req,res)=>{
  const useriD = req.params.id;
  console.log(useriD);
  patient.findById(useriD)
    .then(result => {
      res.render("update_info_patient", {User: result});
    })
})

// Deleting a patient
app.get("/delete_patient/:id", (req,res)=>{
  const useriD = req.params.id;
  console.log(useriD);
  patient.findByIdAndDelete(useriD)
    .then(result => {
      // res.json({ redirect: '/login'});
      res.redirect('/');
    })
    
    .catch(err=> console.log(err));
})


// For updating patient data
app.post("/update_info_patient", (req,res)=>{
  console.log(req.body);
  let patient_username = req.body.UserName;
  
  patient.findOne({UserName : patient_username}, function (err, doc){
    if (doc){
      let Name = "";
      let Email = "";
      let Gender = "";
      let CNIC = '';
      let PhoneNumber = "";
      let Password = "";
      let Address = "";
      
      if (req.body.Name == ""){
        Name = doc.Name;
      }
      else{
        Name = req.body.Name;
      }

      if (req.body.Email == ""){
        Email = doc.Email;
      }
      else{
        Email = req.body.Email;
      }
      
      if (req.body.Gender == ""){
        Gender = doc.Gender;
      }
      else{
        Gender = req.body.Gender;
      }

      if (req.body.CNIC == ''){
        CNIC = doc.CNIC;
      }
      else{
        CNIC = req.body.CNIC;
      }

      if (req.body.PhoneNumber == ""){
      PhoneNumber = doc.PhoneNumber;
      }
      else{
      PhoneNumber = req.body.PhoneNumber;
      }

      if (req.body.Password == ""){
      Password = doc.Password;
      }
      else{
      Password = req.body.Password;
      }

      if (req.body.Address == ""){
      Address = doc.Address;
      }
      else{
      Address = req.body.Address;
      }

      UserName = patient_username;
      let new_patient = {UserName, Name, Email, Gender, CNIC, PhoneNumber, Password, Address};

      patient.findOneAndUpdate({UserName : patient_username}, new_patient, {upsert: true}, function(err, doc1) {
        if (err) return res.send(500, {error: err});
        var title_display = "DashBoard | " + patient_username;
        res.render("patient_dashboard", {title: title_display, User : patient_username, userID: doc1._id, UserObj: doc1});
      });

    }
  });


})



app.get("/update_employee/:id", (req,res)=>{
  const useriD = req.params.id;
  console.log(useriD);
  employee.findById(useriD)
    .then(result => {
      res.render("update_info_employee", {User: result});
    })
})

// Deleting an Employee
app.get("/delete_employee/:id", (req,res)=>{
  const useriD = req.params.id;
  console.log(useriD);
  employee.findByIdAndDelete(useriD)
    .then(result => {
      res.redirect('/');
    })
    
    .catch(err=> console.log(err));
})



// For updating employee data
app.post("/update_info_employee", (req,res)=>{
  console.log(req.body);
  let employee_username = req.body.UserName;
  
  employee.findOne({UserName : employee_username}, function (err, doc){
    if (doc){
      let Name = "";
      let Email = "";
      let Gender = "";
      let EmployeeNumber = '';
      let PhoneNumber = "";
      let Password = "";
      let Address = "";
      
      if (req.body.Name == ""){
        Name = doc.Name;
      }
      else{
        Name = req.body.Name;
      }

      if (req.body.Email == ""){
        Email = doc.Email;
      }
      else{
        Email = req.body.Email;
      }
      
      if (req.body.Gender == ""){
        Gender = doc.Gender;
      }
      else{
        Gender = req.body.Gender;
      }

      if (req.body.EmployeeNumber == ''){
        EmployeeNumber = doc.EmployeeNumber;
      }
      else{
        EmployeeNumber = req.body.EmployeeNumber;
      }

      if (req.body.PhoneNumber == ""){
        PhoneNumber = doc.PhoneNumber;
      }
      else{
        PhoneNumber = req.body.PhoneNumber;
      }

      if (req.body.Password == ""){
        Password = doc.Password;
      }
      else{
       Password = req.body.Password;
      }

      if (req.body.Address == ""){
       Address = doc.Address;
      }
      else{
        Address = req.body.Address;
      }

      UserName = employee_username;
      let employee_patient = {UserName, Name, Email, Gender, EmployeeNumber, PhoneNumber, Password, Address};

      employee.findOneAndUpdate({UserName : employee_username}, employee_patient, {upsert: true}, function(err, doc1) {
        if (err) return res.send(500, {error: err});
        var title_display = "DashBoard | " + employee_username;
        res.render("employee_dashboard", {title: title_display, User : employee_username, userID: doc1._id, UserObj: doc1});
      });

    }
  });


})



app.post("/login", async(req, res) => {
  const UserName = req.body.UserName;
  const Password = req.body.Password;

  var title_display = "DashBoard | " + UserName;

  await employee
    .findOne({ UserName: UserName, Password: Password }, function (err, doc) {
      if (doc) {
        res.render("employee_dashboard", {
          title: title_display,
          User: UserName,
          userID: doc._id,
          UserObj: doc,
        });
        res.end();
      }
    })
    .clone()
    .catch(function (err) {
      console.log(err);
    });

  await patient
    .findOne({ UserName: UserName, Password: Password }, function (err, doc) {
      if (doc) {
        res.render("patient_dashboard", {
          title: title_display,
          User: UserName,
          userID: doc._id,
          UserObj: doc,
        });
        res.end();
      }
    })
    .clone()
    .catch(function (err) {
      console.log(err);
    });
  
  await admin.findOne({UserName : UserName, Password : Password}, function (err, doc){
    if (doc){
      res.render("patient_dashboard", {title: title_display, User : UserName, userID: doc._id, UserObj: doc});
      res.end();
    }
  }).clone().catch(function(err){ console.log(err)});


  res.render("login", { title: "Login" , unavailable : "Invalid Username/Password"});


});

