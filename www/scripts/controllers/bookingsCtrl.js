/**
 * Created by hafsteinnh on 16-Sep-15.
 */
'use strict';
app.controller('BookingsCtrl', ['$scope', '$location', 'localStorageService','customerService','bookingService', function ($scope, $location, localStorageService,customerService,bookingService) {

  $scope.showNavigation = false;
  $scope.noVehicles = false;
  $scope.message = "";
  $scope.errorMessage = "Villa";
  $scope.successMessage = "Aðgerð tókst";
  $scope.userBookings = [];
  var bookings = [];
  var currentCarID = "";
  var currentUserID = localStorageService.get('customerInfo').id;

  $scope.disp = false;
  $scope.dispSuccess = false;

  //module 32 is Bookings
  customerService.getCustomerVehiclesByModule(32).then(function (results){

    console.log(results.data);

    if(results.data.length === 0)
    {
      $scope.disp = true;
      $scope.errorMessage = "Engir skráðir bílar fundust"
    }
    else
    {
      $scope.vehicleList = results.data;

      $scope.currentInDropdown = results.data[0].carLicence + " - " + results.data[0].vehicleType + " - " + results.data[0].vehicleSubType;

      $scope.currentCarLicence = results.data[0].carLicence;

      currentCarID = results.data[0].carID;

    }

  });




  $scope.dropdownChange = function(vehicleID,ind){

    hideInfo();

    $scope.currentInDropdown = $scope.vehicleList[ind].carLicence + " - " + $scope.vehicleList[ind].vehicleType + " - " + $scope.vehicleList[ind].vehicleSubType;

    $scope.currentCarLicence = $scope.vehicleList[ind].carLicence;

    currentCarID = $scope.vehicleList[ind].carID;
  };


  $scope.assignToVehicle = function(){

    hideInfo();

    bookingService.bookCar(currentCarID,currentUserID).then(function(data){
      if(data > 0)
      {
        $scope.getAllBookings();
        $scope.successMessage = "Skráning tókst"
        $scope.disp = false;
        $scope.dispSuccess = true;
        $scope.$apply();

        hideSuccess();
      }
      else if(data === -50)
      {
        $scope.errorMessage = "Annar notandi er nú þegar skráður á þennan bíl";
        $scope.disp = true;
        $scope.dispSuccess = false
        $scope.$apply();
      }
      else{
        $scope.dispSuccess = false;
        $scope.errorMessage = "Skráning tókst ekki";
        $scope.disp = true;
        $scope.$apply();
      }
    });

  };

  $scope.unassignFromVehicle = function(){

    hideInfo();

    $scope.getAllBookings();

    var bookId = "";

    bookings.forEach(function(item){
      if(item.carId === currentCarID && item.userId === currentUserID)
      {
          bookId = item.id;
      }
    });

    if(bookId === "")
    {
      $scope.disp = true;
      $scope.errorMessage = "Engin bókun er skráð á þennan bíl";
    }
    else{
      bookingService.returnCar(bookId,currentUserID).then(function(data){
        if(data === -1)
        {

          $scope.userBookings = $scope.userBookings.filter(function(item){
            return item.carId !== currentCarID;
          })

          $scope.successMessage = "Afskráning tókst";
          $scope.disp = false;
          $scope.dispSuccess = true;
          $scope.$apply();

          hideSuccess();
        }
        else{
          $scope.errorMessage = "Afskráning tókst ekki";
          $scope.disp = true;
          $scope.dispSuccess = false;
          $scope.$apply();
        }
      });
    }


  }

  $scope.getAllBookings = function()
  {
    bookingService.getAllBookings(currentUserID).then(function(data){
      bookings = data;
      bookings.forEach(function(item){

        if(item.userId === currentUserID)
        {
          $scope.userBookings.push(item);
          $scope.$apply();
        }
      });
    });
  }

  var hideInfo = function(){
    $scope.disp = false;
    $scope.dispSuccess = false;
    $scope.errorMessage = "";
    $scope.successMessage = "";
  }

  var hideSuccess = function(){
    setTimeout(function(){
      $scope.dispSuccess = false;
      $scope.successMessage = "";
      $scope.$apply();
    },5000);
  }

}]);

/**
 * Created by hafsteinnh on 13-Feb-16.
 */
