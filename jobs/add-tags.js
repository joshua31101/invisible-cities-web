const firebase = require('../controllers/firebaseController');

function addTags() {
  const tags = ['Artist', 'Photo', 'AR', 'Inspiration', 'Technology'];
  firebase.login(process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD, (err, _) => {
    console.log('Adding tags...');
    firebase.getAllStatues(statues => {
      for (let sId in statues) {
        let randTagStartIndex = Math.floor(Math.random() * (tags.length - 1)) + 1;
        let _tags = [];
        for (let i = randTagStartIndex; i < tags.length; i++) {
          _tags.push(tags[i]);
        }
        console.log('...');
        firebase.addTags(sId, _tags);
      }
    });
  });
  return;
}

addTags();
