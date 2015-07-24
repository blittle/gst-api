var JWT   = require('jsonwebtoken');  // used to sign our content
var aguid = require('aguid');

var SECRET = "0RS2GuesLZdAiAUevfwfBZ34";
var GOOGLE_CLIENT_ID = "750179824923-go79gjlsik6vupafrp65q4s3cuu2dcpk.apps.googleusercontent.com";

var people = {
	1: {
		id: 1,
		name: 'Jen Jones'
	}
};

module.exports = {
	handleAuth: function(request, reply) {
		if (!request.auth.isAuthenticated) {
			return reply('Authentication failed due to: ' + request.auth.error.message);
		}

		var payload = {
			id: aguid(),
			user: aguid(request.auth.credentials.profile.emails[0].value)
		}

		var token = JWT.sign(payload, SECRET);

		people[payload.id] = {
			id: payload.id,
			user: payload.user,
			name: request.auth.credentials.profile.displayName
		}

		reply('<pre>' + token + '</pre>');
	},

	validate: function(decoded, request, callback) {
		if (!people[decoded.id]) {
			return callback(null, false);
		} else {
			return callback(null, true);
		}
	},

	SECRET: SECRET,
	GOOGLE_CLIENT_ID: GOOGLE_CLIENT_ID
};
