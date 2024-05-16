// Dependencies
const express = require("express");
const router = express.Router();
const Employee = require("../models/Employee");

// Search all employees
router.get("/show-employees", async (req, res) => {
  try {
    const employees = await Employee.find();

    if (employees.length === 0) {
      res
        .json({
          status: "success",
          data: "There are no employees.",
        })
        .status(200);
    } else {
      res
        .json({
          status: "success",
          data: employees,
        })
        .status(200);
    }
  } catch (error) {
    res.json({ status: "fail", error }).status(500);
  }
});

// Search employee by firstname, lastname, or id
router.get("/show-employee", async (req, res) => {
  try {
    const { firstname, lastname, id } = req.body;

    const employee = await Employee.find().or([
      { firstname },
      { lastname },
      { _id: id },
    ]);

    if (employee.length === 0) {
      res
        .json({
          status: "fail",
          error:
            "This employee does not exist. Please enter an existing name or ID.",
        })
        .status(400);
    } else {
      res
        .json({
          status: "success",
          data: employee,
        })
        .status(500);
    }
  } catch (error) {
    if (error.name === "CastError") {
      res
        .json({
          status: "fail",
          error:
            "A user with this ID does not exist. Please enter an existing name or ID.",
        })
        .status(400);
    } else {
      res.json({ status: "fail", error }).status(500);
    }
  }
});

// Create employee
router.post("/add-employee", async (req, res) => {
  try {
    const { firstname, lastname, role, status } = req.body;

    const formattedRole = role.toLocaleLowerCase().replace(/\s/g, "");
    const formattedStatus = status.toLocaleLowerCase().replace(/\s/g, "");

    if (
      (formattedRole === "manager" ||
        formattedRole === "developer" ||
        formattedRole === "design" ||
        formattedRole === "scrummaster") &&
      (formattedStatus === "employed" || formattedStatus === "fired")
    ) {
      const employee = new Employee({ firstname, lastname, role, status });
      await employee.save();

      res
        .json({
          status: "success",
          data: employee,
        })
        .status(200);
    } else {
      res
        .json({
          status: "fail",
          error:
            "Please enter a valid role: [Manager, Developer, Design, Scrum Master] or valid status: [Employed, Fired]",
        })
        .status(400);
    }
  } catch (error) {
    if (error.name === "ValidationError") {
      res
        .json({
          status: "fail",
          error:
            "You are missing a field. Please enter a firstname, lastname, role, and status.",
        })
        .status(400);
    } else {
      res.json({ status: "fail", error }).status(500);
    }
  }
});

// Delete employee
router.delete("/delete-employee", async (req, res) => {
  try {
    const { id } = req.body;
    const employee = await Employee.findByIdAndDelete(id);

    res
      .json({
        status: "success",
        data: employee,
      })
      .status(200);
  } catch (error) {
    if (error.name === "CastError") {
      res
        .json({ status: "fail", error: "Please enter a valid ID." })
        .status(400);
    } else {
      res.json({ status: "fail", error }).status(500);
    }
  }
});

// Update employee
router.patch("/update-employee", async (req, res) => {
  try {
    const { firstname, lastname, role, status, id } = req.body;
    const employee = await Employee.findByIdAndUpdate(id, {
      firstname,
      lastname,
      role,
      status,
    });

    res
      .json({
        status: "success",
        data: employee,
      })
      .status(200);
  } catch (error) {
    if (error.name === "CastError") {
      res
        .json({ status: "fail", error: "Please enter a valid ID." })
        .status(400);
    } else {
      res.json({ status: "fail", error }).status(500);
    }
  }
});

// Show total roles and employees
router.get("/admin/show-roles", async (req, res) => {
  try {
    const employees = await Employee.find();

    let manager = 0;
    let developer = 0;
    let design = 0;
    let scrumMaster = 0;

    employees.forEach((employee) => {
      const role = employee.role.toLocaleLowerCase().replace(/\s/g, "");

      if (role === "manager") manager++;
      else if (role === "developer") developer++;
      else if (role === "design") design++;
      else if (role === "scrummaster") scrumMaster++;
      else
        res
          .json({
            status: "fail",
            error: "This role does not exist.",
          })
          .status(400);
    });

    res
      .json({
        status: "success",
        totalEmployees: employees.length,
        totalRoles: {
          manager,
          developer,
          design,
          scrumMaster,
        },
      })
      .status(200);
  } catch (error) {
    res.json({ status: "fail", error }).status(500);
  }
});

module.exports = router;
