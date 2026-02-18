require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const client = require("prom-client");

// Import database models
const EmployeeModel = require("./db/employee.model");
const EquipmentModel = require("./db/equipment.model");
const FavoriteBrandModel = require("./db/favoriteBrands.model");
const WorkingGroupModel = require("./db/workingGroup.model");

// Get environment variables with defaults
const IS_TEST = process.env.NODE_ENV === "test";
const { MONGO_URL, PORT = 8080 } = process.env;

/**
 * @brief Validates that the MongoDB connection URL is configured.
 *
 * Exits the process with an error if MONGO_URL is not defined in
 * the environment variables. This prevents server startup with
 * invalid or missing configuration.
 */
if (!MONGO_URL && !IS_TEST) {
  console.error("Missing MONGO_URL environment variable");
  process.exit(1);
}

const app = express();

// ----------------------- Middleware Configuration -----------------------

/**
 * @brief Initialize Prometheus metrics collection.
 *
 * Sets up default metrics for monitoring application performance
 * and resource usage with a custom prefix for identification.
 */
client.collectDefaultMetrics({ prefix: "employee_app_" });

// Enable JSON request body parsing
app.use(express.json());

// Enable CORS for all origins (adjust for production)
app.use(cors({
  origin: "*",
}));

// ----------------------- Prometheus Metrics Endpoint -----------------------

/**
 * @brief Provides Prometheus metrics endpoint for monitoring.
 *
 * This endpoint is scraped by Prometheus to collect application
 * metrics including request counts, response times, and system metrics.
 *
 * @route GET /metrics
 */
