import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { generateToken } from "../utils/token.js";
import { AppError } from "../utils/AppError.js";

export const signupService = async (data) => {
  const { first_name, last_name, email, password } = data;

  if (!first_name || !email || !password) {
    throw new AppError("Missing required fields", 400);
  }

  const existingUser = await User.findOne({ where: { email } });

  if (existingUser) {
    throw new AppError("User already exists", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    first_name,
    last_name,
    email,
    password: hashedPassword,
  });

  return {
    id: user.id,
    email: user.email,
  };
};

export const loginService = async ({ email, password }) => {
  if (!email || !password) {
    throw new AppError("Email and password required", 400);
  }

  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new AppError("Invalid credentials", 401);
  }

  const token = generateToken({ userId: user.id, email: user.email });

  return { token };
};

export const getMeService = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: ["id", "first_name", "last_name", "email"],
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};