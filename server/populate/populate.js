require("dotenv").config();
const mongoose = require("mongoose");

const EmployeeModel = require("../db/employee.model");
const EquipmentModel = require("../db/equipment.model");
const FavoriteBrandsModel = require("../db/favoriteBrands.model");
const WorkingGroupModel = require("../db/workingGroup.model");

const names = require("../populate/names.json");
const levels = require("../populate/levels.json");
const positions = require("../populate/positions.json");
const brands = require("../populate/brands.json");

const { MONGO_URL } = process.env;

if (!MONGO_URL) {
  console.error("Missing MONGO_URL environment variable");
  process.exit(1);
}

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const populateBrands = async () => {
  const count = await FavoriteBrandsModel.countDocuments();
  if (count > 0) return await FavoriteBrandsModel.find();

  const brandsData = brands.map((name) => ({ name }));
  const savedBrands = await FavoriteBrandsModel.create(brandsData);
  console.log(`Brands created: ${savedBrands.length}`);
  return savedBrands;
};

const populateEmployees = async (favoriteBrands) => {
  const count = await EmployeeModel.countDocuments();
  if (count > 0) return;

  // If your Employee schema expects level as Number, convert here
  const numericLevels = levels.map((lvl) =>
      isNaN(Number(lvl)) ? levels.indexOf(lvl) + 1 : Number(lvl)
  );

  const employeesData = names.map((name, index) => ({
    name,
    level: pick(numericLevels),
    position: pick(positions),
    favoriteBrand: favoriteBrands[index % favoriteBrands.length]._id,
    present: pick([true, false]),
  }));

  const savedEmployees = await EmployeeModel.create(employeesData);
  console.log(`Employees created: ${savedEmployees.length}`);
};

const populateWorkingGroups = async () => {
  const count = await WorkingGroupModel.countDocuments();
  if (count > 0) return;

  // Example: create a few empty working groups
  const groups = ["Alpha", "Beta", "Gamma"].map((name) => ({ name }));
  const savedGroups = await WorkingGroupModel.create(groups);
  console.log(`Working groups created: ${savedGroups.length}`);
};

const populateDBIfEmpty = async () => {
  const favoriteBrands = await populateBrands();
  await populateEmployees(favoriteBrands);
  await populateWorkingGroups();
};

const main = async () => {
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    await populateDBIfEmpty();

    await mongoose.disconnect();
    console.log("Database population complete");
    process.exit(0);
  } catch (err) {
    console.error("Populate script failed:", err);
    process.exit(1);
  }
};

main();




