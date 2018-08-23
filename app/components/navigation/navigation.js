(function() {
    'use strict';
    
    angular.module('app').component('navigation', {
        templateUrl: 'components/navigation/navigation.html',
        controller: NavigationController
    });
    
    NavigationController.$inject = ['PanesFactory', 'LISTENER_NAMES', '$scope'];
    
    function NavigationController(PanesFactory, listenerNames, $scope) {
        var navigation = angular.element(document.querySelector('.navigation-container'));
        
        PanesFactory.subscribeEvent($scope, listenerNames.DISPLAY_NAVIGATION, subscribeDisplayNavigation);
        
        /* -------------------- FUNCTIONS DETAIL -------------------- */
        
        function subscribeDisplayNavigation(event, showNavigation) {
            var marginLeft;
            if(showNavigation) {
                marginLeft = 0;
            } else {
                marginLeft = -250;
            }
            navigation.css({ 'margin-left': marginLeft + 'px' });
        }
    }
})();