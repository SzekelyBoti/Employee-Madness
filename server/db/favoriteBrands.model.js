const mongoose = require("mongoose");
const { Schema } = mongoose;

/**
 * @brief Mongoose schema definition for FavoriteBrand documents.
 *
 * This schema defines the structure and validation rules for favorite brand
 * documents in the MongoDB database. It represents brands that employees
 * can select as their favorites, ensuring uniqueness to prevent duplicates.
 *
 * @constant FavoriteBrandSchema
 * @type {mongoose.Schema}
 *
 * @property {string} name - Brand name (required, trimmed, unique).
 * @property {Date} createdAt - Auto-generated creation timestamp.
 * @property {Date} updatedAt - Auto-generated update timestamp.
 */
const FavoriteBrandSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
    },
    {
        timestamps: true,
    }
);

/**
 * @brief Mongoose model for FavoriteBrand collection.
 *
 * This model provides an interface for interacting with the 'favoritebrands'
 * collection in MongoDB. It uses the FavoriteBrandSchema for validation and
 * structure enforcement, ensuring brand name uniqueness across the collection.
 *
 * @module FavoriteBrand
 * @exports {mongoose.Model}
 */
module.exports = mongoose.model("FavoriteBrand", FavoriteBrandSchema);

