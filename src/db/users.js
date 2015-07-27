var db = require('./');

exports.createTable = function() {
	db(function(client, done) {
		client.query('CREATE TABLE USERS(' +
			'ID UUID PRIMARY KEY NOT NULL,' +
			'NAME CHAR(100) NOT NULL,' +
			'EMAIL CHAR(255) NOT NULL,' +
			'AVATAR CHAR(255),' +
			'CREATED TIMESTAMP' +
			');', function(err, result) {

				if (err) {
					console.error('Error creating user table', err);
				} else {
					console.log('Successfully created user table');
				}

				done();
			}
		)
	});
}
