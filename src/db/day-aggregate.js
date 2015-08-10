var db = require('./');

exports.createTable = function() {
	db(function(client, done) {
		client.query('CREATE TABLE DAY_AGGREGATE(' +
			'ID SERIAL PRIMARY KEY NOT NULL,' +
			'USER_ID UUID NOT NULL,' +
			'DAY TIMESTAMP,' +
			'LAST_UPDATE TIMESTAMP,' +
			'TOTAL_SECONDS INT NOT NULL' +
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

exports.addUpdateDayAggregate = function(aggregate) {
	return new Promise((resolve, reject) => {
		db(function(client, done) {
			// First check if an aggregation already exists for this user and day
			client.query(
				`SELECT id FROM day_aggregate WHERE user_id=$1 AND day=$2;`,
				[ aggregate.user_id, aggregate.day ],
				(err, result) => {
					if (err) return reject(err) && done();

					if (result.rows.length) {
						// The record already exists so update it
						client.query(
							`
							UPDATE  day_aggregate
							   SET total_seconds = total_seconds + ${aggregate.total_seconds}
								 WHERE user_id = $1
								 AND day = $2;
							`, [ aggregate.user_id, aggregate.day ],
							(err, result) => {
								 if (err) return reject(err) && done();
								 resolve(result);
								 done();
							}
						)
					} else {
						// Create a new record
						client.query(
							`INSERT INTO day_aggregate (user_id, day, total_seconds, last_update)
							 VALUES ($1, $2, $3, $4);
							 `, [
								 aggregate.user_id,
								 aggregate.day,
								 Math.floor(aggregate.total_seconds),
								 'now'
							 ], (err, result) => {
								 if (err) return reject(err) && done();
								 resolve(result);
								 done();
							 }
						)
					}

				}
			)
		});
	})
}

exports.getLastYear = function(user_id) {
	var yearAgo = new Date(new Date().getTime() - 31556900000);
	return new Promise((resolve, reject) => {
		db(function(client, done) {
			client.query(
				`SELECT day,total_seconds
					FROM day_aggregate
					WHERE day >= $2
					AND user_id = $1
					ORDER BY day DESC;`,
				[user_id, yearAgo],
				(err, result) => {
					if (err) return reject(err) && done();
					resolve(result);
					done();
				}
			)
		});
	});
}
