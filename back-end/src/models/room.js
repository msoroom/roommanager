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
    },
    buckedlist: {
      type: Object,
    },

    pics: [
      {
        pic: {
          type: Buffer,
          required: true,
        },

        order: {
          type: Number,
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
