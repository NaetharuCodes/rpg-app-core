export function parseJwt(token: string): any | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = parseJwt(token);
  if (!payload || !payload.exp) return true;

  // Check if token expires in the next 5 minutes (buffer for clock skew)
  const expiryTime = payload.exp * 1000; // Convert to milliseconds
  const bufferTime = 5 * 60 * 1000; // 5 minutes

  return Date.now() >= expiryTime - bufferTime;
}
