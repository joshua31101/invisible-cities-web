const firebase = require('../controllers/firebaseController');
const bonsai_url = process.env.BONSAI_URL,
      elasticsearch = require('elasticsearch'),
      client = new elasticsearch.Client({
        host: bonsai_url,
        log: 'trace',
      });

function updateElasticsearch() {
  // make this as a daily job to update statues in elasticsearch cluster
  const statueBulk = [];
  firebase.login(process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD, (err, _) => {
    firebase.getAllStatues(statues => {
      for (let sId in statues) {
        statueBulk.push(
          { index: {_index: 'statue', _type: 'info', _id: sId } },
          {
            description: statues[sId].description,
            dislike: statues[sId].dislike,
            isFlagged: statues[sId].isFlagged,
            isPrivate: statues[sId].isPrivate,
            like: statues[sId].like,
            name: statues[sId].name,
            userId: statues[sId].userId,
            statuePreviewPicURL: statues[sId].statuePreviewPicURL,
          }
        );
      }
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
};

updateElasticsearch();
