var pg = require('pg');

module.exports = function(query) {
	var conString = "postgres://postgres:" + process.env.POSTGRES_PASSWORD + "@postgres/postgres";

	pg.connect(conString, function(err, client, done) {
		console.log('trying to connect...');
		if (err) {
			return console.error('error fetching client from pool', err);
		} else {
			console.log("SUCCESS")
		}

		query(client, done);
	});
}
