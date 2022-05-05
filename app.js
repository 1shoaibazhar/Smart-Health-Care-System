const express = require("express");
const path = require("path");
const app = express();
const morgan = require("morgan");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();
//For field validations
const { check, validationResult } = require("express-validator");

// Linking the mongoose schema with the app.js file
const employee = require("./models/employees");
const admin = require("./models/admins");
const patient = require("./models/patients");

// Linking mongodb Atlas database and then starting the server
const mongodbURL = String(process.env.MONGO_URL);
mongoose
	.connect(mongodbURL)
	.then(() => {
		console.log("Database is connected");
		const port = 3000 || process.env.PORT;
		// START THE SERVER
		app.listen(port, () => {
			console.log(`The application started successfully on port ${port}`);
		});
	})
	.catch((err) => {
		console.log("Database is not connected");
		console.log(err);
	});

// Setting view engine as ejs
app.set("view engine", "ejs");

// app.use(morgan('dev'));
const urlencodedParser = bodyparser.urlencoded({ extended: false });
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
	myData.save(function (err, admin) {
		if (err) return console.error(err);
	});
});

app.get("/login", (req, res) => {
	res.render("login", { title: "Login", unavailable: "" });
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

//***********************to load page  */
app.get("/admin_dashboard", (req, res) => {
	res.render("admin_dashboard", { title: "Admin Dashboard" });
});

//***********************to load page  */
app.get("/display", (req, res) => {
	res.render("display", { title: "Display Patient/Employee" });
});

//***********************page redirection link anchor tag/ normal buttons outside form  */
app.get("/search", (req, res) => {
	res.render("search", { title: "Search Patient/Employee" });
});

app.get("/predict_heartattack", (req, res) => {
	res.render("predict_heartattack", { title: "Predict Heart Attack" });
});

app.get("/predict_diabetes", (req, res) => {
	res.render("predict_diabetes", { title: "Predict Diabetes" });
});

app.get("/predict_jaundice", (req, res) => {
	res.render("predict_jaundice", { title: "Predict Jaundice" });
});

app.get("/predict_malaria", (req, res) => {
	res.render("predict_malaria", { title: "Predict Malaria" });
});

app.get("/predict_appendicitis", (req, res) => {
	res.render("predict_appendicitis", { title: "Predict Appendicitis" });
});

app.get("/predict_tuberculosis", (req, res) => {
	res.render("predict_tuberculosis", { title: "Predict Tuberculosis" });
});

//************form button  */
app.post(
	"/search",
	urlencodedParser,
	[
		// Input Validation Checks using Express Validator
		check("Name")
			.exists()
			.withMessage("Name is required")
			.isLength({ min: 3 })
			.withMessage("Name must be of 3 characters long.")
			.matches(/^[A-Za-z\s]+$/)
			.withMessage("Name must be alphabetic."),
	],
	(req, res) => {
		const errors = validationResult(req);
		// if error exists then same page is loaded with errors in form
		if (!errors.isEmpty()) {
			const alert = errors.array();
			res.render("search", { title: "Search Patient/Employee", alert });
		} else {
			console.log(req.body);
			const name = req.body.Name;
			if (req.body.Designation == "Patient") {
				patient.find({ Name: name }, function (err, doc) {
					if (!err) {
						res.render("display", {
							title: "Search Results",
							users: doc,
							Designation: "Patient",
						});
					}
				});
			} else {
				employee.find(
					{ Name: name, Profession: req.body.Designation },
					function (err, doc) {
						if (!err) {
							res.render("display", {
								title: "Search Results",
								users: doc,
								Designation: "Employee",
							});
						}
					}
				);
			}
		}
	}
);

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

app.post(
	"/admin_signup",
	urlencodedParser,
	[
		// Input Validation Checks using Express Validator
		check("Name")
			.exists()
			.withMessage("Name is required")
			.isLength({ min: 3 })
			.withMessage("Name must be of 3 characters long.")
			.matches(/^[A-Za-z\s]+$/)
			.withMessage("Name must be alphabetic."),
		check("Email")
			.exists()
			.withMessage("Email is required")
			.isEmail()
			.withMessage("Email is not valid"),
		check("UserName")
			.exists()
			.withMessage("UserName is required")
			.isLength({ min: 4, max: 10 })
			.withMessage(
				"UserName must be of atleast 4 characters and at max 10 characters"
			)
			.isAlphanumeric()
			.withMessage("UserName can only contain alphabets and numbers"),
		check("EmployeeNumber")
			.exists()
			.withMessage("Employee Number is required")
			.isLength({ min: 6, max: 6 })
			.withMessage("Employee Number must be of 6 digits")
			.isNumeric()
			.withMessage("Employee Number can only contain numbers"),
		check("PhoneNumber")
			.exists()
			.withMessage("Phone Number is required")
			.isLength({ min: 7, max: 15 })
			.withMessage(
				"Phone Number must be of atleast 7 digits and at max 15 digits"
			)
			.isNumeric()
			.withMessage(
				"Phone Number can only contain numbers (no + sign required)"
			),
		check("Password")
			.exists()
			.withMessage("Password is required")
			.isLength({ min: 6, max: 10 })
			.withMessage(
				"Password must be of atleast 6 characters and at max 10 characters"
			)
			.not()
			.isLowercase()
			.withMessage("Password must contain at least an upper case alphabet")
			.not()
			.isUppercase()
			.withMessage("Password must contain at least a lower case alphabet")
			.not()
			.isAlpha()
			.withMessage("Password must contain a non letter character"),
		check("Address")
			.exists()
			.withMessage("Address is required")
			.isLength({ min: 15 })
			.withMessage("Address is not complete"),
	],
	(req, res) => {
		const errors = validationResult(req);
		// if error exists then same page is loaded with errors in form
		if (!errors.isEmpty()) {
			const alert = errors.array();
			res.render("admin_signup", { title: "Employees SignUp", alert });
		} else {
			var myData = new employee(req.body);
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
		}
	}
);

app.post(
	"/patient_signup",
	urlencodedParser,
	[
		// Input Validation Checks using Express Validator
		check("Name")
			.exists()
			.withMessage("Name is required")
			.isLength({ min: 3 })
			.withMessage("Name must be of 3 characters long.")
			.matches(/^[A-Za-z\s]+$/)
			.withMessage("Name must be alphabetic."),
		check("Email")
			.exists()
			.withMessage("Email is required")
			.isEmail()
			.withMessage("Email is not valid"),
		check("UserName")
			.exists()
			.withMessage("UserName is required")
			.isLength({ min: 4, max: 10 })
			.withMessage(
				"UserName must be of atleast 4 characters and at max 10 characters"
			)
			.isAlphanumeric()
			.withMessage("UserName can only contain alphabets and numbers"),
		check("CNIC")
			.exists()
			.withMessage("CNIC is required")
			.isLength({ min: 11, max: 11 })
			.withMessage("CNIC must be of 11 digits")
			.isNumeric()
			.withMessage("CNIC can only contain numbers"),
		check("PhoneNumber")
			.exists()
			.withMessage("Phone Number is required")
			.isLength({ min: 7, max: 15 })
			.withMessage(
				"Phone Number must be of atleast 7 digits and at max 15 digits"
			)
			.isNumeric()
			.withMessage(
				"Phone Number can only contain numbers (no + sign required)"
			),
		check("Password")
			.exists()
			.withMessage("Password is required")
			.isLength({ min: 6, max: 10 })
			.withMessage(
				"Password must be of atleast 6 characters and at max 10 characters"
			)
			.not()
			.isLowercase()
			.withMessage("Password must contain at least an upper case alphabet")
			.not()
			.isUppercase()
			.withMessage("Password must contain at least a lower case alphabet")
			.not()
			.isAlpha()
			.withMessage("Password must contain a non letter character"),
		check("Address")
			.exists()
			.withMessage("Address is required")
			.isLength({ min: 15 })
			.withMessage("Address is not complete"),
	],
	(req, res) => {
		const errors = validationResult(req);
		// if error exists then same page is loaded with errors in form
		if (!errors.isEmpty()) {
			const alert = errors.array();
			res.render("patient_signup", { title: "Patient SignUp", alert });
		} else {
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
		}
	}
);

// When admin sends a delete patient request from the display page
app.get("/delete_patient_admin/:id", (req, res) => {
	const useriD = req.params.id;

	// Searching all users by that name in order to display them on the search page after the current user is deleted
	patient.findById(useriD).then((result) => {
		const name = result.Name;
		patient
			.findByIdAndDelete(useriD)
			.then((result) => {
				patient.find({ Name: name }, function (err, doc) {
					if (!err) {
						res.render("display", {
							title: "Search Results",
							users: doc,
							Designation: "Patient",
						});
					}
				});
			})

			.catch((err) => console.log(err));
	});
});

// When admin sends a delete employee request from the display page
app.get("/delete_employee_admin/:id", (req, res) => {
	const useriD = req.params.id;

	// Searching all users by that name in order to display them on the search page after the current user is deleted
	employee.findById(useriD).then((result) => {
		const name = result.Name;
		employee
			.findByIdAndDelete(useriD)
			.then((result) => {
				employee.find({ Name: name }, function (err, doc) {
					if (!err) {
						res.render("display", {
							title: "Search Results",
							users: doc,
							Designation: "Employee",
						});
					}
				});
			})

			.catch((err) => console.log(err));
	});
});

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
			// res.json({ redirect: '/login'});
			res.redirect("/");
		})

		.catch((err) => console.log(err));
});

