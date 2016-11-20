var jarvisApp = angular.module("jarvis", ['ngRoute']);

jarvisApp.config(function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "partials/dashboard.htm",
            controller: "dashboardCtrl"
        })
        .otherwise({
            templateUrl: "partials/404.htm"
        })
});

jarvisApp.controller("menuCtrl", function($scope) {
    $scope.menuStatus = "collapse";
    
    $scope.toggleMenu = function() {
        if($scope.menuStatus === "collapse") {
            $scope.menuStatus = "";
        } else {
            $scope.menuStatus = "collapse";
        }
    }
});

jarvisApp.controller("dashboardCtrl", function($scope, $http, config) {
    $scope.infoBoxes = [
        {
            title: "Bank Balances",
            value: "5346876",
            footer: "Last updated: 20/11/2016"
        }
    ];
    
    $scope.txn = {
        date: new Date()
    };

    $http
        .get(config.baseUrl + "/categories")
        .then(
            function(response) {
                $scope.categories = response.data;
            }, function() {
            }
    );

    $http
        .get(config.baseUrl + "/orders/vendors")
        .then(
            function(response) {
                $scope.vendors = response.data;
            }
    );

    $http
        .get(config.baseUrl + "/summary")
        .then(
            function(response) {
                $scope.currentMonthSummary = response.data;
            }, function() {
            }
    );

    $http
        .get(config.baseUrl + "/orders")
        .then(
            function(response) {
                $scope.orders = response.data;
            }, function() {
            }
    );

    $scope.refreshOrderStatus = function() {
        $http
            .get(config.baseUrl + "/orders?refresh=true")
            .then(
                function(response) {
                    $scope.orders = response.data;
                }, function() {
                }
        );
    }

    $scope.submitNewTransaction = function() {
        $scope.txn.type = "debit";
        $scope.txn.categoryId = $scope.selectedCategory.id;
        $http
            .post(config.baseUrl + "/transactions", $scope.txn)
            .then(function(response) {
                alert("Done: " + response);
        });
    }

    $scope.submitNewOrder = function() {
        $scope.order.vendorId = $scope.selectedVendor.id;
        $http
            .post(config.baseUrl + "/orders", $scope.order)
            .then(function(response) {
                alert("Done: " + response);
        });
    }

});