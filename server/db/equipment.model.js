const mongoose = require("mongoose");
const { Schema } = mongoose;

/**
 * @brief Mongoose schema definition for Equipment documents.
 *
 * This schema defines the structure and validation rules for equipment
 * documents in the MongoDB database. It represents physical equipment items
 * that can be assigned to employees, with tracking for inventory amounts.
 *
 * @constant EquipmentSchema
 * @type {mongoose.Schema}
 *
 * @property {string} name - Equipment item name (required, trimmed).
 * @property {string} type - Category or type of equipment (required, trimmed).
 * @property {number} amount - Quantity available in inventory (required, min: 0, default: 0).
 * @property {Date} createdAt - Auto-generated creation timestamp.
 * @property {Date} updatedAt - Auto-generated update timestamp.
 */
const EquipmentSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        type: {
            type: String,
            required: true,
            trim: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

/**
 * @brief Mongoose model for Equipment collection.
 *
 * This model provides an interface for interacting with the 'equipment'
 * collection in MongoDB. It uses the EquipmentSchema for validation and
 * structure enforcement.
 *
 * @module Equipment
 * @exports {mongoose.Model}
 */
module.exports = mongoose.model("Equipment", EquipmentSchema);