// For updating patient data
app.post(
	"/update_info_patient",
	urlencodedParser,
	[
		// Input Validation Checks using Express Validator to see if updated info is correct or not
		check("Name")
			.exists()
			.withMessage("Name is required")
			.isLength({ min: 3 })
			.withMessage("Name must be of 3 characters long.")
			.matches(/^[A-Za-z\s]+$/)
			.withMessage("Name must be alphabetic."),
		check("Email")
			.exists()
			.withMessage("Email is required")
			.isEmail()
			.withMessage("Email is not valid"),
		check("CNIC")
			.exists()
			.withMessage("CNIC is required")
			.isLength({ min: 11, max: 11 })
			.withMessage("CNIC must be of 11 digits")
			.isNumeric()
			.withMessage("CNIC can only contain numbers"),
		check("PhoneNumber")
			.exists()
			.withMessage("Phone Number is required")
			.isLength({ min: 7, max: 15 })
			.withMessage(
				"Phone Number must be of atleast 7 digits and at max 15 digits"
			)
			.isNumeric()
			.withMessage(
				"Phone Number can only contain numbers (no + sign required)"
			),
		check("Password")
			.exists()
			.withMessage("Password is required")
			.isLength({ min: 6, max: 10 })
			.withMessage(
				"Password must be of atleast 6 characters and at max 10 characters"
			)
			.not()
			.isLowercase()
			.withMessage("Password must contain at least an upper case alphabet")
			.not()
			.isUppercase()
			.withMessage("Password must contain at least a lower case alphabet")
			.not()
			.isAlpha()
			.withMessage("Password must contain a non letter character"),
		check("Address")
			.exists()
			.withMessage("Address is required")
			.isLength({ min: 15 })
			.withMessage("Address is not complete"),
	],
	(req, res) => {
		const errors = validationResult(req);
		// if error exists then same page is loaded with errors in form
		if (!errors.isEmpty()) {
			const alert = errors.array();
			let patient_username = req.body.UserName;
			patient.findOne({ UserName: patient_username }, function (err, doc) {
				if (doc) {
					res.render("update_info_patient", { User: doc, alert });
				}
			});
		} else {
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
		}
	}
);

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
app.post(
	"/update_info_employee",
	urlencodedParser,
	[
		// Input Validation Checks using Express Validator to see if updated info is correct or not
		check("Name")
			.exists()
			.withMessage("Name is required")
			.isLength({ min: 3 })
			.withMessage("Name must be of 3 characters long.")
			.matches(/^[A-Za-z\s]+$/)
			.withMessage("Name must be alphabetic."),
		check("Email")
			.exists()
			.withMessage("Email is required")
			.isEmail()
			.withMessage("Email is not valid"),
		check("EmployeeNumber")
			.exists()
			.withMessage("Employee Number is required")
			.isLength({ min: 6, max: 6 })
			.withMessage("Employee Number must be of 6 digits")
			.isNumeric()
			.withMessage("Employee Number can only contain numbers"),
		check("PhoneNumber")
			.exists()
			.withMessage("Phone Number is required")
			.isLength({ min: 7, max: 15 })
			.withMessage(
				"Phone Number must be of atleast 7 digits and at max 15 digits"
			)
			.isNumeric()
			.withMessage(
				"Phone Number can only contain numbers (no + sign required)"
			),
		check("Password")
			.exists()
			.withMessage("Password is required")
			.isLength({ min: 6, max: 10 })
			.withMessage(
				"Password must be of atleast 6 characters and at max 10 characters"
			)
			.not()
			.isLowercase()
			.withMessage("Password must contain at least an upper case alphabet")
			.not()
			.isUppercase()
			.withMessage("Password must contain at least a lower case alphabet")
			.not()
			.isAlpha()
			.withMessage("Password must contain a non letter character"),
		check("Address")
			.exists()
			.withMessage("Address is required")
			.isLength({ min: 15 })
			.withMessage("Address is not complete"),
	],
	(req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const alert = errors.array();
			let employee_username = req.body.UserName;
			employee.findOne({ UserName: employee_username }, function (err, doc) {
				if (doc) {
					res.render("update_info_employee", { User: doc, alert });
				}
			});
		} else {
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
		}
	}
);

app.post("/login", async (req, res) => {
	const UserName = req.body.UserName;
	const Password = req.body.Password;

	let title_display = "DashBoard | " + UserName;

	await employee
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
