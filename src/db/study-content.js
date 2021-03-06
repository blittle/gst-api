var db = require('./');

exports.createTable = function() {
	db(function(client, done) {
		client.query('CREATE TABLE STUDY_CONTENT(' +
			'ID SERIAL PRIMARY KEY NOT NULL,' +
			'SESSION_ID INT NOT NULL,' +
			'CONTENT_TYPE VARCHAR(255) NOT NULL,' +
			'CONTENT_L1 VARCHAR(255) NOT NULL,' +
			'CONTENT_L2 VARCHAR(255),' +
			'CONTENT_L3 VARCHAR(255),' +
			'CONTENT_L4 VARCHAR(255),' +
			'HREF VARCHAR(255),' +
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

exports.addStudyContent = function(content) {
	return new Promise((resolve, reject) => {
		db(function(client, done) {
			client.query(
				`
			INSERT INTO study_content (session_id, content_type, content_l1, content_l2, content_l3, content_l4, total_seconds, href)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id;
			`, [
					content.session_id,
					content.type,
					content.l1,
					content.l2,
					content.l3,
					content.l4,
					content.time,
					content.href
				], (err, result) => {
					if (err) return done() && reject(err);
					resolve(result);
					done();
				}
			)
		});
	});
}

exports.deleteUserStudyContent = function(user_id) {
	return new Promise((resolve, reject) => {
		db(function(client, done) {
			client.query(
				`
				DELETE
				FROM study_content SC
					 USING study_sessions SS
					 WHERE SS.id = SC.session_id AND
						 SS.user_id=$1;
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
