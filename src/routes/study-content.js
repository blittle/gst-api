let { getDayAggregation, getTotalStudyTime } = require('../db/day-aggregate.js');
let { getTopContent, getRecentContent, getTotalTimeOfType, getTotalTimeOfL1, getTotalTimeOfL2 } = require('../db/content-aggregate.js');

const HOUR = 60 * 60;

exports.dayAggregation = {
	method: 'GET',
	path: '/api/study-content/day-aggregation/{count}',
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
	path: '/api/study-content',
	config: {
		auth: 'jwt'
	},
	handler: function(request, reply) {
    const user_id = request.auth.credentials.id;
		Promise.all([getTopContent(user_id, 200), getRecentContent(user_id, 5)])
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

exports.getBadges = {
	method: 'GET',
	path: '/api/study-content/badges',
	config: {
		auth: 'jwt'
	},
	handler: function(request, reply) {
    const user_id = request.auth.credentials.id;

		Promise.all([
			getTotalStudyTime(user_id),
			getTotalTimeOfType(user_id, 'GC'),
			getTotalTimeOfL1(user_id, 'bofm'),
			getTotalTimeOfL1(user_id, 'nt'),
			getTotalTimeOfL1(user_id, 'ot'),
			getTotalTimeOfL2(user_id, 'ot', 'isa')
		]).then((result) => {

			let totalTime = result[0].rows[0].sum * 1;

			reply({
				success: true,
				data: {
					badges: {
						hour1: ( totalTime >= HOUR),
						hour10: ( totalTime >= ( HOUR * 10)),
						hour100: ( totalTime >= ( HOUR * 100)),
						hour1000: ( totalTime >= ( HOUR * 1000)),

						GC100: (( result[1].rows[0].sum * 1) >= (HOUR * 100)),
						BM100: (( result[2].rows[0].sum * 1) >= (HOUR * 100)),
						NT100: (( result[3].rows[0].sum * 1) >= (HOUR * 100)),
						OT100: (( result[4].rows[0].sum * 1) >= (HOUR * 100)),

						ISAIAH50: (( result[5].rows[0].sum * 1) >= (HOUR * 50))
					}
				}
			});

		}).catch((err) => {
			console.error(err);
			reply({
				success: false
			})
		})


	}
}
