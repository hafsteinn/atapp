'use strict';
app.factory('bookingService', ['$http','ngAuthSettings', function ($http,ngAuthSettings) {

  var bookingServiceFactory = {};

  var today = new Date();
  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  var _getBookings = function(uid)
  {
    //get all bookings for this user
    return $.ajax({
      method: 'GET',
      url: 'https://bookingsservices.at.is/api/Booking/allbookings/' + uid,
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization", "Basic " + btoa("user" + ":" + "password"));
      }
    })
      .success( function( data )
      {
        return data;
      })
      .error( function( err)
      {
        var message = "Engin bókun fannst fyrir notanda."
        return message;
      });
  }


  var _bookCar = function (cid,uid) {

    var booking = {
      CarId: cid,
      BookedByUserId: uid,
      UserId: uid,
      BookedFrom: today.toISOString(),
      BookedTo: tomorrow.toISOString()
    };



    return $.ajax({
      method: 'POST',
      url: 'https://bookingsservices.at.is/api/booking/bookcar/',
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization", "Basic " + btoa("user" + ":" + "password"));
      },
      data: booking
    })
      .success( function( data )
      {
        return data;
      })
      .error( function( err)
      {
        return err;
      });

  };

  var _returnCar = function(bookingId,uid)
  {
    return $.ajax({
      method: 'GET',
      url: 'http://bookingsservices.at.is/api/Booking/ReturnCar/' + bookingId + '?userId=' + uid,
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Authorization", "Basic " + btoa("user" + ":" + "password"));
      }
    })
      .success( function( data )
      {
        return data;
      })
      .error( function( err)
      {
        return err;
      });



  }


  bookingServiceFactory.bookCar = _bookCar;
  bookingServiceFactory.returnCar = _returnCar;
  bookingServiceFactory.getAllBookings = _getBookings;

  return bookingServiceFactory;

}]);
/**
 * Created by hafsteinnh on 13-Feb-16.
 */
