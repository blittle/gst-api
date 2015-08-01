let { getUserById } = require('../db/users');

exports.get = {
	method: 'GET',
	path: '/authenticated-user',
	config: {
		auth: 'jwt'
	},
	handler: function(request, reply) {
		getUserById(request.auth.credentials.id)
			.then((rows) => {
				reply(rows[0])
				.header("Authorization", request.headers.authorization);
			})
			.catch((error) => {
				console.error(error);
			})
	}
}
