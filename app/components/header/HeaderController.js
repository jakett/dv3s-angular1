(function () {
    'use strict';
    function HeaderController($scope, PanesFactory, AuthService, listenerNames) {
        let vmHeader= this;
        $scope.showNavigation = false;

        $scope.displayNavigation    = displayNavigation;
        vmHeader.currentPerson = AuthService.getCurrentPerson();
        vmHeader.logout = logout;

        /* -------------------- FUNCTION DETAILS -------------------- */

        function logout() {
          AuthService.logout();
        }

        function displayNavigation() {
            $scope.showNavigation = !$scope.showNavigation;
            PanesFactory.notifyEvent(listenerNames.DISPLAY_NAVIGATION, $scope.showNavigation);
        }
    }

    HeaderController.$inject = ['$scope', 'PanesFactory','AuthService', 'LISTENER_NAMES'];
    angular.module('app').controller('HeaderController', HeaderController);

})();
