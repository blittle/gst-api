let { getUserById, deleteUser } = require('../db/users');
let { deleteUserSessions } = require('../db/sessions');
let { deleteContentAggregations } = require('../db/content-aggregate');
let { deleteDayAggregations } = require('../db/day-aggregate');
let { deleteUserStudyContent } = require('../db/study-content');

let { deleteUserStudySessions } = require('../db/study-session');

let JSON = require('json3');

exports.get = {
	method: 'GET',
	path: '/api/authenticated-user',
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

exports.remove = {
	method: 'DELETE',
	path: '/api/authenticated-user',
	config: {
		auth: 'jwt'
	},
	handler: function(request, reply) {
		let user_id = request.auth.credentials.id;
		Promise.all([
			deleteContentAggregations(user_id),
			deleteDayAggregations(user_id),
			deleteUserStudyContent(user_id)
		])
		.then(() => {
			Promise.all([
				deleteUser(user_id),
				deleteUserStudySessions(user_id),
				deleteUserSessions(user_id)
			])
			.then((rows) => {
				reply({
					success: true
				})
			})
			.catch((error) => {
				console.error(error);
			})
		})
		.catch((error) => {
			console.error(error);
			reply({
				success: false
			})
		})
	}
}

exports.logout = {
	method: 'POST',
	path: '/api/authenticated-user/logout',
	config: {
		auth: 'jwt'
	},
	handler: function(request, reply) {
		console.log(JSON.stringify(request.auth));

		let user_id = request.auth.credentials.id;
		deleteUserSessions(user_id)
			.then(() => {
				reply({
					success: true
				})
			})
			.catch((error) => {
				console.error(error);
				reply({
					success: false
				})
			})
	}
}
