let {addStudySession} = require('../db/study-session.js');
let {addStudyContent} = require('../db/study-content.js');
let {addUpdateDayAggregate} = require('../db/day-aggregate.js');
let {addUpdateContentAggregate} = require('../db/content-aggregate.js');

let {union} = require('lodash');

let {Promise} = require('es6-promise');

exports.get = {
}

function getDayTimeFromDate(time) {
  let d = new Date(time);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function trim(val) {
	return val ? (val+'').trim() : '';
}

exports.post = {
  method: 'POST',
	path: '/api/study-sessions',
  config: {
    auth: 'jwt'
  },
  handler: function(request, reply) {
    const user_id = request.auth.credentials.id;

    addStudySession({
      user_id: user_id,
      started: new Date(request.payload.startTime),
      ended: new Date(request.payload.endTime)
    }).then((result) => {

      let contentPromises = request.payload.resources.map((resource) => {
        return addStudyContent({
          session_id: result.rows[0].id,
          type: trim(resource.type),
          l1: trim(resource.l1),
          l2: trim(resource.l2),
          l3: trim(resource.l3),
          l4: trim(resource.l4),
					href: trim(resource.href),
          time: Math.floor(resource.time / 1000)
        })
      });

      let aggregatePromises = request.payload.resources.map((resource) => {
        return addUpdateContentAggregate({
          user_id: user_id,
          type: trim(resource.type),
          l1: trim(resource.l1),
          l2: trim(resource.l2),
          l3: trim(resource.l3),
          l4: trim(resource.l4),
					href: trim(resource.href),
          time: Math.floor(resource.time / 1000)
        })
      });

      aggregatePromises.push(
        addUpdateDayAggregate(
          {
            user_id: request.auth.credentials.id,
            day: getDayTimeFromDate(request.payload.startTime),
            total_seconds: Math.floor((request.payload.endTime - request.payload.startTime) / 1000),
          }
        )
      )

      Promise.all(union(contentPromises, aggregatePromises)).then((result) => {
        reply({
          success: true
        })
          .header("Authorization", request.headers.authorization);
      }).catch((err) => {
        console.error(err);
        reply({
          success: false
        })
          .header("Authorization", request.headers.authorization);
      });

    }).catch((err) => {
      console.error(err);
      reply({
        success: false
      })
        .header("Authorization", request.headers.authorization);
    });


  }
}

