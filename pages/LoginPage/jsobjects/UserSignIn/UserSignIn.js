export default {
  // Generate a new access token by calling the authorization API
  async generateAccessToken() {
    await UserAuthApi.run();
    const generatedToken = UserAuthApi.data;
    if (generatedToken)
      this.storeToken(
        generatedToken.accessToken,
        generatedToken.refreshToken,
      );
  },

  // Store the access token, refresh token, and expiry in the Appsmith store
  storeToken(accessToken, refreshToken) {
    storeValue("authAccessToken", accessToken);
    if (refreshToken) {
      storeValue("authRefreshToken", refreshToken);
    }
    storeValue("authAccessTokenExp", this.getTokenExpiry(accessToken));
  },

  // Extract the expiry timestamp from the access token payload
  getTokenExpiry(token) {
    try {
			return jsonwebtoken.decode(token).exp * 1000;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  },

  // Verify if the access token has expired
  verifyAccessTokenExpired() {
    console.log(
      "time left",
      (new Date(appsmith.store.authAccessTokenExp).getTime() -
        new Date().getTime()) /
        (1000 * 60),
      "mins",
    );
    return (
      new Date().getTime() >
      new Date(appsmith.store.authAccessTokenExp).getTime()
    );
  },

  // Refresh the access token when expired by calling the API
  async refreshAccessToken() {
    // call to
    await RefreshTokenApi.run();
    const refreshToken = RefreshTokenApi.data;
    if (refreshToken) {
      // update the Appsmith store with the new access and refresh tokens
      console.log("Token: " + refreshToken.accessToken);
      this.storeToken(refreshToken.accessToken, refreshToken.refreshToken);
    } else {
      console.error("Failed to refresh access token");
    }
  },

  // Get the access token, refresh it if needed, and return from the Appsmith store
  async getAccessToken() {
    // verify if the access token is present in the Appsmith store
    if (appsmith.store.authAccessToken) {
      // verify if the token has expired
      if (this.verifyAccessTokenExpired()) {
        //refresh the access token
        await this.refreshAccessToken();
      }
    } else {
      //generate initial access token with authorization
      await this.generateAccessToken();
    }
    // return the access token from Appsmith store
    return appsmith.store.authAccessToken;
  },
};