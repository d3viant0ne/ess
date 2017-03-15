import angular from 'angular';
import material from 'angular-material';
import dashboard from './components/dashboard/dashboard';

// angular.module('esss')
//     .service('loginService', require('./services/login'))
//     .service('userService', require('./services/user'))
//     .component('mainComponent', require('./components/main/main'))
//     .component('dashboard', require('./components/dashboard/dashboard'))
//     .component('dashboardPanel', require('./components/dashboard/dashboardPanel'));


export default app => {
  INCLUDE_ALL_MODULES([dashboard], app);
}