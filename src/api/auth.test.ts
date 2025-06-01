import { describe, expect, test } from "vitest";
import { getAPIKey } from "./auth";
import { IncomingHttpHeaders } from "http";

describe("getAPIKey", () => {
  test("returns null if authorization header is missing", () => {
    const headers: IncomingHttpHeaders = {};
    expect(getAPIKey(headers)).toBeNull();
  });

  test("returns null if authorization header is malformed", () => {
    const headers: IncomingHttpHeaders = {
      authorization: "Bearer somekey",
    };
    expect(getAPIKey(headers)).toBeNull();
  });

  test("returns null if authorization format is invalid (missing key)", () => {
    const headers: IncomingHttpHeaders = {
      authorization: "ApiKey",
    };
    expect(getAPIKey(headers)).toBeNull();
  });

  test("returns API key when authorization is valid", () => {
    const headers: IncomingHttpHeaders = {
      authorization: "ApiKey 123456",
    };
    expect(getAPIKey(headers)).toBe("123456");
  });

  test("is case-sensitive: returns null for lowercase 'apikey'", () => {
    const headers: IncomingHttpHeaders = {
      authorization: "apikey 123456",
    };
    expect(getAPIKey(headers)).toBeNull();
  });

  test("returns correct key even with extra spaces", () => {
    const headers: IncomingHttpHeaders = {
      authorization: "ApiKey     secret-key",
    };
    expect(getAPIKey(headers)).toBe("secret-key");
  });
});
