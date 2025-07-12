export function isValidPassword(password: string) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(
    password,
  );
}
export function isValidName(name: string) {
  return isValidDisplayName(name) && /^[a-z0-9_-]+$/.test(name);
}

export function isValidDisplayName(name: string) {
  return name.length >= 3 && name.length <= 255;
}
