'use strict';

/**
 * @ngdoc function
 * @name atApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the atApp
 */
angular.module('atApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
