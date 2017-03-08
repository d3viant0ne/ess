require('./dashboard.scss');
var login = require('../../services/login');
//var login = Login();
 
module.exports = {
    template: require('./dashboard.html'),
    controllerAs: 'vm',
    controller: function() {
        var vm = this;
        console.log('hello from the main component');
        console.log(login);
        login.auth();
        vm.tiles = [
            {title:'my Time123456', image:'time.jpg', link: ''},
            {title:'my Pay', image:'money.jpg', link: ''},
            {title:'my APTO', image:'plane.jpg', link: ''},
            {title:'Ask HR', image:'hr.jpg', link: ''},
            {title:'Alerts', image:'tablet.jpg', link: ''},
            {title:'My News', image:'paper.jpg', link: ''}
        ];
    }
}