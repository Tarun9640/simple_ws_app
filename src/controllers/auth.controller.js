import { asyncHandler } from "../utils/asyncHandler.js";
import { signupService, loginService, getMeService} from "../services/auth.service.js";

export const signup = asyncHandler(async (req, res) => {
  const result = await signupService(req.body);

  res.status(201).json({
    success: true,
    data: result,
  });
});

export const login = asyncHandler(async (req, res) => {
  const result = await loginService(req.body);

  res.json({
    success: true,
    data: result,
  });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await getMeService(req.user.userId);

  res.json({
    success: true,
    data: user,
  });
});