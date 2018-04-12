import StatueCard from '../components/StatueCard.js';

new Vue({
  el: '#app',
  components: {
    StatueCard
  },
  data: {
    statues: {}
  },
  mounted: function () {
    var self = this;
    $.ajax({
      url: 'api/statues',
      method: 'GET',
      success: function(data) {
        self.statues = data.statues;
      },
      error: function(xhr) {

      }
    });
  }

});
