var addCtrl = angular.module('addCtrl', ['geolocation', 'gservice']);

addCtrl.controller('addCtrl', function($scope, $http, $rootScope, $firebaseArray, geolocation, gservice){

    // Initializes Variables
    // ----------------------------------------------------------------------------
    $scope.formData = {};
    var coords = {};
    var lat = 0;
    var long = 0;

    // Set initial coordinates to the center of the klte
    $scope.formData.latitude = -7.739967;
    $scope.formData.longitude = 110.664568;

    // Get User's actual coordinates based on HTML5 at window load
    geolocation.getLocation().then(function(data){

        // set the latitude and logitude equal to the HTML5 coordinates
        coords = {lat: data.coords.latitude,
            long: data.coords.longitude };

        // Display coordinates in location textboxes rounded to three decimal points
        $scope.formData.longitude = parseFloat(coords.long).toFixed(3);
        $scope.formData.latitude = parseFloat(coords.lat).toFixed(3);

        // Display message confirming that the coordinates verified
        $scope.formData.htmlverified = 'Yep (thanks for giving us real data!)';

        gservice.refresh($scope.formData.latitude, $scope.formData.longitude);

    }); // end geolocation.getLocation().then(function(data){...

    // Functions
    // ----------------------------------------------------------------------------
    
    // get coordinates based on map mouse click.
    // when a click event is detected ... 
    $rootScope.$on('clicked', function(){

        // Run the qservice functions associated with identifying coordinates
        $scope.$apply(function(){
            $scope.formData.latitude = parseFloat(gservice.clickLat).toFixed(3);
            $scope.formData.longitude = parseFloat(gservice.clickLong).toFixed(3);
            $scope.formData.htmlverified = "nope (thanks for spamming my map)";
        });

    }); // end $rootScope.on('clicked', function(){...

    // Creates a new user based on the form fields
    $scope.createUser = function() {

        // Grabs all of the text box fields
        var userData = {
            username: $scope.formData.username,
            gender: $scope.formData.gender,
            age: $scope.formData.age,
            favlang: $scope.formData.favlang,
            location: [$scope.formData.longitude, $scope.formData.latitude],
            htmlverified: $scope.formData.htmlverified
        };
        //save to fb
        //$scope.message = $firebaseArray(userData);
        //var fbData = new Firebase('https://fendi.firebaseio.com/');
        var fbData = new $firebase ('https://fendi.firebaseio.com/');
            $scope.message = $firebaseArray(fbData);

        //
        // Saves the user data to the db
        $http.post('/users', userData)
            .success(function (data) {

                // Once complete, clear the form (except location)
                $scope.formData.username = "";
                $scope.formData.gender = "";
                $scope.formData.age = "";
                $scope.formData.favlang = "";
                
                // Refresh the map with new data
                gservice.refresh($scope.formData.latitude, $scope.formData.longitude);

            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    };
});