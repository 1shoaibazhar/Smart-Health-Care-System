const mongoose = require('mongoose');
const Schema = mongoose.Schema;


    // Define Mongoose Schema
const employeeSchema = new mongoose.Schema({
      Name: String,
      Email: String,
      UserName: {
        type: String,
        unique : true
        },
      Gender: String,
      EmployeeNumber: Number,
      PhoneNumber : String,
      Password: String,
      Profession: String,
      Address: String
});

// Model
const employee = mongoose.model("Employee", employeeSchema);
module.exports = employee

