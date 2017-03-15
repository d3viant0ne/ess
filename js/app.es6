import angular from 'angular';
import components from './index';
import uirouter from 'angular-ui-router';
import routing from './app.config';
import routes from './app.routes';

var app = angular.module('ess', [uirouter, components])
                 .config(routing)
                 .config(routes)
    
components(app);