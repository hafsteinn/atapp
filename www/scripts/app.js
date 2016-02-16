'use strict';

/**
 * @ngdoc overview
 * @name atApp
 * @description
 * # atApp
 *
 * Main module of the application.
 */
var app = angular
  .module('atApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'LocalStorageModule',
    'angular-loading-bar',
    'radialIndicator'
  ]);

app.config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about/', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      }).when('/login/', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      }).when('/trips/:carLicence', {
        templateUrl: 'views/trips.html',
        controller: 'TripsCtrl'
      })
      .when('/settings', {
        templateUrl: 'views/settings.html',
        controller: 'SettingsCtrl'
      })
      .when('/start', {
        templateUrl: 'views/start.html',
        controller: 'StartCtrl'
      })
      .when('/bookings', {
        templateUrl: 'views/bookings.html',
        controller: 'BookingsCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }).run(['$rootScope', '$location', '$cookieStore', '$http',
  function ($rootScope, $location, $cookieStore, $http) {
    // keep user logged in after page refresh
    $rootScope.globals = $cookieStore.get('globals') || {};
    if ($rootScope.globals.currentUser) {
      $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
    }

    $rootScope.$on('$locationChangeStart', function (event, next, current) {
      // redirect to login page if not logged in
      if ($location.path() !== '/login/' && !$rootScope.globals.currentUser) {
        $location.path('/login/');
      }
    });

  }]);

app.config(['$httpProvider', function($httpProvider) {
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
}
]);


app.constant('ngAuthSettings', {
  //apiServiceBaseUri: 'https://api.at.is/',
  apiServiceBaseUri: 'http://rest.at.is/',
  //apiServiceBaseUri: 'http://staging.at.is:89/',
  //apiServiceBaseUri: 'http://localhost:51269/',
  clientId: 'AT'
});

/*app.run(['authService', function (authService) {
  authService.fillAuthData();
}]);

app.config(function ($httpProvider) {
  $httpProvider.interceptors.push('authInterceptorService');
});*/


/*app.config(function($httpProvider) {
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
});*/
