export default {
	async signIn(params) {
		await UserSignIn.generateAccessToken(params);
		
		await SignedApi.run();
		
		console.log(SignedApi.data);
	}
}