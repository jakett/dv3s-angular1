(function() {
    "use strict";
    
    angular.module('dlvwc.videoPanes.directives').directive('videoPanes', videoPanes);
    
    videoPanes.$inject = ["LISTENER_NAMES", "PanesFactory"];
    
    function videoPanes(listenerNames, PanesFactory) {
        return {
            scope: false,
            templateUrl: 'common/directives/videoPanes/videoPanes.html',
            controller: ctrFn
        };
        
        function ctrFn($scope) {
            $scope.displayTimeline = true;
            $scope.panelSlectedIndex = {};

            $scope.$watch(function() { return PanesFactory.getActiveSplitsIndex() }, resetFullPanelIndex);
            $scope.$watch(function() { return PanesFactory.getActivePaneIndex() }, resetFullPanelIndex);
            PanesFactory.subscribeEvent($scope, listenerNames.DISPLAY_TIMELINE, subscribeEventDisplayTimeline);
            PanesFactory.subscribeEvent($scope, listenerNames.FULL_SCREEN_PANNEL, displayFullPanel);
            

            /* ----------------- FUNCTION DETAIL ------------------- */
            
            function resetFullPanelIndex() {
                $scope.panelSlectedIndex = {};
            }

            function subscribeEventDisplayTimeline() {
                console.log("Go to subscribe display timeline");
                $scope.displayTimeline = !$scope.displayTimeline;
            }

            function displayFullPanel(event, data) {
                if ($scope.panelSlectedIndex.fullPanel === data ) {
                    $scope.panelSlectedIndex = {};
                } else {
                    $scope.panelSlectedIndex = {"fullPanel": data};
                }   
            }

            function resetFullpanel() {
                $scope.panelSlectedIndex = {};
            }

        }
    }
})();