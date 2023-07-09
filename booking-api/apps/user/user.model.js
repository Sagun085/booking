const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: { type: String, unique: true, required: true },
    hash: String,
  },
  {
    timestamps: true,
    useFindAndModify: false,
    useCreateIndex: true
  }
);

module.exports = mongoose.model("User", userSchema);
