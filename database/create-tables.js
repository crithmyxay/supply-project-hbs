const User = require('../models/users');

User.sync({ force: true })
    .then(() => console.log('Tables created!'));