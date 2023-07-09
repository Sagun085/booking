const { authenticate } = require("../../utils");

module.exports = (app) => {
  const user = require("./booking.controller.js");

  // Login new User
  app.get("/booking", authenticate, user.getAllBookedSlots);
  app.post("/booking", authenticate, user.createSlot);
  app.get("/booking/:bookingId", authenticate, user.getBookingById);
  app.delete("/booking/:bookingId", authenticate, user.deleteBookedSlotById);
};
