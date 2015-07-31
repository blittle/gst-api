var db = require('./');

exports.createTable = () => {
	db((client, done) => {
		client.query('CREATE TABLE SESSIONS(' +
			'ID SERIAL PRIMARY KEY NOT NULL,' +
			'TOKEN CHAR(255) NOT NULL,' +
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

exports.addSession = (session) => {
	return new Promise((resolve, reject) => {
		db((client, done) => {
			client.query(
				`
				INSERT INTO SESSIONS (TOKEN, USER_ID, CREATED)
				VALUES
				('${session.id}','${session.user_id}','now')
				`, (err, result) => {
					if (err) {
						reject(err);
					} else {
						resolve(result);
					}
					done();
				}
			)
		});
	})
}

exports.getSession = (id) => {
	return new Promise((resolve, reject) => {
		db((client, done) => {
			client.query(
				`
				SELECT * FROM SESSIONS WHERE USER_ID=${id};
				`, (err, result) => {
					if (err) {
						reject(err);
					} else {
						resolve(result.rows);
					}
					done();
				}
			)
		});
	});
}
