var db = require('./');

exports.createTable = function() {
	db(function(client, done) {
		client.query('CREATE TABLE CONTENT_AGGREGATE(' +
			'ID SERIAL PRIMARY KEY NOT NULL,' +
			'USER_ID UUID NOT NULL,' +
			'CONTENT_TYPE VARCHAR(255) NOT NULL,' +
			'CONTENT_L1 VARCHAR(255) NOT NULL,' +
			'CONTENT_L2 VARCHAR(255),' +
			'CONTENT_L3 VARCHAR(255),' +
			'CONTENT_L4 VARCHAR(255),' +
			'LAST_UPDATE TIMESTAMP,' +
			'HREF VARCHAR(255),' +
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

exports.addUpdateContentAggregate = function(aggregate) {
  return new Promise((resolve, reject) => {
    db(function(client, done) {
      // First check if an aggregation already exists for this user and content type
      client.query(
        `
					SELECT id FROM content_aggregate WHERE user_id=$1
						AND content_type=$2
						AND content_l1=$3
						AND content_l2=$4
						AND content_l3=$5
						AND content_l4=$6;
				`,
        [
          aggregate.user_id,
          aggregate.type,
          aggregate.l1,
          aggregate.l2,
          aggregate.l3,
          aggregate.l4
        ],
        (err, result) => {
          if (err) return reject(err) && done();

          if (result.rows.length) {
            // The record already exists so update it
            client.query(
              `
							UPDATE content_aggregate
							 SET total_seconds = total_seconds + ${aggregate.time}
							 WHERE user_id=$1
								AND content_type=$2
								AND content_l1=$3
								AND content_l2=$4
								AND content_l3=$5
								AND content_l4=$6;
							`,
              [
                aggregate.user_id,
                aggregate.type,
                aggregate.l1,
                aggregate.l2,
                aggregate.l3,
                aggregate.l4
							], (err, result) => {
								if (err) return reject(err) && done();
								resolve(result);
								done();
							}
            )
          } else {
            // Create a new record
						client.query(
							`
							INSERT INTO content_aggregate (user_id, content_type, content_l1, content_l2, content_l3, content_l4, last_update, total_seconds, href)
								VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);
							`, [
								aggregate.user_id,
								aggregate.type,
                aggregate.l1,
                aggregate.l2,
                aggregate.l3,
								aggregate.l4,
								'now',
								aggregate.time,
								aggregate.href
							], (err, result) => {
								if (err) return reject(err) && done();
								resolve(result);
								done();
							}
						)
          }
        });
    });
  });
}

exports.getTopContent = function(user_id, count) {
	return new Promise((resolve, reject) => {
		db(function(client, done) {
			client.query(
				`
				SELECT content_type, content_l1, content_l2, content_l3, content_l4, total_seconds, href
				FROM content_aggregate
				WHERE user_id=$1
				ORDER BY total_seconds DESC
				LIMIT $2;
				`, [user_id, count],
				(err, result) => {
					if (err) return reject(err) && done();
					resolve(result);
					done();
				}
			)
		});
	});
}

exports.getRecentContent = function(user_id, count) {
	return new Promise((resolve, reject) => {
		db(function(client, done) {
			client.query(
				`
				SELECT content_type, content_l1, content_l2, content_l3, content_l4, last_update, href
				FROM content_aggregate
				WHERE user_id=$1
				ORDER BY LAST_UPDATE DESC
				LIMIT $2;
				`, [user_id, count],
				(err, result) => {
					if (err) return reject(err) && done();
					resolve(result);
					done();
				}
			)
		});
	});
}

exports.deleteContentAggregations = function(user_id) {
	return new Promise((resolve, reject) => {
		db(function(client, done) {
			client.query(
				`
				DELETE FROM content_aggregate where user_id=$1;
				`, [user_id],
				(err, result) => {
					if (err) return reject(err) && done();
					resolve(result);
					done();
				}
			)
		});
	});
}

exports.getTotalTimeOfType = function(user_id, type) {
	return new Promise((resolve, reject) => {
		db(function(client, done) {
			client.query(
				`
				SELECT SUM(total_seconds) FROM content_aggregate WHERE user_id=$1 AND content_type=$2;
				`, [user_id, type],
				(err, result) => {
					if (err) return reject(err) && done();
					resolve(result);
					done();
				}
			)
		});
	});
}


exports.getTotalTimeOfL1 = function(user_id, l1) {
	return new Promise((resolve, reject) => {
		db(function(client, done) {
			client.query(
				`
				SELECT SUM(total_seconds) FROM content_aggregate WHERE user_id=$1 AND content_l1=$2;
				`, [user_id, l1],
				(err, result) => {
					if (err) return reject(err) && done();
					resolve(result);
					done();
				}
			)
		});
	});
}

exports.getTotalTimeOfL2 = function(user_id, l1, l2) {
	return new Promise((resolve, reject) => {
		db(function(client, done) {
			client.query(
				`
				SELECT SUM(total_seconds) FROM content_aggregate WHERE user_id=$1 AND content_l1=$2 AND content_l2=$3;
				`, [user_id, l1, l2],
				(err, result) => {
					if (err) return reject(err) && done();
					resolve(result);
					done();
				}
			)
		});
	});
}
