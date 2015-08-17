let { getDayAggregation } = require('../db/day-aggregate.js');
let { getTopContent } = require('../db/content-aggregate.js');

exports.dayAggregation = {
	method: 'GET',
	path: '/study-content/day-aggregation/{count}',
	config: {
		auth: 'jwt'
	},
	handler: function(request, reply) {
    const user_id = request.auth.credentials.id;
		getDayAggregation(user_id, request.params.count)
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
