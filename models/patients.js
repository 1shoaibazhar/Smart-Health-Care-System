const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define Mongoose Schema
const patientSchema = new mongoose.Schema({
	Name: String,
	Email: String,
	UserName: {
		type: String,
		unique: true,
	},
	Gender: String,
	CNIC: Number,
	PhoneNumber: String,
	Password: String,
	Address: String,
});

// Model
const patient = mongoose.model("Patient", patientSchema);
module.exports = patient;
