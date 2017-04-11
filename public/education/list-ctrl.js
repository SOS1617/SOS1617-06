/* global angular */
/* global Materialize */
/* global $ */
angular.module("EducationManagerApp").
controller("ListCtrl", ["$scope", "$http", function($scope, $http) {
    console.log("Controller initialized");

    var apikey = "secret";

    function refresh() {
        $http
            .get("../api/v1/education" + "?" + "apikey=" + apikey)
            .then(function(response) {
                $scope.data = response.data;
                console.log("Data count: " + $scope.data.length);
            }, function(response) {
                Materialize.toast('<i class="material-icons">error_outline</i> Error getting data!', 4000);
            });
    }


    $scope.addData = function() {
        $http
            .post("../api/v1/education" + "?" + "apikey=" + apikey, $scope.newData)
            .then(function(response) {
                console.log("Data added!");
                refresh();
            }, function(response) {
                Materialize.toast('<i class="material-icons">error_outline</i> Error adding data!', 4000);
            });
    };

    $scope.editDataModal = function(data) {
        data["oldCountry"] = data["country"];
        data["oldYear"] = data["year"];
        $scope.editDataUnit = data;
        $('#editModal').modal('open');
    };

    $scope.editData = function(data) {
        var oldCountry = data.oldCountry;
        var oldYear = data.oldYear;
        delete data.oldCountry;
        delete data.oldYear;
        $http
            .put("../api/v1/education/" + oldCountry + "/" + oldYear + "?" + "apikey=" + apikey, data)
            .then(function(response) {
                console.log("Data " + data.country + " edited!");
                refresh();
            }, function(response) {
                Materialize.toast('<i class="material-icons">error_outline</i> Error editing data!', 4000);
                refresh();
            });
    };

    $scope.delData = function(data) {
        $http
            .delete("../api/v1/education/" + data.country + "/" + data.year + "?" + "apikey=" + apikey)
            .then(function(response) {
                console.log("Data " + data.country + " deleted!");
                refresh();
            }, function(response) {
                Materialize.toast('<i class="material-icons">error_outline</i> Error deleting data!', 4000);
            });
    };

    $scope.delAllData = function() {
        $http
            .delete("../api/v1/education" + "?" + "apikey=" + apikey)
            .then(function(response) {
                console.log("All data deleted!");
                refresh();
            }, function(response) {
                Materialize.toast('<i class="material-icons">error_outline</i> Error deleting all data!', 4000);
            });
    };

    $scope.loadInitialData = function() {
        refresh();
        if ($scope.data.length == 0) {
            $http
                .get("../api/v1/education/loadInitialData" + "?" + "apikey=" + apikey)
                .then(function(response) {
                    console.log("Initial data loaded");
                    refresh();
                }, function(response) {
                    Materialize.toast('<i class="material-icons">error_outline</i> Error adding initial data!', 4000);
                });
        }
        else {
            console.log("List must be empty!");
        }
    };

    refresh();
}]);

$(document).ready(function() {
    $('.modal').modal({
        ready: function(modal, trigger) {
            Materialize.updateTextFields();
        }
    });
});