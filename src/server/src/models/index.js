import Sequelize from 'sequelize';
import configs from '../config/config';

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

const db = {};
db['Book'] = require('./book')(sequelize, Sequelize);
db['Author'] = require('./author')(sequelize, Sequelize);
db['Enrolment'] = require('./enrolment')(sequelize, Sequelize);

Object.keys(db).forEach(modelName =>
	db[modelName].associate && db[modelName].associate(db));

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;