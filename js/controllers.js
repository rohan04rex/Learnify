app.controller('LoginCtrl', function ($scope, $location) {
    $scope.user = {};
    $scope.loginError = false;

    $scope.login = function () {
        if ($scope.loginForm.$valid) {
            // Mock authentication - in a real app, this would check against a backend
            if ($scope.user.email && $scope.user.password) {
                console.log("Logging in with", $scope.user);
                $location.path('/dashboard');
            } else {
                $scope.loginError = true;
            }
        } else {
            // Force validation display
            angular.forEach($scope.loginForm.$error, function (field) {
                angular.forEach(field, function (errorField) {
                    errorField.$setTouched();
                });
            });
        }
    };
});

app.controller('RegisterCtrl', function ($scope, $location) {
    $scope.user = {};

    $scope.register = function () {
        if ($scope.registerForm.$valid) {
            console.log("Registering user", $scope.user);
            // Mock successful registration
            $location.path('/login');
        } else {
            // Force validation display
            angular.forEach($scope.registerForm.$error, function (field) {
                angular.forEach(field, function (errorField) {
                    errorField.$setTouched();
                });
            });
        }
    };
});

app.controller('DashboardCtrl', function ($scope, $http) {
    $scope.courses = [];
    $scope.categories = ['All', 'Development', 'Data Science', 'Design UI/UX', 'Marketing', 'AI & Machine Learning', 'Business Strategy', 'Cyber Security', 'Personal Development'];
    $scope.categoryFilter = 'All';
    $scope.searchQuery = '';

    // Fetch courses from JSON
    $http.get('data/courses.json').then(function (response) {
        $scope.courses = response.data;
    }).catch(function (error) {
        console.error("Error loading courses data:", error);
    });

    // Custom filter function for categories
    $scope.filterByCategory = function (course) {
        if ($scope.categoryFilter === 'All') {
            return true;
        }
        return course.category === $scope.categoryFilter;
    };

    // Set Active Category
    $scope.setCategory = function (cat) {
        $scope.categoryFilter = cat;
    };
});
