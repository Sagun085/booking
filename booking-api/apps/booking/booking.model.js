const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true
    },
    startTime: {
      type: Date,
      required: true
    },
    endTime: {
      type: Date,
      required: true
    },
    hash: String,
  },
  {
    timestamps: true,
    useFindAndModify: false,
    useCreateIndex: true
  }
);

module.exports = mongoose.model("user", userSchema);
