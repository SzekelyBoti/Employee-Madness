const mongoose = require("mongoose");
const { Schema } = mongoose;

/**
 * @brief Mongoose schema definition for Employee documents.
 *
 * This schema defines the structure and validation rules for employee
 * documents in the MongoDB database. It includes fields for employee
 * information, relationships to other collections, and timestamps.
 *
 * @constant EmployeeSchema
 * @type {mongoose.Schema}
 *
 * @property {string} name - Employee's full name (required, trimmed).
 * @property {string} level - Employee's experience level (required).
 * @property {string} position - Employee's job position (required, trimmed).
 * @property {ObjectId} workingGroup - Reference to WorkingGroup collection (optional).
 * @property {ObjectId} favoriteBrand - Reference to FavoriteBrand collection (required).
 * @property {Array<ObjectId>} equipment - Array of references to Equipment collection.
 * @property {boolean} present - Whether the employee is currently present (default: false).
 * @property {Date} createdAt - Auto-generated creation timestamp.
 * @property {Date} updatedAt - Auto-generated update timestamp.
 */
const EmployeeSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        level: {
            type: String,
            required: true,
            min: 0,
        },
        position: {
            type: String,
            required: true,
            trim: true,
        },
        workingGroup: {
            type: Schema.Types.ObjectId,
            ref: "WorkingGroup",
            default: null,
        },
        favoriteBrand: {
            type: Schema.Types.ObjectId,
            ref: "FavoriteBrand",
            required: true,
        },
        equipment: [
            {
                type: Schema.Types.ObjectId,
                ref: "Equipment",
            },
        ],
        present: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

/**
 * @brief Mongoose model for Employee collection.
 *
 * This model provides an interface for interacting with the 'employees'
 * collection in MongoDB. It uses the EmployeeSchema for validation and
 * structure enforcement.
 *
 * @module Employee
 * @exports {mongoose.Model}
 */
module.exports = mongoose.model("Employee", EmployeeSchema);
