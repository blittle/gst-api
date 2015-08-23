let { getDayAggregation } = require('../db/day-aggregate.js');
let { getTopContent, getRecentContent } = require('../db/content-aggregate.js');

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

exports.getContent = {
	method: 'GET',
	path: '/study-content',
	config: {
		auth: 'jwt'
	},
	handler: function(request, reply) {
    const user_id = request.auth.credentials.id;
		Promise.all([getTopContent(user_id, 5), getRecentContent(user_id, 5)])
			.then((result) => {
				reply({
					success: true,
					data: {
						top: result[0].rows,
						recent: result[1].rows
					}
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
