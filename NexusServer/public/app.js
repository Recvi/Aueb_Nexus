// app.js
var routerApp = angular.module('routerApp', ['ui.router']);

routerApp.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider

    // HOME STATES AND NESTED VIEWS ========================================
    .state('welcome', {
        url: '/',
        templateUrl: 'welcome.html'
    })

    .state('home', {
        url: '/home',
        templateUrl: 'home.html'
        // controller: ['$state', ($state) ->
        //     $state.transitionTo('home.main')
        // ]
    })

    // nested list with custom controller
    .state('home.list', {
        url: '/list',
        templateUrl: 'partial-home-list.html',
        controller: function($scope) {
            $scope.dogs = ['Bernese', 'Husky', 'Goldendoodle'];
        }
    })

    // nested list with just some random string data
    .state('home.paragraph', {
        url: '/paragraph',
        template: 'I could sure use a drink right now.'
    })

    .state('home.main', {
        url: '/',
        templateUrl: 'partial-home.html'
    })

    .state('home.eclass', {
        url: '/eclass',
        templateUrl: 'eclass.html'
    })

    .state('home.venus', {
        url: '/venus',
        templateUrl: 'venus.html'
    })

    .state('home.webmail', {
        url: '/mail',
        templateUrl: 'webmail.html'
    })

    .state('home.profile', {
        url: '/profile',
        templateUrl: 'settings.html'
    })

    .state('welcome.nexus-login', {
        url: '/login/nexus',
        templateUrl: 'login.html'
    })

    .state('welcome.eclass-login', {
        url: '/login/eclass',
        templateUrl: 'login.html'
    })

    .state('welcome.venus-login', {
        url: '/login/venus',
        templateUrl: 'login.html'
    })

    .state('welcome.signup', {
        url: '/signup',
        templateUrl: 'signup.html'
    });
});

routerApp.controller('LoginCtrl', ['$scope', '$location', '$http',
    function($scope, $location, $http) {
        $scope.user = {};

        function login() {

            $http.post($location.path(), {
                username: $scope.user,
                password: $scope.pass
            })
                .success(function(data) {
                    $scope.user = data;
                })
                .error(function(data, status, headers, config) {

                });
        };


    }
]);
