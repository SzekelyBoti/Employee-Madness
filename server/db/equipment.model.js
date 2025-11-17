const mongoose = require("mongoose");
const { Schema } = mongoose;

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

module.exports = mongoose.model("Equipment", EquipmentSchema);

