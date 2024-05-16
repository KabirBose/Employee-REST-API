const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    // Firstname
    firstname: {
      type: String,
      required: true,
    },
    // Lastname
    lastname: {
      type: String,
      required: true,
    },
    // Role: [manager, developer, design, scrum master]
    role: {
      type: String,
      required: true,
    },
    // Status: [employed, fired]
    status: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = Employee = mongoose.model("Employee", employeeSchema);
