const Sequelize = require('sequelize');
const sequelize = require('../database/database');
const bcrypt = require('bcrypt');


const User = sequelize.define('users', {
    firstname: {
        type: Sequelize.STRING
    },
    lastname: { 
        type: Sequelize.STRING
    },
    number: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    }
});

module.exports = User;

module.exports.createUser = (newUser, callback) => {
    bcrypt.hash(newUser.password, 10, (err, hash) => {
        newUser.password = hash;
        newUser.save(callback);
    });
};

module.exports.getUserByEmail = (email, callback) => {
    let query = {email: email};
    console.log(query);
    User.findOne({where: query}, callback);
}

module.exports.comparePassword = (enteredPassword, hash, callback) => {
	bcrypt.compare(enteredPassword, hash, (err, isMatch) => {
    	if(err) throw err;
        console.log(enteredPassword, hash)
        callback(null, isMatch);
	});
}

module.exports.getUserById = (id, callback) => User.findById(id, callback);
