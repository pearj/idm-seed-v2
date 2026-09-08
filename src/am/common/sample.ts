/* eslint-disable @typescript-eslint/no-unused-vars */

// Common code that only works for AM
export function checkRealm() {
  logger.info(`Authenticating to realm: ${realm}`);
  return realm;
}

export function fetchExternalData(url: string) {
  // AM Common httpClient
  const response = httpClient.send(url).get();
  if (response.status === 200) {
    return response.json();
  }
  return null;
}

export function generateCryptoUuid() {
  // AM Common utils
  return utils.crypto.randomUUID();
}

// openidm is also available in AM
export function readFromIdm(path: string) {
  return openidm.read(path);
}

// Verification of context isolation:
// 1. IDM-specific globals must NOT be available
// @ts-expect-error - identityServer is IDM-only
identityServer.getProperty("test");

// @ts-expect-error - encrypt is IDM-only
openidm.encrypt("secret", "AES", "alias");

// 2. AM Scripted Decision bindings must NOT be available
// @ts-expect-error - action is only in scripted decision scripts
action.goTo("true");

// @ts-expect-error - nodeState is only in scripted decision scripts
nodeState.get("username");
