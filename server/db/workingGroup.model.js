const mongoose = require("mongoose");
const { Schema } = mongoose;

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

module.exports = mongoose.model("WorkingGroup", WorkingGroupSchema);

