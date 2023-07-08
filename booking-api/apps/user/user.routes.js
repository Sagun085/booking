module.exports = (app) => {
    const user = require('./user.controller.js');

    // Login new User
    app.post('/signup', user.createUser);
    app.post('/login', user.login);

    // logout
    app.get('/logout', user.logout);

}