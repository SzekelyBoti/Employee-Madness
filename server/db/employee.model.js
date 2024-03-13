// https://mongoosejs.com/
const mongoose = require("mongoose");
const EquipmentSchema = require("./equipment.model");

const { Schema } = mongoose;

const EmployeeSchema = new Schema({
  name: String,
  level: String,
  position: String,
  equipment: [
    {
      equipmentId: { type: Schema.Types.ObjectId, ref: "Equipment" },
      name: String,
    },
  ],

  present: {
    type: Boolean,
    default: false,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Employee", EmployeeSchema);
