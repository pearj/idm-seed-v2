/* eslint-disable @typescript-eslint/no-unused-vars */

// Common code that works for both IDM and AM
export function findUser(userId: string) {
  // openidm CRUDPAQ methods are available
  const user = openidm.read("managed/user/" + userId);
  return user;
}

export function queryUsers() {
  return openidm.query("managed/user", { _queryFilter: "true" });
}

// Verification of context isolation:
// 1. IDM-specific methods/globals must NOT be available
// @ts-expect-error - encrypt is IDM-only, not available in common
openidm.encrypt("secret", "AES", "alias");

// @ts-expect-error - identityServer is IDM-only, not available in common
identityServer.getProperty("test");

// 2. AM-specific globals must NOT be available
// @ts-expect-error - httpClient is AM-only, not available in common
httpClient.send("https://example.com");

// @ts-expect-error - action is AM Scripted Decision only
action.goTo("true");
