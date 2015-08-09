let { addStudySession } = require('../db/study-session.js');
let { addStudyContent } = require('../db/study-content.js');

exports.get = {
}

exports.post = {
	method: 'POST',
	path: '/study-sessions',
	config: {
		auth: 'jwt'
	},
	handler: function(request, reply) {
		console.log(request.payload);

		addStudySession({
			user_id: request.auth.credentials.id,
			started: new Date(request.payload.startTime),
			ended: new Date(request.payload.endTime)
		}).then((result) => {
			console.log(result.rows[0].id);

			Promise.all(request.payload.resources.map((resource) => {
				return addStudyContent({
					session_id: result.rows[0].id,
					type: resource.type,
					l1: resource.l1,
					l2: resource.l2,
					l3: resource.l3,
					l4: resource.l4,
					time: Math.floor(resource.time / 1000)
				})
			})).then((result) => {
				console.log(result)
				reply({
					success: true
				})
				.header("Authorization", request.headers.authorization);
			}).catch((err) => {
				console.error(err);
				reply({
					success: false
				})
				.header("Authorization", request.headers.authorization);
			});

		}).catch((err) => {
			console.error(err);
			reply({
				success: false
			})
			.header("Authorization", request.headers.authorization);
		});

	}
}
