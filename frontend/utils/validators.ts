import { CreateUserForm, UserRole } from "types/User";

export const validateEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePassword = (pass: string) => {
  const hasNumber = /\d/.test(pass);
  const hasUpper = /[A-Z]/.test(pass);
  const isLongEnough = pass.length >= 8;
  return { hasNumber, hasUpper, isLongEnough };
};

export function validateSignup(role: UserRole ,data: CreateUserForm) {
  const errors: Partial<Record<keyof CreateUserForm, string>> = {};

  if (!data.firstName) errors.firstName = 'First name is required.';
  if (!data.middleName) errors.middleName = 'Middle name is required.';
  if (!data.lastName) errors.lastName = 'Last name is required.';
  if (!data.email) errors.email = 'Email is required.';
  if (!validateEmail(data.email)) errors.email = 'Please enter a valid email address.';
  if (!data.password) errors.password = 'Password is required.';
  if (!data.confirmPassword) errors.confirmPassword = 'Confirm your password.';

  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  const pass = validatePassword(data.password);
  if (!pass.hasNumber || !pass.hasUpper || !pass.isLongEnough) {
    errors.password =
      'Password must be at least 8 characters, 1 uppercase letter, and 1 number.';
  }

  if(role === "TEACHER" && !data.departmentId) {
    errors.departmentId = "Department is required.";
  }

  return errors;
}