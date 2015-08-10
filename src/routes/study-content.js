let { getLastYear } = require('../db/day-aggregate.js');

exports.getLastYear = {
	method: 'GET',
	path: '/study-content/last-year',
	config: {
		auth: 'jwt'
	},
	handler: function(request, reply) {
    const user_id = request.auth.credentials.id;
		getLastYear(user_id)
			.then((result) => {
				reply({
					success: true,
					data: result.rows
				})
			})
			.catch((err) => {
				console.error(err);
				reply({
					success: false
				});
			})
	}
}
