/* eslint-disable @typescript-eslint/no-unused-vars */

// Code that only works for scripted decision code
export function handleDecision() {
  const username = nodeState.get("username");

  if (!username) {
    if (callbacks.isEmpty()) {
      callbacksBuilder.nameCallback("Please enter username");
      callbacksBuilder.passwordCallback("Please enter password", false);
    }
    action.goTo("false").withErrorMessage("Username required");
    return;
  }

  // Common AM bindings available as well
  logger.info(`Processing user: ${username} in realm: ${realm}`);

  // openidm is also available
  const user = openidm.read(`managed/user/${username}`);
  if (user) {
    nodeState.putShared("userFound", true);
    action.goTo("true");
  } else {
    action.goTo("false");
  }
}

// Verification of context isolation:
// @ts-expect-error - identityServer is IDM-only
identityServer.getProperty("test");

// @ts-expect-error - request is IDM custom endpoint only
request.resourcePath;
