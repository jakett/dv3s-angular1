(function() {
    'use strict';

    function config($stateProvider, $locationProvider, $urlRouterProvider, $translateProvider, cfpLoadingBarProvider, $qProvider, tmhDynamicLocaleProvider) {
        $translateProvider.useSanitizeValueStrategy("sanitize");
        $translateProvider
            .registerAvailableLanguageKeys(['en', 'de'], {
                'en_US': 'en',
                'en_UK': 'en',
                'de_DE': 'de',
                'de_CH': 'de'
            })
            .determinePreferredLanguage()
            .useStaticFilesLoader({
                prefix: 'locales/',
                suffix: '/translation.json'
            });
        tmhDynamicLocaleProvider.localeLocationPattern("/bower_components/angular-i18n/angular-locale_{{locale}}.js");

        $locationProvider
            .html5Mode({
                enabled: false,
                requireBase: false
            })
            .hashPrefix('');

        $stateProvider
        .state('root', {
            url: '',
            abstract: true,
            views: {
                'header': {
                    templateUrl: 'components/header/header.html',
                    controller: 'HeaderController',
                    controllerAs: 'vmHeader'
                }
            },
            resolve: {
                userProfile : setUserProfile,
                serverConfig: serverConfig
            }
        })

        .state({
            name: 'root.surveillance',
            url: '/surveillance',
            views: {
                'content@': {
                    templateUrl: 'components/surveillance/surveillance.html',
                    controller: 'SurveillanceController',
                    controllerAs: 'vmSurveillance'
                }
            }
        })
        /*.state({
          name: 'root.inbox',
          url: '/inbox',
          views: {
            'content@': {
              templateUrl: 'components/inbox/inbox.html',
              controller: 'InboxController',
              controllerAs: 'vmInbox'
            }
          }
        })*/

        .state({
            name: 'root.setting',
            url: '/setting',
            views: {
                'content@': {
                    templateUrl: 'components/setting/setting.html',
                    controller: 'SettingController',
                    controllerAs: 'vmSetting'
                }
            }
        })
        //$state.go('root.surveillance');
        $urlRouterProvider.otherwise('/surveillance');
        cfpLoadingBarProvider.includeSpinner = false;
        $qProvider.errorOnUnhandledRejections(false);
    }

    function setUserProfile(AuthService, $translate, tmhDynamicLocale, $filter) {
        //    AuthService.setCurrentPerson(currentPerson);
        //    currentPersonPermissions = AuthService.setCurrentPersonPermissions(currentPerson.authGroups);
        //    $translate.use(preferedLanguage);
        //    tmhDynamicLocale.set(preferedLanguage);
    };
    
    function serverConfig(UtilFactory, URLS) {
        var originUrl;
        var signalingUrl;
        if(UtilFactory.getDeviceInfo().indexOf('Electron') !== -1) {
            originUrl = URLS.BACKEND_URL_ELECTRON;
            signalingUrl = URLS.SIGNALING_URL_DEFAULT;
        } else {
            originUrl = URLS.BACKEND_URL_WEB;
            signalingUrl = '';
        }
        UtilFactory.setOriginUrl(originUrl);
        UtilFactory.setSignalingUrl(signalingUrl);
    }

    config.$inject = ['$stateProvider', '$locationProvider', '$urlRouterProvider', '$translateProvider', 'cfpLoadingBarProvider', '$qProvider', 'tmhDynamicLocaleProvider'];
    angular.module('app').config(config);
})();
