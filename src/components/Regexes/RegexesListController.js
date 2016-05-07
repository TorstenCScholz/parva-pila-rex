(function () {
  'use strict';

  var app = angular.module('Regexes');

  app.controller('RegexesListController', function ($scope) {
    var self = this;

    $scope.regexes = [
      {
        id: 0,
        name: 'Test 1',
        description: 'Description 1',
        matches: {
          public: {
            positive: [
              'This is a test',
              'I should match, too'
            ],
            negative: [
              'This number 5 should not match',
              '123'
            ]
          },
          private: {
            positive: [],
            negative: []
          }
        }
      }
    ];
  });
})();
