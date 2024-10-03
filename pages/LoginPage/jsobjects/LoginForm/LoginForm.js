export default {
	async signIn() {
		await UserSignIn.generateAccessToken();
		
		await SignedApi.run();
		
		console.log(SignedApi.data);
	}
}