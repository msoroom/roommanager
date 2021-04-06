const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  //props
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    props: {
      type: Object,
      default: {},
    },
    buckedlist: {
      type: Object,
      default: {},
    },
    pics: [
      {
        pic: {
          type: Buffer,
          required: true,
        },
      },
    ],
  },

  //kein plan
  {
    timestamps: true,
  }
);

const roomModel = mongoose.model("room", roomSchema);

module.exports = roomModel;