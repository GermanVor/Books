import {Router} from 'express';

const router = Router();
/**
 * Author API routes
 */

const Sequelize = require("sequelize");
const sequelize = new Sequelize("usersdb", "postgres", "15zanuve", {
  host: 'localhost',
  dialect: "postgres"
});

const User = sequelize.define("user", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  age: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
});
//Еси в бд есть подобная таблица, но она не соответствует определению модели , удаляем 
sequelize.sync({force: true}).then(result=>{
  console.log(result);
})
.catch(err=> console.log(err));


router.get('/',  (req, res) => {
  User.findAll({raw:true}).then(users=>{
    res.status(200).send(users)
  }).catch(err=>console.log(err));
});
  
router.post('/', (req, res) => {
  console.log( req.body )
  User.create({
    name: req.body.name || 'Biben2',
    age: req.body.age || 100
  }).then(res=>{
    console.log('Успешно добавлен');
  }).catch(err=>console.log(err))
});

export default router;