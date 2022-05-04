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

app.get("/view_patient", (req, res) => {
  res.render("view_patient", { title: "View Patient" });
});

app.get("/admin_signup", (req, res) => {
  res.render("admin_signup", { title: "Employees SignUp" });
});

app.get("/view_employee", (req, res) => {
  res.render("view_employee", { title: "View Employee" });
});



//***********************to load page  */
app.get("/admin_dashboard", (req, res) => {
   res.render("admin_dashboard",{ title: "Admin Dashboard" });
 });

 //***********************to load page  */
app.get("/display", (req, res) => {
  res.render("display",{ title: "Display Patient/Employee" });
});
 




//***********************page redirection link anchor tag/ normal buttons outside form  */
 app.get("/search", (req, res) => {
 res.render("search",{ title: "Search Patient/Employee" });
 });

 app.get("/predict_heartattack", (req, res) => {
  res.render("predict_heartattack",{ title: "Predict Heart Attack" });
  });

  app.get("/predict_diabetes", (req, res) => {
    res.render("predict_diabetes",{ title: "Predict Diabetes" });
    });

  app.get("/predict_jaundice", (req, res) => {
      res.render("predict_jaundice",{ title: "Predict Jaundice" });
      });

  app.get("/predict_malaria", (req, res) => {
        res.render("predict_malaria",{ title: "Predict Malaria" });
    });

  app.get("/predict_appendicitis", (req, res) => {
          res.render("predict_appendicitis",{ title: "Predict Appendicitis" });
    });

  app.get("/predict_tuberculosis", (req, res) => {
            res.render("predict_tuberculosis",{ title: "Predict Tuberculosis" });
      });

 //************form button  */
 app.post("/search", (req, res) => {
    console.log(req.body);

    const name = req.body.Name;
    
    if (req.body.Designation == 'Patient')
    {
      patient.find({Name : name}, function (err, doc){
        if (!err){
          res.render("display",{ title: "Search Results" , users : doc, Designation: "Patient"});
        }
      });
    }
    else
    {
      employee.find({Name : name, Profession: req.body.Designation}, function (err, doc){
        if (!err){
          res.render("display",{ title: "Search Results" , users : doc, Designation: "Employee"});
        }
      });
    }


   
 });

app.post("/predict_heartattack", (req, res) => {
  res.render("patient_dashboard");
});

app.post("/search", (req, res) => {
  res.render("admin_dashboard");
});

app.post("/predict_diabetes", (req, res) => {
  res.render("patient_dashboard");
});

app.post("/predict_appendicitis", (req, res) => {
  res.render("patient_dashboard");
});

app.post("/predict_jaundice", (req, res) => {
  res.render("patient_dashboard");
});

app.post("/predict_malaria", (req, res) => {
  res.render("patient_dashboard");
});

app.post("/predict_tuberculosis", (req, res) => {
  res.render("patient_dashboard");
});

app.post("/view_patient", (req, res) => {
  res.render("display");
});

app.post("/view_patient", (req, res) => {
  res.render("admin_dashboard");
});

app.post("/view_employee", (req, res) => {
  res.render("admin_dashboard");
});

app.post("/view_employee", (req, res) => {
  res.render("display");
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
  let phoneNumber = req.body.PhoneNumber;

  var myData = new patient(req.body);
  myData
    .save()
    .then(() => {
      setTimeout(() => {
        res.redirect("/");
      }, 3000);
    })
    .catch(() => {
      res.status(400).send("Item was not saved to the database");
    });
});


// When admin sends a delete patient request from the display page
app.get("/delete_patient_admin/:id", (req,res)=>{
  const useriD = req.params.id;
  console.log(useriD);
  patient
    .findByIdAndDelete(useriD)
    .then((result) => {
      res.redirect("/search");
    })

    .catch((err) => console.log(err));

})


// When admin sends a delete employee request from the display page
app.get("/delete_employee_admin/:id", (req,res)=>{
  const useriD = req.params.id;
  console.log(useriD);
  employee
    .findByIdAndDelete(useriD)
    .then((result) => {
      res.redirect("/search");
    })

    .catch((err) => console.log(err));

})






app.get("/update_patient/:id", (req, res) => {
  const useriD = req.params.id;
  console.log(useriD);
  patient.findById(useriD).then((result) => {
    res.render("update_info_patient", { User: result });
  });
});

// Deleting a patient
app.get("/delete_patient/:id", (req, res) => {
  const useriD = req.params.id;
  console.log(useriD);
  patient
    .findByIdAndDelete(useriD)
    .then((result) => {
      res.redirect("/");
    })

    .catch((err) => console.log(err));
});

