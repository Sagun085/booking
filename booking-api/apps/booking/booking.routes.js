module.exports = (app) => {
    const user = require('./booking.controller.js');

    // Login new User
    app.get('/booking', user.getAllBookedSlots);
    app.post('/booking', user.createSlot);
    app.get('/booking/:bookingId', user.getBookingById);
    app.delete('/booking/:bookingId', user.deleteBookedSlotById);
}