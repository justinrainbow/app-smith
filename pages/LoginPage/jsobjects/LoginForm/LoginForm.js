export default {
	async login(params) {
		console.log('LoginForm', params);
		await LoginAuth.generateAccessToken(params);

		navigateTo('Dashboard');
	}
}