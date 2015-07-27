var db = require('./');

exports.createTable = function() {
	db(function(client, done) {
		client.query('CREATE TABLE STUDY_SESSIONS(' +
			'ID SERIAL PRIMARY KEY NOT NULL,' +
			'USER_ID UUID NOT NULL,' +
			'STARTED TIMESTAMP NOT NULL,' +
			'ENDED TIMESTAMP NOT NULL' +
			');', function(err, result) {

				if (err) {
					console.error('Error creating study session table', err);
				} else {
					console.log('Successfully created study session table');
				}

				done();
			}
		)
	});
}

exports.addStudySession = function() {

}
