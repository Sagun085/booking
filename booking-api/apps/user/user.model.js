const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    fullName: String,
    email: { type: String, unique: true, required: true, dropDups: true },
    hash: String,
  },
  {
    timestamps: true,
    useFindAndModify: false,
    useCreateIndex: true
  }
);

module.exports = mongoose.model("user", userSchema);
