/**
 * Created by Vladimir Deminenko on 23.10.2016.
 */

(function () {
    'use strict';

    angular.module('public')
        .controller('SignUpController', SignUpController);

    SignUpController.$inject = ['$timeout', '$scope', 'MenuService', 'SignUpService', 'MENU_NOT_EXISTS_MESSAGE', 'INFO_SAVED_MESSAGE'];
    function SignUpController($timeout, $scope, MenuService, SignUpService, MENU_NOT_EXISTS_MESSAGE, INFO_SAVED_MESSAGE) {
        var $ctrl = this;
        var service = SignUpService;
        $ctrl.data = {};
        $ctrl.isChecked = false;

        $ctrl.signUp = function () {
            $ctrl.data.firstName = $ctrl.firstLetterToUpperCase($ctrl.data.firstName);
            $ctrl.data.lastName = $ctrl.firstLetterToUpperCase($ctrl.data.lastName);

            $ctrl.checkData();
        }

        $ctrl.checkData = function () {
            $ctrl.isChecked = false;
            $ctrl.isSignedUp = true;
            var dish = $ctrl.data.favoriteDish;

            if (!dish) {
                service.putSignUpData($ctrl.data);
                $ctrl.data = {};
                $ctrl.data.message = INFO_SAVED_MESSAGE;
                $scope.signupForm.$setPristine();
                $ctrl.isChecked = true;

                return;
            }

            MenuService.existsDish(dish).then(function (valid) {
                if (valid) {
                    $timeout(function () {
                        service.putSignUpData($ctrl.data);
                        $ctrl.data = {};
                        $ctrl.data.message = INFO_SAVED_MESSAGE;
                        $scope.signupForm.$setPristine();
                        $ctrl.isChecked = true;
                    });
                }
                else {
                    $ctrl.data.message = MENU_NOT_EXISTS_MESSAGE;
                    $ctrl.isSignedUp = false;
                    $ctrl.isChecked = true;
                }
            })
        }

        $scope.$watch('ctrl.data.email', function () {
            if ($scope.ctrl.data.email) {
                $scope.ctrl.data.email = $scope.ctrl.data.email.toLowerCase();
            }
        });

        $scope.$watch('ctrl.data.favoriteDish', function () {
            if ($scope.ctrl.data.favoriteDish) {
                $scope.ctrl.data.favoriteDish = $scope.ctrl.data.favoriteDish.toUpperCase();
            }
        });

        $ctrl.firstLetterToUpperCase = function (data) {
            if (data) {
                var tmp = data.toLowerCase();
                tmp = tmp.substring(0, 1).toUpperCase() + tmp.substring(1);

                return tmp;
            }
            else {
                return data;
            }
        }
    }
})();
