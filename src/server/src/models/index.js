// import fs from 'fs';
//import path from 'path';
import Sequelize from 'sequelize';
import configs from '../config/config';


// const Sequelize = require("sequelize");
// const path = require("path");
// const configs = require("../config/config");
// const fs = require('fs')
const env = process.env.NODE_ENV.trim() || 'development',
//	basename = path.basename(__filename),
	config = configs[env];

// let sequelize = config.use_env_variable ?
// 	new Sequelize(process.env[config.use_env_variable], config) :
// 	new Sequelize(config.database, config.username, config.password, { dialect: config.dialect});
let sequelize = new Sequelize(config.database, config.username, config.password,
	{ 
		dialect: config.dialect,
		host: config.host
	}
);

try {
  sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

// fs
// 	.readdirSync(__dirname)
// 	.filter(file =>
// 		(file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
// 	.forEach(file => {
		
// 		const model = sequelize['import'](path.join(__dirname, file));
// 		db[model.name] = model;
// 		console.dir( model );
// 	});

const db = {};
db['book'] = require('./book')(sequelize, Sequelize);
db['author'] = require('./author')(sequelize, Sequelize);

Object.keys(db).forEach(modelName =>
	db[modelName].associate && db[modelName].associate(db));

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;