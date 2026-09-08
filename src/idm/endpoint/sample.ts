/* eslint-disable @typescript-eslint/no-unused-vars */

// Code that only works for IDM custom endpoints
export function handleCustomEndpoint() {
  const method = request.method;
  const path = request.resourcePath;

  if (method === "read") {
    // openidm is available
    const user = openidm.read("managed/user/" + request.additionalParameters.id);
    return {
      status: "success",
      user,
      context: context.current,
    };
  }

  if (method === "create") {
    // IDM common method encrypt is available
    const encrypted = openidm.encrypt("sensitive", "AES", "alias");
    return {
      status: "created",
      id: request.newResourceId,
    };
  }

  // IDM identityServer is available
  logger.info(`Install loc: ${identityServer.getInstallLocation()}`);

  return { status: "unsupported" };
}

// Verification of context isolation:
// @ts-expect-error - httpClient is AM-only
httpClient.send("https://example.com");

// @ts-expect-error - action is AM Scripted Decision only
action.goTo("true");
