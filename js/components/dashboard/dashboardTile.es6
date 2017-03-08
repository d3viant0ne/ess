var login = require('../../services/login');
//var login = Login();

module.exports = {
    template: require('./dashboardTile.html'),
    controllerAs: 'vm',
    controller: function() {
        console.log('hello from the main component');
        console.log(login);
        login.auth();
    }
}