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

exports.addStudySession = function(studySession) {
	let {
		user_id, started, ended
	} = studySession;

	return new Promise((resolve, reject) => {
		db(function(client, done) {
			client.query(
			`
			INSERT INTO study_sessions (user_id, started, ended)
			VALUES ($1, $2, $3) RETURNING id;
			`, [user_id, started, ended], (err, result) => {
					if (err) return reject(err);
					resolve(result);
					done();
				}
			)
		});
	});
}

exports.deleteUserStudySessions = function(user_id) {
	return new Promise((resolve, reject) => {
		db(function(client, done) {
			client.query(
				`
				DELETE
				FROM study_sessions
			  WHERE user_id=$1;
				`,
				[user_id],
				(err, result) => {
					if (err) return reject(err) && done();
					resolve(result);
					done();
				}
			)
		});
	});
}
