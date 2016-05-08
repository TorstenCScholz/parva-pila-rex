(function () {
  'use strict';
  var app = angular.module('Regexes');

  app.factory('Regexes', function ($resource, Config) {
    return $resource(Config.BASE_PATH + '/regexes/:id');
  });
})();
