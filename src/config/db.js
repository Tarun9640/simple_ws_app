import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  schema: "public",
  logging: process.env.NODE_ENV === "development" ? console.log : false,

  pool: {
    max: 20,
    min: 0, 
    acquire: 30000, 
    idle: 10000,
  },
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully....");
  } catch (error) {
    console.error("Database connection failed: ", error.message);
    process.exit(1);
  }
};

export default sequelize;