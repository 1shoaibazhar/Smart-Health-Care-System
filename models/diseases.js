const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define Mongoose Schema
const diseaseSchema = new mongoose.Schema({
	UserName: {
		type: String,
		unique: true,
	},
	HeartAttack: Number,
	Diabetes: Number,
	Jaundice: Number,
	Malaria: Number,
	Appendicitis: Number,
	Tuberculosis: Number,
});

// Model
const disease = mongoose.model("Disease", diseaseSchema);
module.exports = disease;
