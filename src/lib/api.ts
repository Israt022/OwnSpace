/**
 * Unified API client helpers for OwnSpace.
 *
 * Client components can fetch relative routes (e.g. /api/users) directly,
 * while server components can use the base application URL.
 */

function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    return "";
  }
  return (
    process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
    "http://localhost:3000"
  );
}

export const getUsers = async () => {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/users`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch users: ${res.statusText}`);
  }

  return res.json();
};