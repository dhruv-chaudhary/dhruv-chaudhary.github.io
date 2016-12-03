var jarvisApp = angular.module("jarvis", ['ngRoute']);

jarvisApp.config(function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "partials/dashboard.htm",
            controller: "dashboardCtrl"
        })
        .otherwise({
            templateUrl: "partials/404.htm"
        });
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
    
    $scope.menuItems = [
        {
            name: "Bank Accounts",
            link: "/bankaccounts"
        }, {
            name: "Expenditure Categories",
            link: "/expenditurecategories"
        }
    ];
});

jarvisApp.controller("dashboardCtrl", function($scope, $http, config, $filter) {
    
    $scope.txnSaved = false;
    $scope.txnSaving = false;
    
    $scope.infoBoxes = new Array();
    
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
        .get(config.baseUrl + "/bankaccounts/summary")
        .then(
            function(response) {
                var lastUpdated = new Date(response.data.lastUpdated);
                var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                $scope.infoBoxes.push({
                        title: "Net Bank Balance",
                        value: $filter("currency")(response.data.totalBalance, "\u20B9 ", 0),
                        footer: "Last updated: " + $filter("date")(lastUpdated)
                    })
            }, function() {
            }
    );
    
    $http
        .get(config.baseUrl + "/paymentsources")
        .then(
            function(response) {
                $scope.paymentSources = response.data;
            }, function() {
            }
    );

    $http
        .get(config.baseUrl + "/orders/shippers")
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
        $scope.txnSaving = true;
        $scope.txn.type = "debit";
        $scope.txn.categoryId = $scope.selectedCategory.id;
        $scope.txn.paymentSource = $scope.selectedPaymentSource.id;
        $http
            .post(config.baseUrl + "/transactions", $scope.txn)
            .then(function(response) {
                $scope.txnSaving = false;
                $scope.txnSaved = true;
        });
    };

    $scope.submitNewOrder = function() {
        $scope.order.shipperId = $scope.selectedVendor.id;
        $http
            .post(config.baseUrl + "/orders", $scope.order)
            .then(function(response) {
                alert("Done: " + response);
        });
    };

});