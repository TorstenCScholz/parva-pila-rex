(function () {
  'use strict';
  var app = angular.module('Regexes');

  app.controller('RegexesListController', function ($scope, regexes) {
    var self = this;

    $scope.regexes = regexes;
  });
})();
