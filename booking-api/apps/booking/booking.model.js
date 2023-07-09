const mongoose = require("mongoose");

const BookingSchema = mongoose.Schema(
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
    bookingFromTime: {
      type: Date,
      required: true,
    },
    bookingToTime: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    useFindAndModify: false,
    useCreateIndex: true,
  }
);

BookingSchema.pre("save", function (next) {
  const query = {
    bookingDate: this.bookingDate,
  };

  Booking.find(query)
    .then((existingBookings) => {
      if (this.bookingType === "Full Day" && existingBookings.length) {
        throw new Error("Full Day booking not possible for the day");
      }
      const overlap = existingBookings.some((existingBooking) => {
        if (existingBooking.bookingType === "Full Day") {
          return true;
        } else if (this.bookingType === "Half Day") {
          return existingBooking.bookingSlot === this.bookingSlot;
        } else if (this.bookingType === "Custom") {
          return existingBooking.bookingTime === this.bookingTime;
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

const Booking = mongoose.model("Booking", BookingSchema);

module.exports = Booking;
