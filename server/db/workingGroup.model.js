const mongoose = require("mongoose");
const { Schema } = mongoose;

/**
 * @brief Mongoose schema definition for WorkingGroup documents.
 *
 * This schema defines the structure and validation rules for working group
 * documents in the MongoDB database. It represents organizational groups
 * that employees can be assigned to, with a unique name requirement and
 * references to employee members.
 *
 * @constant WorkingGroupSchema
 * @type {mongoose.Schema}
 *
 * @property {string} name - Working group name (required, trimmed, unique).
 * @property {Array<ObjectId>} employees - Array of references to Employee collection members.
 * @property {Date} createdAt - Auto-generated creation timestamp.
 * @property {Date} updatedAt - Auto-generated update timestamp.
 */
const WorkingGroupSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        employees: [
            {
                type: Schema.Types.ObjectId,
                ref: "Employee",
            },
        ],
    },
    {
        timestamps: true,
    }
);

/**
 * @brief Mongoose model for WorkingGroup collection.
 *
 * This model provides an interface for interacting with the 'workinggroups'
 * collection in MongoDB. It uses the WorkingGroupSchema for validation and
 * structure enforcement, ensuring working group name uniqueness and managing
 * relationships with employee documents.
 *
 * @module WorkingGroup
 * @exports {mongoose.Model}
 */
module.exports = mongoose.model("WorkingGroup", WorkingGroupSchema);

