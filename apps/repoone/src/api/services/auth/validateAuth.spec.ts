import { authenticateToken } from "./validateAuth";

// Mocking the API_TOKENS object for testing
const API_TOKENS = {
  user1: { apiKey: "12345", expiry: null },
  user2: { apiKey: "67890", expiry: Date.now() + 1000 * 60 * 60 * 24 * 365 }, // expires in the future
  user3: { apiKey: "45678", expiry: Date.now() - 1000 * 60 * 60 * 24 * 365 }, // expires in the future
};
describe("authenticateToken", () => {
  it("returns true for a valid and unexpiring token", () => {
    const validToken = btoa("user1:12345"); // Encode the username and apiKey
    expect(authenticateToken(validToken, API_TOKENS)).toBe(true);
  });

  it("returns true for a valid and unexpired token", () => {
    const validToken = btoa("user2:67890"); // Encode the username and apiKey
    expect(authenticateToken(validToken, API_TOKENS)).toBe(true);
  });

  it("returns false for an invalid token", () => {
    const invalidToken = "invalidToken";
    expect(authenticateToken(invalidToken, API_TOKENS)).toBe(false);
  });

  it("returns false for an expired token", () => {
    const expiredToken = btoa("user3:45678");
    expect(authenticateToken(expiredToken, API_TOKENS)).toBe(false);
  });
  it("returns false for a valid token that is not in the API_TOKENS list", () => {
    const unknownToken = btoa("unknownUser:unknownKey");
    expect(authenticateToken(unknownToken, API_TOKENS)).toBe(false);
  });
});
