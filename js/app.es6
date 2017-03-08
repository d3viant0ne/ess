import angular from 'angular';
import uirouter from 'angular-ui-router';
import routing from './app.config';
//import mixins from './assets/css/mixins.scss';

var app = angular.module('ess', [uirouter])
                 .config(routing);
    
console.log('Hello from app.es6',app);