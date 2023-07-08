const mongoose = require("mongoose");

const Booking = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    bookingDate: {
      type: Date,
      required: true,
    },
    bookingType: {
      type: String,
      enum: ["Full Day", "Half Day", "Custom"],
      required: true,
    },
    bookingSlot: {
      type: String,
      enum: ["First Half", "Second Half"],
      required: function () {
        return this.bookingType === "Half Day";
      },
    },
    bookingTime: {
      type: String,
      required: function () {
        return this.bookingType === "Custom";
      },
    },
  },
  {
    timestamps: true,
    useFindAndModify: false,
    useCreateIndex: true,
  }
);

Booking.pre("save", function (next) {
  const query = {
    bookingDate: this.bookingDate,
    _id: { $ne: this._id },
  };

  if (this.bookingType === "Full Day") {
    query.bookingType = "Full Day";
  } else if (this.bookingType === "Half Day") {
    query.bookingSlot = this.bookingSlot;
  } else if (this.bookingType === "Custom") {
    query.bookingTime = this.bookingTime;
  }

  Booking.find(query)
    .then((existingBookings) => {
      const overlap = existingBookings.some((existingBooking) => {
        if (this.bookingType === "Full Day") {
          return existingBooking.bookingType === "Full Day";
        } else if (
          this.bookingType === "Half Day" &&
          existingBooking.bookingType === "Half Day"
        ) {
          return existingBooking.bookingSlot === this.bookingSlot;
        } else if (
          this.bookingType === "Custom" &&
          existingBooking.bookingType === "Custom"
        ) {
          return existingBooking.bookingTime === this.bookingTime;
        } else if (
          this.bookingType === "Half Day" &&
          existingBooking.bookingType === "Custom"
        ) {
          return (
            existingBooking.bookingTime === this.bookingTime &&
            (existingBooking.bookingSlot === "First Half" ||
              existingBooking.bookingSlot === "Second Half")
          );
        } else if (
          this.bookingType === "Custom" &&
          existingBooking.bookingType === "Half Day"
        ) {
          return (
            existingBooking.bookingSlot === this.bookingSlot &&
            (this.bookingTime === "First Half" ||
              this.bookingTime === "Second Half")
          );
        }

        return false;
      });

      if (overlap) {
        throw new Error("Slot is already booked for the given date and time");
      }
      next();
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = mongoose.model("Booking", Booking);
