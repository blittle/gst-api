let { getLastYear } = require('../db/day-aggregate.js');
let { getTopContent } = require('../db/content-aggregate.js');

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

exports.getTopContent = {
	method: 'GET',
	path: '/study-content/top',
	config: {
		auth: 'jwt'
	},
	handler: function(request, reply) {
    const user_id = request.auth.credentials.id;
		getTopContent(user_id, 10)
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
