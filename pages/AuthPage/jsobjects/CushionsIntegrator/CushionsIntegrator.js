export default {
	async initCushions() {
		console.log('Initializing cushions...');

		const redirectTo = this.getQueryParam('redirectTo', 'Dashboard');
		const loginAs = this.getQueryParam('loginAs', appsmith.user.email);

		// only allow redirects for some modes, if redirects happen during "EDIT" it
		// can be impossible to edit the page!
		const isViewMode = appsmith.mode === 'VIEW' || appsmith.mode === 'PUBLISHED';

		if (isViewMode && appsmith.user.isAnonymous) {
			navigateTo('LoginPage');
			return;
		}

		try {
			if (this.isAuthenticationRequired(loginAs)) {
				console.log('Authenticating as', loginAs);
				await this.loginAsUser(loginAs).catch((error) => {
					console.error('loginAsUser', error);
					return Promise.resolve(true);
				});
			}

			if (isViewMode) {
				navigateTo(redirectTo);
			} else {
				console.log('Skipping redirect to...', redirectTo, 'because mode is', appsmith.mode, 'and not "VIEW" or "PUBLISHED"');
			}
		} catch (error) {
			console.error('Error during init', error);
		}
	},

	isAuthenticationRequired(loginAs) {
		return AuthApi.verifyAccessTokenExpired();
	},

	async loginAsUser(email, password = 'Password1!') {
		await AuthApi.generateAccessToken({ email, password });
		
		const payload = index_min_js.decodeJwt(appsmith.store.authAccessToken);
		
		if (payload && payload.exp > 0) {
			storeValue('authAccessTokenExp', payload.exp);
		}
	},

	getQueryParam(param, defaultValue) {
		const isSet = param in appsmith.URL.queryParams;
		const value = appsmith.URL.queryParams[param];

		if (isSet) {
			return value;
		}

		return defaultValue;
	}
}
