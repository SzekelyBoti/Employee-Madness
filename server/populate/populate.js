require("dotenv").config();
const mongoose = require("mongoose");

// Import database models
const EmployeeModel = require("../db/employee.model");
const EquipmentModel = require("../db/equipment.model");
const FavoriteBrandsModel = require("../db/favoriteBrands.model");
const WorkingGroupModel = require("../db/workingGroup.model");

// Import data files for population
const names = require("../populate/names.json");
const levels = require("../populate/levels.json");
const positions = require("../populate/positions.json");
const brands = require("../populate/brands.json");

// Get MongoDB connection URL from environment variables
const { MONGO_URL } = process.env;

/**
 * @brief Validates that the MongoDB connection URL is configured.
 *
 * Exits the process with an error if MONGO_URL is not defined in
 * the environment variables. This prevents connection attempts with
 * invalid or missing configuration.
 */
if (!MONGO_URL) {
  console.error("Missing MONGO_URL environment variable");
  process.exit(1);
}

/**
 * @brief Utility function to randomly select an element from an array.
 *
 * @param {Array} arr - The array to select from.
 * @returns {*} A randomly selected element from the array.
 */
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

/**
 * @brief Populates the favorite brands collection with initial data.
 *
 * Creates brand documents from the brands.json data file if the
 * collection is empty. If brands already exist, returns the existing ones.
 *
 * @returns {Promise<Array>} Array of brand documents (created or existing).
 */
const populateBrands = async () => {
  const count = await FavoriteBrandsModel.countDocuments();
  if (count > 0) return await FavoriteBrandsModel.find();

  const brandsData = brands.map((name) => ({ name }));
  const savedBrands = await FavoriteBrandsModel.create(brandsData);
  console.log(`Brands created: ${savedBrands.length}`);
  return savedBrands;
};

/**
 * @brief Populates the employees collection with initial data.
 *
 * Creates employee documents using random combinations of names, levels,
 * positions, and favorite brands. Only runs if the collection is empty.
 *
 * @param {Array} favoriteBrands - Array of brand documents for assignment.
 */
const populateEmployees = async (favoriteBrands) => {
  const count = await EmployeeModel.countDocuments();
  if (count > 0) return;

  // Convert level strings to numeric values if needed by schema
  const numericLevels = levels.map((lvl) =>
      isNaN(Number(lvl)) ? levels.indexOf(lvl) + 1 : Number(lvl)
  );

  // Create employee data by combining random attributes
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

/**
 * @brief Populates the working groups collection with initial data.
 *
 * Creates predefined working groups (Alpha, Beta, Gamma) if the
 * collection is empty. Groups are created without employees initially.
 */
const populateWorkingGroups = async () => {
  const count = await WorkingGroupModel.countDocuments();
  if (count > 0) return;

  // Create example working groups
  const groups = ["Alpha", "Beta", "Gamma"].map((name) => ({ name }));
  const savedGroups = await WorkingGroupModel.create(groups);
  console.log(`Working groups created: ${savedGroups.length}`);
};

/**
 * @brief Orchestrates the database population process.
 *
 * Calls individual population functions in sequence, ensuring each
 * collection is populated only if empty. Maintains dependencies
 * between collections (e.g., employees need brands to exist first).
 */
const populateDBIfEmpty = async () => {
  const favoriteBrands = await populateBrands();
  await populateEmployees(favoriteBrands);
  await populateWorkingGroups();
};

/**
 * @brief Main function that executes the database population script.
 *
 * Connects to MongoDB, runs the population process, then disconnects
 * and exits. Handles connection errors and script failures gracefully.
 */
const main = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // Populate database with initial data
    await populateDBIfEmpty();

    // Clean disconnect after completion
    await mongoose.disconnect();
    console.log("Database population complete");
    process.exit(0);
  } catch (err) {
    console.error("Populate script failed:", err);
    process.exit(1);
  }
};

// Execute the main function
main();




