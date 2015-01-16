/*jshint loopfunc: true */
(function(){
    var app = angular.module('eaApp', ['ngRoute','ngAnimate', 'flash', 'ui.bootstrap', 'infinite-scroll']);

    // Configure All routing
    app.config(['$routeProvider', '$locationProvider',
                function($routeProvider, $locationProvider) {

                    $locationProvider.html5Mode(true);

                    $routeProvider.when('/home', {
                        templateUrl: 'templates/carousel.html',
                        controller: 'CarouselCtrl'
                    })

                    .when('/series', {
                        templateUrl: 'templates/series-list.html',
                        controller: 'SeriesListCtrl'
                    })

                    .when('/series/genre/:genre', {
                        templateUrl: 'templates/series-browse.html',
                        controller: 'SeriesListCtrl'
                    })

                    .when('/series/:seriesname', {
                        templateUrl: 'templates/series-detail.html',
                        controller: 'SeriesCtrl'
                    })

                    .when('/search/', {
                        templateUrl: 'templates/series-search.html',
                        controller: 'SeriesSearchCtrl'
                    })

                    .when('/login', {
                        templateUrl: 'templates/auth/login.html',
                        controller: 'LoginCtrl'
                    })

                    .when('/register', {
                        templateUrl: 'templates/auth/register.html',
                        controller: 'RegisterCtrl'
                    })            

                    .when('/profile', {
                        templateUrl: 'templates/profile.html',
                        controller: 'ProfileCtrl'
                    })          

                    .otherwise({
                        redirectTo: '/home'
                    });
                }]
              );

    // We can add some stuff to the rootscope here
    app.run(function($rootScope, $location, AuthenticationService){

        // check if a user is logged in at the backend
        AuthenticationService.check();

        $rootScope.credentials = {};

        $rootScope.hello = function() {
            //console.log('hello');
            // you can use this in anywhere using $scope.hello();
        };      

        // Add routes that required auth from the front-end
        var routesThatRequireAuth = ['/profile'];

        $rootScope.$on('$routeChangeStart', function(event, next, current){

            for(var i = 0, max = routesThatRequireAuth.length ; i < max ; i++){
                if ( ($location.path() === routesThatRequireAuth[i]) && (!AuthenticationService.isLoggedIn() ) ) {
                    $rootScope.$evalAsync(function () { 
                        $location.path('/login');
                    });
                }
            }
        });

    });

    app.config(function($httpProvider){

        var logsOutUserOn401 = function($location, $q, SessionService) { 
            var success = function(response) {
                return response;
            };
            var error = function(response) { 
                if(response.status === 401){ // HTTP NotAuthorized
                    SessionService.unset('authenticated');
                    $location.path('/login');
                    return $q.reject(response);
                }else{
                    return $q.reject(response);
                }
            };

            return function(promise){
                return promise.then(success, error);
            };

        };

    });


    //Helper/filter to create image path from a series
    app.filter('createImageUrl', function(){
        return function(poster, unique_name, size){
            if(poster){
                if(size){
                    var returnPoster = poster.split('.');
                    returnPoster = returnPoster[0] + '_' + size + '.jpg';
                    return 'img/poster/' + unique_name.substring(0, 2) + '/' + returnPoster;
                }else{
                    return 'img/poster/' + unique_name.substring(0, 2) + '/' + poster;
                }
            }else{
                return 'img/missing.png';
            }
        };
    });

    //Create fanart url
    app.filter('createFanartUrl', function(){
        return function(fanart, unique_name){
            if(fanart !== undefined){
                return 'img/fanart/' + unique_name.substring(0, 2) + '/' + fanart;
            }
            return 'img/fanart/nofanart.jpg';
        };
    });
    
    app.filter('greet', function(dateFilter) {
        return function(date, name) {
            input = dateFilter(date, "H");
            if (input < 12) {
                return 'Good Morning, ' + name;
            } else if (input >= 12 && input <= 17) {
                return 'Good Afternoon, ' + name;
            } else if (input > 17 && input <= 24) {
                return 'Good Evening, ' + name;
            } else {
                return 'Hello, ' + name;
            }
        };
    });

    app.factory('SessionService', function() {
        return{
            get: function(key){
                //HTML5 only
                return sessionStorage.getItem(key);
            },
            set: function(key, val){
                return sessionStorage.setItem(key, val);
            },
            unset: function(key){
                return sessionStorage.removeItem(key);
            }
        };
    });

    app.factory("AuthenticationService", function($rootScope, $location, $http, SessionService, flash) {

        var cacheSession = function(response){
            SessionService.set('authenticated', true);
        };

        var setUserInfo = function(response){
            $rootScope.credentials.auth = true;
            $rootScope.credentials.username = response.username;
            $rootScope.credentials.id = response.id;
        };

        var unSetUserInfo = function(){
            $rootScope.credentials.auth = null;
            $rootScope.credentials.username = null;
            $rootScope.credentials.id = null;
        };

        var uncacheSession = function(){
            SessionService.unset('authenticated');
        };

        var loginError = function(response) {
            flash('danger', 'Login error');
        };

        var loginMessage = function(response){   
            //flash('success', 'Login success');
        };

        var registerMessage = function(response){
            flash('success', response.flash);
        };

        var registerError = function(response){
            flash('danger', response.flash);
        };

        return {
            register: function(credentials) {
                var register = $http.post('api/auth/register', credentials);
                register.success(registerMessage);
                register.error(registerError);
                return register;
            },
            login: function(credentials) {
                var login = $http.post('api/auth/login', credentials);
                login.success(cacheSession);
                login.success(loginMessage);
                login.success(setUserInfo);
                login.error(loginError);
                return login;

            },
            logout: function() {
                var logout =  $http.get('api/auth/logout');
                logout.success(uncacheSession);
                logout.success(unSetUserInfo);
                return logout;
            },
            isLoggedIn: function() {
                return SessionService.get('authenticated');
            },
            check: function() {
                var check = $http.get('api/auth/check');
                check.success(cacheSession);
                check.success(setUserInfo);
                check.error();
                return check;
            }
        };
    });

    app.controller("LoginCtrl", function($route, $scope, $location, AuthenticationService) {
        $scope.credentials = { username: "", password: "" };

        $scope.login = function() {
            AuthenticationService.login($scope.credentials).success(function(){
                $location.path('/profile');
            });
        };

        $scope.logout = function() {
            AuthenticationService.logout($scope.credentials).success(function(){
                $location.path('/login');   
            });
        };

    });  

    app.controller('RegisterCtrl', function($route, $scope, $location, AuthenticationService){
        $scope.credentials = { username: "", password:"", email: "" };

        $scope.login = function() {
            AuthenticationService.register($scope.credentials).success(function(){
                $location.path('/login');
            });
        };

    });

    app.controller("HeaderCtrl", function($scope, $location) {
        $scope.isActive = function (viewLocation) { 
            return $location.path().indexOf(viewLocation) === 0;
        };
    });

})();
