require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Models
const EmployeeModel = require("./db/employee.model");
const EquipmentModel = require("./db/equipment.model");
const FavoriteBrandModel = require("./db/favoriteBrands.model");
const WorkingGroupModel = require("./db/workingGroup.model");

const { MONGO_URL, PORT = 8080 } = process.env;

if (!MONGO_URL) {
  console.error("Missing MONGO_URL environment variable");
  process.exit(1);
}

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: "*",
}));

// ----------------------- Employee Routes -----------------------
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

app.get("/api/employee/:id", async (req, res, next) => {
  try {
    const employee = await EmployeeModel.findById(req.params.id)
        .populate(["favoriteBrand", "equipment", "workingGroup"]);
    res.json(employee);
  } catch (err) {
    next(err);
  }
});

app.get("/api/missing-employees", async (req, res, next) => {
  try {
    const employees = await EmployeeModel.find({ present: false });
    res.json(employees);
  } catch (err) {
    next(err);
  }
});

app.post("/api/employees", async (req, res, next) => {
  try {
    const employee = await EmployeeModel.create(req.body);
    res.json(employee);
  } catch (err) {
    next(err);
  }
});

app.patch("/api/employees/:id", async (req, res, next) => {
  try {
    const { workingGroup, ...update } = req.body;

    if (workingGroup === "") {
      update.workingGroup = null;
    } else if (workingGroup) {
      update.workingGroup = mongoose.Types.ObjectId(workingGroup);
    }

    const employee = await EmployeeModel.findByIdAndUpdate(
        req.params.id,
        update,
        { new: true }
    ).populate("workingGroup");

    // Add employee to working group if provided
    if (workingGroup) {
      await WorkingGroupModel.findByIdAndUpdate(workingGroup, {
        $addToSet: { employees: employee._id },
      });
    }

    res.json(employee);
  } catch (err) {
    next(err);
  }
});

app.delete("/api/employees/:id", async (req, res, next) => {
  try {
    const deleted = await EmployeeModel.findByIdAndDelete(req.params.id);
    res.json(deleted);
  } catch (err) {
    next(err);
  }
});

// ----------------------- Equipment Routes -----------------------
app.get("/api/equipments", async (req, res, next) => {
  try {
    const equipments = await EquipmentModel.find();
    res.json(equipments);
  } catch (err) {
    next(err);
  }
});

app.get("/api/equipments/:id", async (req, res, next) => {
  try {
    const equipment = await EquipmentModel.findById(req.params.id);
    res.json(equipment);
  } catch (err) {
    next(err);
  }
});

app.post("/api/equipments", async (req, res, next) => {
  try {
    const equipment = await EquipmentModel.create(req.body);
    res.json(equipment);
  } catch (err) {
    next(err);
  }
});

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

app.delete("/api/equipments/:id", async (req, res, next) => {
  try {
    const deleted = await EquipmentModel.findByIdAndDelete(req.params.id);
    res.json(deleted);
  } catch (err) {
    next(err);
  }
});

// ----------------------- Favorite Brands -----------------------
app.get("/api/favoriteBrands", async (req, res, next) => {
  try {
    const brands = await FavoriteBrandModel.find();
    res.json(brands);
  } catch (err) {
    next(err);
  }
});

// ----------------------- Working Groups -----------------------
app.get("/api/workingGroups", async (req, res, next) => {
  try {
    const groups = await WorkingGroupModel.find().populate("employees");
    res.json(groups);
  } catch (err) {
    next(err);
  }
});

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

app.post("/api/workingGroup", async (req, res, next) => {
  try {
    const group = await WorkingGroupModel.create(req.body);
    res.json(group);
  } catch (err) {
    next(err);
  }
});

// ----------------------- Error handling -----------------------
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

// ----------------------- Connect and Start -----------------------
const start = async () => {
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

start();

