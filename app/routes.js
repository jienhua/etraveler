// grab the nerd model we just created
var api  = require('./etravelerAPI');

module.exports = function(app) {

    app.use('/api', api);
    
    // frontend routes =========================================================
    // route to handle all angular requests
    app.get('*', function(req, res) {
        res.sendfile('./public/index.html'); // load our public/index.html file
    });
};
