import * as yup from "yup";

// Error Messages for User Schema
export const fullnameNotLongEnough = "Fullname should be atleast 3 characters";
export const fullnameTooLong = " Fullname should be less than 100 characters";
export const emailNotLongEnough = "Email must be at least 3 characters";
export const passwordNotLongEnough = "Password must be at least 3 characters";
export const invalidEmail = "Email is not a valid email";
export const passwordNoSplCharNoNumber =
  "Atleast a special character or a number is required in password";
export const passwordNoCharacter =
  "Atleast one Alphabet is required in password";
export const passwordRequired = "Password is Required";
export const passwordNoMatch = "Passwords do not Match";

// Fullname
export const registerFullnameValidation = yup
  .string()
  .min(3, fullnameNotLongEnough)
  .max(100, fullnameTooLong)
  .required();

export const fullnameSchema = yup.object().shape({
  fullname: registerFullnameValidation
});

// Email Register

export const EmailValidation = yup
  .string()
  .min(3, emailNotLongEnough)
  .max(255)
  .email(invalidEmail)
  .required();

export const emailSchema = yup.object().shape({
  email: EmailValidation
});

// Password Register

// Special Character and a Number
const passwordSplCharNumberRegex = /^(?=.*[$@$!%*?&\d])[A-Za-z\d$@$!%*?&]/;
const passwordStringRegex = /^(?=.*[A-Za-z])[A-Za-z\d$@$!%*?&]/;

export const PasswordValidation = yup
  .string()
  .matches(passwordStringRegex, passwordNoCharacter)
  .matches(passwordSplCharNumberRegex, passwordNoSplCharNoNumber)
  .min(3, passwordNotLongEnough)
  .max(255)
  .required(passwordRequired);

export const passwordSchema = yup.object().shape({
  password: PasswordValidation
});

// Complete OneSchema - Register

export const registerSchema = yup.object().shape({
  fullname: registerFullnameValidation,
  email: EmailValidation,
  password: PasswordValidation
});

// Login Validation
const invalidLogin = "Valid Email and Password Required";

export const loginEmailValidation = yup
  .string()
  .min(3, invalidLogin)
  .max(255, invalidLogin)
  .email(invalidEmail)
  .required();

export const loginPasswordValidation = yup
  .string()
  .min(2, invalidLogin)
  .max(255, invalidLogin)
  .required();

export const loginSchema = yup.object().shape({
  email: loginEmailValidation,
  password: loginPasswordValidation
});

// Change Password Validation

export const changePasswordSchema = yup.object({
  newPassword: PasswordValidation
});
