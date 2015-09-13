let JWT   = require('jsonwebtoken');  // used to sign our content
let aguid = require('aguid');
let _ = require('lodash');

let { getUser, createUser } = require('./db/users.js');
let { addSession, getSession } = require('./db/sessions.js');

const SECRET = process.env.GOOGLE_SECRET;
const GOOGLE_CLIENT_ID = "750179824923-go79gjlsik6vupafrp65q4s3cuu2dcpk.apps.googleusercontent.com";

module.exports = {
	handleAuth: function(request, reply) {
		if (!request.auth.isAuthenticated) {
			console.log(request.auth.error.message);
			return reply.redirect('/api/authenticate/google');
			//return reply('Authentication failed due to: ' + request.auth.error.message);
		}

		let email = request.auth.credentials.profile.emails[0].value;
		//console.log(request.auth.credentials.profile);
		let id = aguid(email);

		function createSession() {
			let payload = { id }
			const token = JWT.sign(payload, SECRET);
			addSession({
				token: token,
				user_id: id
			}).then(() => {
				reply(
					`
					<input type="hidden" id='GST_AUTH_TOKEN' value='${token}'/>
					<script>setTimeout(function() {
						window.location = "https://www.gospelstudy.tools";
					}, 100)</script>
					`
				)
					.header("Authorization", token);
			}).catch(console.error);
		}

		getUser(email)
			.then(function(resp) {
				if (!resp.length) {
					let avatar = _.property('auth.credentials.profile.raw.image.url')(request);

					createUser({
						id: id,
						name: request.auth.credentials.profile.displayName.trim(),
						email: email.trim(),
						avatar: avatar ? avatar.trim() : null,
						created: 'now'
					}).then(createSession).catch(console.error);
				} else {
					createSession()
				}
			})
			.catch(console.error);

	},

	validate: function(decoded, request, callback) {

		getSession(decoded.id)
			.then((result) => {
				if (result.length) {
					return callback(null, true);
				} else {
					return callback(null, false);
				}
			})
			.catch((err) => {
				console.error(err);
				callback(null, false);
			});
	},

	SECRET: SECRET,
	GOOGLE_CLIENT_ID: GOOGLE_CLIENT_ID
};
