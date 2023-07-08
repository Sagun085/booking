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
  Booking.findByIdAndRemove(req.params.bookingId)
    .then(async (data) => {
      if (!data) {
        return res.status(404).send({
          message: "Data not found with id " + req.params.bookingId,
        });
      }
      res.send({ message: "Data deleted successfully!" });
    })
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "Data not found with id " + req.params.bookingId,
        });
      }
      return res.status(500).send({
        message: "Could not delete Data with id " + req.params.bookingId,
      });
    });
};
