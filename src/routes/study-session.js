exports.post = {
	method: 'GET',
	path: '/study-session',
	config: {
		auth: 'jwt'
	},
	handler: function(request, reply) {
		reply({
			success: true
		})
		.header("Authorization", request.headers.authorization);
	}
}
