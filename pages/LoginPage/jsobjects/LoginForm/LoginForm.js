export default {
	async login(params) {
		console.log('LoginForm', params);
		console.log('current user', appsmith.user);
		await LoginAuth.generateAccessToken(params);

		navigateTo('Dashboard');
	}
}