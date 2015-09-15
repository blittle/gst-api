var db = require('./');

exports.createTable = function() {
	db(function(client, done) {
		client.query(
			`
			CREATE TABLE USERS(
				ID UUID PRIMARY KEY NOT NULL,
				NAME VARCHAR(100) NOT NULL,
				EMAIL VARCHAR(255) NOT NULL,
				AVATAR VARCHAR(255),
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

exports.deleteUser = function(id) {
	return new Promise(function(resolve, reject) {
		db(function(client, done) {
			client.query(
				`DELETE FROM USERS WHERE ID=$1;`,
				[id],
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

exports.getUser = function(email) {
	return new Promise(function(resolve, reject) {
		db(function(client, done) {
			client.query(
				`SELECT * FROM USERS WHERE EMAIL=$1;`,
				[email],
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

exports.getUserById = function(id) {
	return new Promise(function(resolve, reject) {
		db(function(client, done) {
			client.query(
				`SELECT * FROM USERS WHERE ID=$1;`,
				[id],
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