app.get("/metrics", async (req, res) => {
  console.log("Prometheus scraped metrics");
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// ----------------------- Employee Routes -----------------------

/**
 * @brief Retrieves all employees with populated relationships.
 *
 * Returns all employee documents with favoriteBrand, equipment,
 * and workingGroup relationships populated. Results are sorted
 * by creation date (newest first).
 *
 * @route GET /api/employees
 * @returns {Array} Array of employee objects with populated relationships.
 */
app.get("/api/employees", async (req, res, next) => {
  try {
    const employees = await EmployeeModel.find()
        .populate(["favoriteBrand", "equipment", "workingGroup"])
        .sort({ created: -1 });
    res.json(employees);
  } catch (err) {
    next(err);
  }
});

/**
 * @brief Searches employees by name using case-insensitive regex.
 *
 * Returns employees whose names match the provided search term.
 * Useful for autocomplete or search functionality.
 *
 * @route GET /api/employees/:searchTerm
 * @param {string} searchTerm - Search term to match against employee names.
 * @returns {Array} Array of matching employee objects.
 */
app.get("/api/employees/:searchTerm", async (req, res, next) => {
  try {
    const searchTerm = req.params.searchTerm;
    const employees = await EmployeeModel.find({
      name: { $regex: new RegExp(searchTerm, "i") },
    });
    res.json(employees);
  } catch (err) {
    next(err);
  }
});

/**
 * @brief Retrieves a single employee by ID with populated relationships.
 *
 * Returns detailed information for a specific employee including
 * all related data (favoriteBrand, equipment, workingGroup).
 *
 * @route GET /api/employee/:id
 * @param {string} id - Employee document ID.
 * @returns {Object} Employee object with populated relationships.
 */
app.get("/api/employee/:id", async (req, res, next) => {
  try {
    const employee = await EmployeeModel.findById(req.params.id)
        .populate(["favoriteBrand", "equipment", "workingGroup"]);
    res.json(employee);
  } catch (err) {
    next(err);
  }
});

/**
 * @brief Retrieves employees who are marked as not present (missing).
 *
 * Returns a list of employees with `present: false`. Used for tracking
 * attendance or absence.
 *
 * @route GET /api/missing-employees
 * @returns {Array} Array of employee objects who are not present.
 */
app.get("/api/missing-employees", async (req, res, next) => {
  try {
    const employees = await EmployeeModel.find({ present: false });
    res.json(employees);
  } catch (err) {
    next(err);
  }
});

/**
 * @brief Creates a new employee record.
 *
 * Accepts employee data in request body and creates a new document
 * in the employees collection. Returns the created employee.
 *
 * @route POST /api/employees
 * @param {Object} req.body - Employee data for creation.
 * @returns {Object} The newly created employee object.
 */
app.post("/api/employees", async (req, res, next) => {
  try {
    const employee = await EmployeeModel.create(req.body);
    res.json(employee);
  } catch (err) {
    next(err);
  }
});

app.get("/error-test", (req, res, next) => next(new Error("Test error")));

/**
 * @brief Updates an existing employee record.
 *
 * Partially updates an employee document. Handles special logic for
 * working group assignments, including adding employees to groups
 * and clearing group assignments.
 *
 * @route PATCH /api/employees/:id
 * @param {string} id - Employee document ID to update.
 * @param {Object} req.body - Partial employee data for update.
 * @returns {Object} The updated employee object.
 */
app.patch("/api/employees/:id", async (req, res, next) => {
  try {
    const { workingGroup, ...update } = req.body;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid employee ID" });
    }

    if (update.level !== undefined) update.level = Number(update.level);

    if (workingGroup === "") {
      update.workingGroup = null;
    } else if (workingGroup) {
      if (!mongoose.Types.ObjectId.isValid(workingGroup)) {
        return res.status(400).json({ error: "Invalid workingGroup ID" });
      }
      update.workingGroup = mongoose.Types.ObjectId(workingGroup);
    }
    
    let employee = await EmployeeModel.findByIdAndUpdate(
        id,
        { $set: update },
        { new: true, runValidators: true }
    ).populate("workingGroup");

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    
    if (workingGroup && update.workingGroup) {
      await WorkingGroupModel.findByIdAndUpdate(workingGroup, {
        $addToSet: { employees: employee._id },
      });
    }

    res.json(employee);
  } catch (err) {
    next(err);
  }
});

/**
 * @brief Deletes an employee record.
 *
 * Removes an employee document from the collection by ID.
 * Returns the deleted document.
 *
 * @route DELETE /api/employees/:id
 * @param {string} id - Employee document ID to delete.
 * @returns {Object} The deleted employee object.
 */
app.delete("/api/employees/:id", async (req, res, next) => {
  try {
    const deleted = await EmployeeModel.findByIdAndDelete(req.params.id);
    res.json(deleted);
  } catch (err) {
    next(err);
  }
});

// ----------------------- Equipment Routes -----------------------

/**
 * @brief Retrieves all equipment records.
 *
 * Returns all documents from the equipment collection.
 *
 * @route GET /api/equipments
 * @returns {Array} Array of equipment objects.
 */
app.get("/api/equipments", async (req, res, next) => {
  try {
    const equipments = await EquipmentModel.find();
    res.json(equipments);
  } catch (err) {
    next(err);
  }
});

/**
 * @brief Retrieves a single equipment record by ID.
 *
 * Returns detailed information for a specific equipment item.
 *
 * @route GET /api/equipments/:id
 * @param {string} id - Equipment document ID.
 * @returns {Object} Equipment object.
 */
app.get("/api/equipments/:id", async (req, res, next) => {
  try {
    const equipment = await EquipmentModel.findById(req.params.id);
    res.json(equipment);
  } catch (err) {
    next(err);
  }
});

/**
 * @brief Creates a new equipment record.
 *
 * Accepts equipment data in request body and creates a new document
 * in the equipment collection.
 *
 * @route POST /api/equipments
 * @param {Object} req.body - Equipment data for creation.
 * @returns {Object} The newly created equipment object.
 */
app.post("/api/equipments", async (req, res, next) => {
  try {
    const equipment = await EquipmentModel.create(req.body);
    res.json(equipment);
  } catch (err) {
    next(err);
  }
});

/**
 * @brief Updates an existing equipment record.
 *
 * Partially updates an equipment document by ID.
 *
 * @route PATCH /api/equipments/:id
 * @param {string} id - Equipment document ID to update.
 * @param {Object} req.body - Partial equipment data for update.
 * @returns {Object} The updated equipment object.
 */
app.patch("/api/equipments/:id", async (req, res, next) => {
  try {
    const equipment = await EquipmentModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.json(equipment);
  } catch (err) {
    next(err);
  }
});

/**
 * @brief Deletes an equipment record.
 *
 * Removes an equipment document from the collection by ID.
 *
 * @route DELETE /api/equipments/:id
 * @param {string} id - Equipment document ID to delete.
 * @returns {Object} The deleted equipment object.
 */
app.delete("/api/equipments/:id", async (req, res, next) => {
  try {
    const deleted = await EquipmentModel.findByIdAndDelete(req.params.id);
    res.json(deleted);
  } catch (err) {
    next(err);
  }
});

// ----------------------- Favorite Brands Routes -----------------------

/**
 * @brief Retrieves all favorite brand records.
 *
 * Returns all documents from the favoriteBrands collection.
 *
 * @route GET /api/favoriteBrands
 * @returns {Array} Array of favorite brand objects.
 */
app.get("/api/favoriteBrands", async (req, res, next) => {
  try {
    const brands = await FavoriteBrandModel.find();
    res.json(brands);
  } catch (err) {
    next(err);
  }
});

// ----------------------- Working Groups Routes -----------------------

/**
 * @brief Retrieves all working groups with populated employee lists.
 *
 * Returns all working group documents with their employee members
 * populated for display.
 *
 * @route GET /api/workingGroups
 * @returns {Array} Array of working group objects with populated employees.
 */
app.get("/api/workingGroups", async (req, res, next) => {
  try {
    const groups = await WorkingGroupModel.find().populate("employees");
    res.json(groups);
  } catch (err) {
    next(err);
  }
});

/**
 * @brief Retrieves a single working group by ID with populated employees.
 *
 * Returns detailed information for a specific working group including
 * its member employees.
 *
 * @route GET /api/workingGroup/:id
 * @param {string} id - Working group document ID.
 * @returns {Object} Working group object with populated employees.
 */
app.get("/api/workingGroup/:id", async (req, res, next) => {
  try {
    const group = await WorkingGroupModel.findById(req.params.id).populate(
        "employees"
    );
    res.json(group);
  } catch (err) {
    next(err);
  }
});

/**
 * @brief Creates a new working group.
 *
 * Accepts working group data in request body and creates a new document
 * in the workingGroups collection.
 *
 * @route POST /api/workingGroup
 * @param {Object} req.body - Working group data for creation.
 * @returns {Object} The newly created working group object.
 */
app.post("/api/workingGroup", async (req, res, next) => {
  try {
    const group = await WorkingGroupModel.create(req.body);
    res.json(group);
  } catch (err) {
    next(err);
  }
});

// ----------------------- Error Handling Middleware -----------------------

/**
 * @brief Global error handling middleware.
 *
 * Catches and handles errors from all route handlers. Logs errors
 * to console and returns a standardized error response.
 *
 * @param {Error} err - The error object.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

// ----------------------- Database Connection and Server Startup -----------------------

/**
 * @brief Connects to MongoDB and starts the Express server.
 *
 * Establishes database connection with appropriate options,
 * then starts listening on the configured port.
 */
const start = async () => {
  try {
    if (!IS_TEST) {
      await mongoose.connect(MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Connected to MongoDB");

      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    }
  } catch (err) {
    console.error("Failed to start server:", err);
    if (!IS_TEST) {
      process.exit(1);
    } else {
      throw err;
    }
  }
};

if (!IS_TEST) {
  start();
}

module.exports = { app };