// For updating patient data
app.post("/update_info_patient", (req, res) => {
  let patient_username = req.body.UserName;

  patient.findOne({ UserName: patient_username }, function (err, doc) {
    if (doc) {
      let Name = "";
      let Email = "";
      let Gender = "";
      let CNIC = "";
      let PhoneNumber = "";
      let Password = "";
      let Address = "";

      if (req.body.Name == "") {
        Name = doc.Name;
      } else {
        Name = req.body.Name;
      }

      if (req.body.Email == "") {
        Email = doc.Email;
      } else {
        Email = req.body.Email;
      }

      if (req.body.Gender == "") {
        Gender = doc.Gender;
      } else {
        Gender = req.body.Gender;
      }

      if (req.body.CNIC == "") {
        CNIC = doc.CNIC;
      } else {
        CNIC = req.body.CNIC;
      }

      if (req.body.PhoneNumber == "") {
        PhoneNumber = doc.PhoneNumber;
      } else {
        PhoneNumber = req.body.PhoneNumber;
      }

      if (req.body.Password == "") {
        Password = doc.Password;
      } else {
        Password = req.body.Password;
      }

      if (req.body.Address == "") {
        Address = doc.Address;
      } else {
        Address = req.body.Address;
      }

      UserName = patient_username;
      let new_patient = {
        UserName,
        Name,
        Email,
        Gender,
        CNIC,
        PhoneNumber,
        Password,
        Address,
      };

      patient.findOneAndUpdate(
        { UserName: patient_username },
        new_patient,
        { upsert: true },
        function (err, doc1) {
          if (err) return res.send(500, { error: err });
          var title_display = "DashBoard | " + patient_username;
          res.render("patient_dashboard", {
            title: title_display,
            User: patient_username,
            userID: doc1._id,
            UserObj: doc1,
          });
        }
      );
    }
  });
});

app.get("/update_employee/:id", (req, res) => {
  const useriD = req.params.id;
  console.log(useriD);
  employee.findById(useriD).then((result) => {
    res.render("update_info_employee", { User: result });
  });
});

// Deleting an Employee
app.get("/delete_employee/:id", (req, res) => {
  const useriD = req.params.id;
  console.log(useriD);
  employee
    .findByIdAndDelete(useriD)
    .then((result) => {
      res.redirect("/");
    })

    .catch((err) => console.log(err));
});

// For updating employee data
app.post("/update_info_employee", (req, res) => {
  console.log(req.body);
  let employee_username = req.body.UserName;

  employee.findOne({ UserName: employee_username }, function (err, doc) {
    if (doc) {
      let Name = "";
      let Email = "";
      let Gender = "";
      let EmployeeNumber = "";
      let PhoneNumber = "";
      let Password = "";
      let Address = "";

      if (req.body.Name == "") {
        Name = doc.Name;
      } else {
        Name = req.body.Name;
      }

      if (req.body.Email == "") {
        Email = doc.Email;
      } else {
        Email = req.body.Email;
      }

      if (req.body.Gender == "") {
        Gender = doc.Gender;
      } else {
        Gender = req.body.Gender;
      }

      if (req.body.EmployeeNumber == "") {
        EmployeeNumber = doc.EmployeeNumber;
      } else {
        EmployeeNumber = req.body.EmployeeNumber;
      }

      if (req.body.PhoneNumber == "") {
        PhoneNumber = doc.PhoneNumber;
      } else {
        PhoneNumber = req.body.PhoneNumber;
      }

      if (req.body.Password == "") {
        Password = doc.Password;
      } else {
        Password = req.body.Password;
      }

      if (req.body.Address == "") {
        Address = doc.Address;
      } else {
        Address = req.body.Address;
      }

      UserName = employee_username;
      let employee_patient = {
        UserName,
        Name,
        Email,
        Gender,
        EmployeeNumber,
        PhoneNumber,
        Password,
        Address,
      };

      employee.findOneAndUpdate(
        { UserName: employee_username },
        employee_patient,
        { upsert: true },
        function (err, doc1) {
          if (err) return res.send(500, { error: err });
          var title_display = "DashBoard | " + employee_username;
          res.render("employee_dashboard", {
            title: title_display,
            User: employee_username,
            userID: doc1._id,
            UserObj: doc1,
          });
        }
      );
    }
  });
});

app.post("/login", async (req, res) => {
  const UserName = req.body.UserName;
  const Password = req.body.Password;

  let title_display = "DashBoard | " + UserName;

  employee
    .findOne({ UserName: UserName, Password: Password }, function (err, doc) {
      if (doc) {
        res.render("employee_dashboard", {
          title: title_display,
          User: UserName,
          userID: doc._id,
          UserObj: doc,
        });
      } else {
        patient
          .findOne(
            { UserName: UserName, Password: Password },
            function (err, doc) {
              if (doc) {
                res.render("patient_dashboard", {
                  title: title_display,
                  User: UserName,
                  userID: doc._id,
                  UserObj: doc,
                });
              } else {
                admin
                  .findOne(
                    { UserName: UserName, Password: Password },
                    function (err, doc) {
                      if (doc) {
                        res.render("admin_dashboard", {
                          title: title_display,
                          User: UserName,
                          userID: doc._id,
                          UserObj: doc,
                        });
                      } else {
                        res.render("login", {
                          title: "Login",
                          unavailable: "Invalid Username/Password",
                        });
                      }
                    }
                  )
                  .catch(function (err) {
                    console.log(err);
                  });
              }
            }
          )
          .catch(function (err) {
            console.log(err);
          });
      }
    })
    .catch(function (err) {
      console.log(err);
    });
});

