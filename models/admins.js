const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Define Mongoose Schema
const AdminSchema = new Schema({
  UserName: {
    type : String,
    unique : true
  },
  Password: String,
});
const admin = mongoose.model("admin", AdminSchema);
module.exports = admin

