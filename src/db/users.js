var db = require('./');

exports.createTable = function() {
	db(function(client, done) {
		client.query(
			`
			CREATE TABLE USERS(
				ID UUID PRIMARY KEY NOT NULL,
				NAME CHAR(100) NOT NULL,
				EMAIL CHAR(255) NOT NULL,
				AVATAR CHAR(255),
				CREATED TIMESTAMP
			)
			`, function(err, result) {

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

exports.getUser = function(email) {
	return new Promise(function(resolve, reject) {
		db(function(client, done) {
			client.query(
				`SELECT * FROM USERS WHERE EMAIL='${email}';`,
				function(err, result) {
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

exports.createUser = function(user) {
	return new Promise(function(resolve, reject) {
		db(function(client, done) {
			const query = `
				INSERT INTO USERS (ID, NAME, EMAIL, AVATAR, CREATED)
				VALUES
				('${user.id}','${user.name}','${user.email}','${user.avatar}','${user.created}');
			`;

			client.query(query, (err, result) => {
					if (err) {
						reject(err);
					} else {
						resolve(result);
					}
					done();
				}
			)
		});
	});
}
