export default {
	async initCushions() {
		console.log('Initializing cushions...');

		const redirectTo = this.getQueryParam('redirectTo', 'Dashboard');
		const loginAs = this.getQueryParam('loginAs', appsmith.user.email);

		try {
			if (this.isAuthenticationRequired(loginAs)) {
				await this.loginAsUser(loginAs);
			}

			if (appsmith.mode === 'VIEW' || appsmith.mode === 'PUBLISHED') {
				navigateTo(redirectTo);
			} else {
				console.log('Skipping redirect to...', redirectTo, 'because mode is', appsmith.mode, 'and not "VIEW" or "PUBLISHED"');
			}
		} catch (error) {
			console.error('Error during init', error);
		}
	},

	isAuthenticationRequired(loginAs) {
		return true;
	},

	async loginAsUser(email, password) {

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
