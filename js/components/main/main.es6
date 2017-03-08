require('./main.scss');
var login = require('../../services/login');

module.exports = {
    template: 'hello from the main component!<dashboard></dashboard>',
    controllerAs: 'vm',
    controller: function() {
        console.log('hello from the main component');
        console.log(login);
        login.auth();
    }
}