(function () {
  'use strict';
  var app = angular.module('App', [
    'ngResource',
    'ngRoute',
    'ui.router',

    'Config',
    'Regexes'
  ]);

  app.run(function ($rootScope) {
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options) {
      console.log('state change start');
    });
    $rootScope.$on('$stateNotFound', function(event, unfoundState, fromState, fromParams) {
      console.log('state not found: ' + unfoundState.to);
    });
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      console.log('state change success');
    });
    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
      console.log('state change error: ' + error);
    });
  });

  app.config(function ($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise('/main');

    $stateProvider
      .state('main', {
        url: '/main',
        templateUrl: 'main/content.html',
        controller: 'RegexesListController',
        resolve: {
          regexes: function (Regexes) {
            return Regexes.query().$promise;
          }
        }
      })
  });
})();
