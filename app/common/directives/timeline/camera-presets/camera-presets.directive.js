(function() {
    "use strict";
    
    angular.module('dlvwc.timeline.directives').directive("tlCameraPresets", tlCameraPresets);
    
    tlCameraPresets.$inject = ["PanesFactory", "LISTENER_NAMES"];
    
    function tlCameraPresets(PanesFactory, listenerNames) {
        return {
            scope: false,
            templateUrl: "common/directives/timeline/camera-presets/camera-presets.html",
            controller: ctrlFn
        };
        
        function ctrlFn($scope) {
            
            /* ------------------------- HANDLE EVENT ----------------------- */
            
            PanesFactory.subscribeEvent($scope, listenerNames.OPEN_CAMERA_SELECT, subscribeOpenCameraSelect);
            
            /* ----------------------- FUNCTION DETAIL ---------------------- */
            
            function subscribeOpenCameraSelect(event, data, mode) {
                angular.element(document).ready(function() {
                    $scope.camList = PanesFactory.getCameraList();
                    $scope.camList1 = [];
                    for(var i = 0; i < 10; i++) {
                        $scope.camList1.push($scope.camList[i]);
                    }
                })
            }
        }
    }
})();