/**
 * Created by hafsteinnh on 16-Sep-15.
 */
'use strict';
app.controller('LoginCtrl', ['$scope', '$location', 'authService','$rootScope', function ($scope, $location, authService,$rootScope) {

  $scope.showNavigation = false;

  $scope.message = "";

  // reset login status
  authService.ClearCredentials();

  $scope.login = function () {
    $scope.dataLoading = true;
    authService.Login($scope.username, $scope.password, function(response) {

      if(response === "true") {

        $scope.showNavigation = true;

        authService.getUserInfo($scope.username).success(function(results){
          authService.SetCredentials($scope.username, $scope.password,results.ssn);
          $location.path('/start');
        });



      } else {
        $scope.error = "Notandanafn eða lykilorð ekki rétt";
        $scope.dataLoading = false;
      }
    });
  };

  /*$scope.login = function () {

    authService.login($scope.loginData).then(function (response) {

        console.log(response)

          authService.getUserInfo().success(function(){
            $location.path("#");
          });

      },
      function (err) {
        $scope.message = err.error_description;
      });
  };*/

}]);
