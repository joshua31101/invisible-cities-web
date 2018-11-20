const bonsai_url = process.env.BONSAI_URL,
      elasticsearch = require('elasticsearch'),
      client = new elasticsearch.Client({
        host: bonsai_url,
        log: 'trace',
      });

client.indices.create({  
  index: 'statue'
}, (err, resp, status) => {
  if(err) {
    console.log(err);
  }
  else {
    console.log("create",resp);
  }
});
