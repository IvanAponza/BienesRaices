import Sequelize from 'sequelize';
import dotenv from 'dotenv'
dotenv.config({path: '.env'})

const db = new Sequelize(process.env.DB_NOMBRE, process.env.DB_USER, process.env.DB_PASS ?? '', {
  host: process.env.DB_HOST,
  port: 3306,
  dialect: 'mysql',
  define: {
    timestamps: true,
  },
  //mantiene o utiliza las conexiones que esten vivas
  pool: {
    max: 5, // max conexiones a mantener
    min: 0, // min conexiones
    acquire: 30000, //30s tiempo antes de marcar error
    idle: 10000, //10s tiempo a transc par finalizar conn
  },
  operatorAliases: false,
});

export default db;