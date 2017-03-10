import angular from 'angular';
import material from 'angular-material';
//require('mixins');

var app = require('./app');

console.log('loading this from the index file',app);

angular.module('ess')
    .service('loginService', require('./services/login'))
    .service('userService', require('./services/user'))
    .component('mainComponent', require('./components/main/main'))
    .component('dashboard', require('./components/dashboard/dashboard'))
    .component('dashboardPanel', require('./components/dashboard/dashboardPanel'));