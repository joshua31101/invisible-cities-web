const firebase = require('../controllers/firebaseController');
const bonsai_url = process.env.BONSAI_URL,
      elasticsearch = require('elasticsearch'),
      client = new elasticsearch.Client({
        host: bonsai_url,
        log: 'trace',
      }),
      statueBulk = [];

function updateElasticsearch() {
  // make this as a daily job to update statues in elasticsearch cluster
  firebase.login(process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD, (err, _) => {
    firebase.getAllStatues(statues => {
      const promises = _getLocationPromises(statues);
      Promise.all(promises).then(() => {
        client.bulk({
          maxRetries: 5,
          index: 'statue',
          type: 'info',
          body: statueBulk,
        }, (err, resp, status) => {
          if (err) {
            console.log(err);
          } else {
            console.log('Successfully updated the statues in elasticsearch!');
          }
          return;
        });
      });
    });
  });
};

function _getLocationPromises(statues, callback) {
  return Object.entries(statues).map((s) => {
    const sId = s[0];
    const statue = s[1];

    return new Promise((resolve, reject) => {
      firebase.getMap(sId, map => {
        const statueIndex = { index: { _index: 'statue', _type: 'info', _id: sId } };
        const statueHash = {
          description: statue.description,
          location: map.location ? map.location : '',
          dislike: statue.dislike,
          isFlagged: statue.isFlagged,
          isPrivate: statue.isPrivate,
          like: statue.like,
          name: statue.name,
          userId: statue.userId,
          statuePreviewPicURL: statue.statuePreviewPicURL,
        };

        // skip fetching location of a coord if exists
        if (map.location) {
          return resolve([
            statueIndex,
            statueHash
          ]);
        }

        return fetchLocation(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${map.latitude}&lon=${map.longitude}&zoom=10`)
          .then(data => {
            let location = '';
            firebase.addLocation(sId, location);
            if (data.error) {
              return resolve([
                statueIndex,
                statueHash
              ]);
            }
            const city = data.address.city;
            const state = data.address.state;
            if (city === undefined) {
              location = state;
            } else {
              location = `${city} ${state}`;
            }
            firebase.addLocation(sId, location);
            statueHash.location = location;

            resolve([
              statueIndex,
              statueHash
            ]);
          });
      });
    })
      .then(([sIndex, sHash]) => (statueBulk.push(sIndex, sHash)));
  });
}

async function fetchLocation(url) {
  let response = await fetch(url);
  return await response.json();
}

updateElasticsearch();
