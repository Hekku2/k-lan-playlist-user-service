var config = require('config');
var Sequelize = require('sequelize');
var sequelize = new Sequelize(config.get('Database.database'), config.get('Database.user'), config.get('Database.password'), {
    host: config.get('Database.host'),
    dialect: 'mysql',
    logging: false //Until proper logging is implemented.
});

var User = sequelize.define('user', {
    username: {
        type: Sequelize.STRING
    },
    role: {
        type: Sequelize.INTEGER
    }
}, {
    timestamps: false
});

exports.users = function(){
    return User.findAll();
};

exports.user = function(id){
    return User.findOne({where: {id:id}});
};

exports.update = function(user){
    return User.update(user, {where: {id:user.id}});
};