var Hapi = require('hapi');
var Bell = require('bell');

var server = new Hapi.Server();

var auth = require('./src/auth');

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
		location: 'http://localhost:4567' //server.info.uri
	});

	server.route({
		method: '*',
		path: '/authenticate/google',
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
		path: "/",
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
	require('./src/routes/study-session').post,
	{
		method: 'GET',
		path: '/restricted',
		config: {
			auth: 'jwt'
		},
		handler: function(request, reply) {
			reply({
				text: 'You used a Token!'
			})
			.header("Authorization", request.headers.authorization);
		}
	}]);
});

server.start(function(err) {
	console.log('Server started at:', server.info.uri);
});
