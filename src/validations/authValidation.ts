import userType from "../types/userType";
import * as joi from "joi";

export const registerValidation = (
  payload: userType
): joi.ValidationResult<userType> => {
  const schema = joi.object({
    fullName: joi.string().required().messages({
      "any required": "Full Name harus diisi",
      "string.base": "name harus berupa string",
    }),
    email: joi.string().trim().required().email().messages({
      "any required": "Email harus diisi",
      "string.base": "Email harus berupa string",
      "string.empty": "email harus valid",
    }),
    password: joi.string().min(6).required().messages({
      "any required": "Password harus diisi",
      "string.min": "password minimal 6 karakter",
    }),
  });

  return schema.validate(payload);
};

export const loginValidation = (
  payload: userType
): joi.ValidationResult<userType> => {
  const schema = joi.object({
    email: joi.string().trim().required().email().messages({
      "any required": "Email harus diisi",
      "string.base": "Email harus berupa string",
      "string.empty": "email harus valid",
    }),
    password: joi.string().min(6).required().messages({
      "any required": "Password harus diisi",
      "string.min": "password minimal 6 karakter",
    }),
  });
  return schema.validate(payload);
};
