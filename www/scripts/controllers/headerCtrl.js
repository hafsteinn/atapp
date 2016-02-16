/**
 * Created by hafsteinnh on 16-Sep-15.
 */
'use strict';
app.controller('headerCtrl', ['$scope', '$location', 'authService','$rootScope', function ($scope, $location, authService,$rootScope) {



  $rootScope.$watch('globals.currentUser', function() {


      if($rootScope.globals.currentUser != undefined)
      {
        $scope.showIT = true;
      }
      else{
        $scope.showIT = false;
      }



  });



}]);
