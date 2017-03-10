require('./dashboard.scss');
var login = require('../../services/login');
 
module.exports = {
    template: require('./dashboard.html'),
    controllerAs: 'vm',
    controller: function() {
        var vm = this;
        console.log('hello from the dashboard component');
        // console.log(login);
        // login.auth();
        vm.panels = [
            {title:'my Time', image:'clock.jpg', link: 'time-statement', visible: true, alerts: []},
            {title: 'my Schedule', image: 'BMW_Efficient_Dynamics1.jpg', link: 'workSchedule', visible: true, alerts: []},
            {title:'my Pay', image:'504705052.jpg', link: 'pay-statementList', visible: true, alerts: []},
            {title:'my APTO', image:'513313356.jpg', link: 'timeOff', visible: true, alerts: []},
            {title:'Attendance Points', image:'158947043.jpg', link: 'attendancePoints', visible: true, alerts: []},
            {title:'Ask HR', image:'512056034.jpg', link: 'askHRDashboard', visible: true, alerts: []},
            {title:'Alerts', image:'527045000.jpg', link: 'myMessages', visible: true, alerts: []},
            {title:'My News', image:'514228956.jpg', link: 'news', visible: true, alerts: []}
        ];
    }
}