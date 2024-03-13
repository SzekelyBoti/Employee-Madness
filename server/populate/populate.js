/*
Loading the .env file and creates environment variables from it
*/
require("dotenv").config();
const mongoose = require("mongoose");
const names = require("./names.json");
const levels = require("./levels.json");
const positions = require("./positions.json");
const EmployeeModel = require("../db/employee.model");
const FavoriteBrandsModel = require("../db/favoriteBrands.model");
const brands = require("./brands.json");

const mongoUrl = process.env.MONGO_URL;

if (!mongoUrl) {
  console.error("Missing MONGO_URL environment variable");
  process.exit(1); // exit the current program
}

const pick = (from) => from[Math.floor(Math.random() * (from.length - 0))];

const populateEmployees = async () => {
  await EmployeeModel.deleteMany({});
  const favoriteBrandIds = await FavoriteBrandsModel.find().select("_id");

  const employees = names.map((name, index) => ({
    name,
    level: pick(levels),
    position: pick(positions),
    favoriteBrand: favoriteBrandIds[index % favoriteBrandIds.length],
  }));

  await EmployeeModel.create(...employees);
  console.log("Employees created");
};

const populateBrands = async () => {
  await FavoriteBrandsModel.deleteMany({});

  const brandsData = brands.map((name) => ({
    name,
  }));
  await FavoriteBrandsModel.create(...brandsData);
  console.log("Brands created");
};

const main = async () => {
  await mongoose.connect(mongoUrl);

  await populateEmployees();

  await populateBrands();

  await mongoose.disconnect();
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
