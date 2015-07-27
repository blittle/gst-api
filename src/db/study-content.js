var db = require('./');

exports.createTable = function() {
	db(function(client, done) {
		client.query('CREATE TABLE STUDY_CONTENT(' +
			'ID SERIAL PRIMARY KEY NOT NULL,' +
			'SESSION_ID INT NOT NULL,' +
			'CONTENT_TYPE CHAR(255) NOT NULL,' +
			'CONTENT_L1 CHAR(255) NOT NULL,' +
			'CONTENT_L2 CHAR(255),' +
			'CONTENT_L3 CHAR(255),' +
			'CONTENT_L4 CHAR(255),' +
			'TOTAL_SECONDS INT NOT NULL' +
			');', function(err, result) {

				if (err) {
					console.error('Error creating study content table', err);
				} else {
					console.log('Successfully created study content table');
				}

				done();
			}
		)
	});
}

exports.addStudySession = function() {

}
