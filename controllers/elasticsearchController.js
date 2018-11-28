const bonsai_url = process.env.BONSAI_URL,
      elasticsearch = require('elasticsearch'),
      client = new elasticsearch.Client({
        host: bonsai_url,
        log: 'trace',
      });

exports.searchStatues = (query, callback) => {
  client.search({
    index: 'statue',
    type: 'info',
    body: {
      query: {
        bool: {
          should: [
            { match: { description: `*${query}*` } },
            { match: { name: `*${query}*` } },
            { match: { location: `*${query}*` } },
          ]
        }
      },
    }
  }, (error, response, status) => {
    callback(error, response);
  });
};
