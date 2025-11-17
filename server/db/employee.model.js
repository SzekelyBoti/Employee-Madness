const mongoose = require("mongoose");
const { Schema } = mongoose;

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

module.exports = mongoose.model("Employee", EmployeeSchema);

