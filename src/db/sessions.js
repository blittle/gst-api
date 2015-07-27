var db = require('./');

exports.createTable = function() {
	db(function(client, done) {
		client.query('CREATE TABLE SESSIONS(' +
			'ID UUID PRIMARY KEY NOT NULL,' +
			'USER_ID UUID NOT NULL,' +
			'CREATED TIMESTAMP' +
			');', function(err, result) {

				if (err) {
					console.error('Error creating session table', err);
				} else {
					console.log('Successfully created session table');
				}

				done();
			}
		)
	});
}
