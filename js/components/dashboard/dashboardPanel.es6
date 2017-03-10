var login = require('../../services/login');
//var login = Login();

module.exports = {
    bindings: {
        panel: '<'
    },
    template: require('./dashboardPanel.html'),
    controllerAs: 'vm',
    controller: function() {
        let vm = this;
        console.log('hello from the main component');
        console.log(login);
        login.auth();

        vm.$onInit = function(){
            console.log('from the dashboard panel component', vm.panel);
        }
    }
}