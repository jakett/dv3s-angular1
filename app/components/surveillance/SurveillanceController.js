(function() {
    'use strict';

    angular.module('app').controller('SurveillanceController', SurveillanceController);

    SurveillanceController.$inject = ["$scope", "PanesFactory", "LISTENER_NAMES", "$window", "$timeout", "ApiFactory", "TYPE_MESSAGES", "SocketService", "SettingFactory"];

    function SurveillanceController($scope, PanesFactory, listenerNames, $window, $timeout, ApiFactory, typeMessages, SocketService, SettingFactory) {

        var activeSplitsIndex = PanesFactory.getActiveSplitsIndex();
        var controlId = null;

        $scope.activeSplitsIndex        = PanesFactory.getActiveSplitsIndex();
        $scope.showSplitsPresets        = false;
        $scope.showCameraListPopup      = false;
        $scope.showSurveillanceSearch   = false;
        $scope.activeSettingKeyboard    = false;
        $scope.keyboardToggle           = true;
        $scope.splitVideoPanes          = [];
        $scope.showInfoMenuPopup = false;
        $scope.isVideoMounted = false;


        /* ---------------- HANDLE EVENT ---------------- */

        responseActiveSplit();
        pressKeyboard();


        $scope.displaySurveillanceSearch    = displaySurveillanceSearch;
        $scope.optionSettingKeyboard        = optionSettingKeyboard;
        $scope.changeActiveSplits           = changeActiveSplits;
        $scope.showMenuInfo = showMenuInfo;

        $scope.$watch(function() { return PanesFactory.getActiveSplitsIndex(); }, watchActiveSplitsIndex);
        $scope.$watch(function() { return $scope.showSplitsPresets || $scope.showCameraListPopup  }, watchKeyboardToggle);

        $scope.$watch(function() { return PanesFactory.getVideoMounted();  }, checkAtleastOneExistedVideo);


        PanesFactory.subscribeEvent($scope, listenerNames.SHOW_CAMERA_LIST, subscribeDisplayCameraList);
        PanesFactory.subscribeEvent($scope, listenerNames.CLOSE_OPTION_KEYBOARD, closeOptionKeyboard);
        PanesFactory.subscribeEvent($scope, listenerNames.UPDATE_SPLIT, subscribeUpdateSplit);
        PanesFactory.subscribeEvent($scope, listenerNames.KEYBOARD_TOGGLE, subscribeKeyboardToggle);

        angular.element($window).bind('resize', responseActiveSplit);

        /* --------------------------------------- FUNCTION DETAILS ----------------------------------- */
        function checkAtleastOneExistedVideo(newVal, oldVal) {
          if (newVal !== oldVal) {
            $scope.isVideoMounted = newVal
          }
        }

        function showMenuInfo() {
          PanesFactory.notifyEvent(listenerNames.GET_MENU_INFO_DATA, {});
          $scope.showInfoMenuPopup = true;
        }

        function watchKeyboardToggle(newVal, oldVal) {
            if (newVal !== oldVal) { subscribeKeyboardToggle(); }
        }

        function subscribeKeyboardToggle() {
            $scope.keyboardToggle = !$scope.keyboardToggle;
            pressKeyboard()
        }

        function pressKeyboard() {
            SettingFactory.pressKeyBoard($scope.keyboardToggle);
        }

        function displaySurveillanceSearch() {
            $scope.showSurveillanceSearch = !$scope.showSurveillanceSearch;
            PanesFactory.notifyEvent(listenerNames.DISPLAY_SURVEILLANCE_SEARCH, $scope.showSurveillanceSearch);
            SettingFactory.keyboardToggle();
        }

        function responseActiveSplit() {
            PanesFactory.notifyEvent(listenerNames.CHANGE_WIDTH_TIME_LINE);
            var index;
            var width = $window.innerWidth;

            $scope.splitsPresets = [];

            if(width <= 1024) {
                index = 0;
                $scope.splitsPresets.push(PanesFactory.getSplitsPresets()[0]);
            } else {
                index = activeSplitsIndex;
                $scope.splitsPresets = PanesFactory.getSplitsPresets();
            }
            $scope.activeSplitsIndex = index;
            PanesFactory.setActiveSplitsIndex(index);
        }

        function subscribeUpdateSplit(event, data) {
            var splitIdx = data.data;
            if(splitIdx !== $scope.activeSplitsIndex) {
                controlId = data.controlId;
                changeActiveSplits(splitIdx);
            }
        }

        function changeActiveSplits ( index ) {
            activeSplitsIndex = index;
            $scope.activeSplitsIndex = index;
            PanesFactory.setActiveSplitsIndex(index);
        }

        function watchActiveSplitsIndex(newIndex, oldIndex) {
            $scope.splitVideoPanes = PanesFactory.getActiveSplit();
            PanesFactory.disconnectVideoSplit(oldIndex);
            PanesFactory.setActivePaneIndex(0);
            PanesFactory.notifyEvent(listenerNames.DISCONNECT_STREAM);

            handleUpdateSplit(controlId, newIndex);
            controlId = null;
        }

        function handleUpdateSplit(controlId, idx) {
            var object = {};
            object.splitIdx = idx;
            object.paneIdx = 0

            SocketService.sendPeerToPeer(controlId, typeMessages.UPDATE_SPLIT, object);
        }

        function subscribeDisplayCameraList(event, isShowCameraList) {
            $scope.showCameraListPopup = isShowCameraList;
        }

        function closeOptionKeyboard() {
            $scope.activeSettingKeyboard = false;
        }

        function optionSettingKeyboard() {
            $scope.activeSettingKeyboard = ! $scope.activeSettingKeyboard;
            PanesFactory.notifyEvent(listenerNames.SHOW_OPTIONS_SETTING_KEYBOARD);
        }
    }
})();
