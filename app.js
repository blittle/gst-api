var Hapi = require('hapi');
var Bell = require('bell');
var test = require('./test');

var server = new Hapi.Server();

var auth = require('./src/auth');

// require('./src/db/users.js').createTable();
// require('./src/db/sessions.js').createTable();
// require('./src/db/study-session.js').createTable();
// require('./src/db/study-content.js').createTable();
// require('./src/db/content-aggregate.js').createTable();
// require('./src/db/day-aggregate.js').createTable();

server.connection({
	host: '0.0.0.0',
	port: 4567,
	routes: {
		cors: true
	}
});

server.register(Bell, function(err) {

	server.auth.strategy('google', 'bell', {
		provider: 'google',
		password: 'password',
		isSecure: false,
		clientId: auth.GOOGLE_CLIENT_ID,
		clientSecret: auth.SECRET,
		location: 'https://www.gospelstudy.tools' //server.info.uri
	});

	server.route({
		method: '*',
		path: '/api/authenticate/google',
		config: {
			auth: {
				strategy: 'google',
				mode: 'try'
			},
			handler: auth.handleAuth
		}
	});
});


server.register(require('hapi-auth-jwt2'), function(err) {

	if (err) {
		console.log(err);
	}

	server.auth.strategy('jwt', 'jwt', true, {
		key: auth.SECRET,
		validateFunc: auth.validate,
		verifyOptions: {
			algorithms: ['HS256']
		}
	});

	server.route([{
		method: "GET",
		path: "/api",
		config: {
			auth: false
		},
		handler: function(request, reply) {
			reply({
				text: 'Token not required'
			});
		}
	},
	require('./src/routes/users').get,
	require('./src/routes/users').logout,
	require('./src/routes/users').remove,
	require('./src/routes/study-session').post,
	require('./src/routes/study-content').dayAggregation,
	require('./src/routes/study-content').getContent,
	require('./src/routes/study-content').getBadges,
	])
});

server.start(function(err) {
	console.log('Server started at:', server.info.uri);
	//	test();
});
