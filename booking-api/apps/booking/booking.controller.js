const Booking = require("./booking.model.js");

exports.createSlot = async (req, res) => {
  console.log(req.user._id);
  const bookingData = {
    user: req.user._id,
    bookingDate: req.body.bookingDate,
    bookingType: req.body.bookingType,
  };

  if (req.body.bookingSlot) bookingData.bookingSlot = req.body.bookingSlot;
  if (req.body.bookingTime) bookingData.bookingTime = req.body.bookingTime;

  const newBooking = new Booking(bookingData);

  newBooking
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(400).send({
        message:
          err.message || "Some error occurred while creating the Booking.",
      });
    });
};

exports.getAllBookedSlots = async (req, res) => {
  Booking.find({
    user: req.user._id,
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Data",
      });
    });
};

exports.getBookingById = async (req, res) => {
  Booking.findById(req.params.bookingId)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Data",
      });
    });
};

exports.deleteBookedSlotById = async (req, res) => {
  Booking.findById(req.params.bookingId)
    .then((booking) => {
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }

      const currentTime = new Date();
      const timeDiff = booking.bookingDate.getTime() - currentTime.getTime();
      const hoursRemaining = timeDiff / (1000 * 60 * 60);

      if (hoursRemaining <= 24) {
        return res.status(403).json({
          message: "Cannot delete booking with less than a day remaining",
        });
      }

      Booking.findByIdAndDelete(bookingId)
        .then(() => {
          res.json({ message: "Booking deleted successfully" });
        })
        .catch((error) => {
          res.status(500).json({ message: "An unexpected error occurred" });
        });
    })
    .catch((error) => {
      res.status(500).json({ message: "An unexpected error occurred" });
    });
};
