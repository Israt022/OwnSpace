export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateUserId(id: unknown): string {
  if (typeof id !== "string" || !id.trim()) {
    throw new Error("Invalid or missing user ID");
  }
  return id.trim();
}
