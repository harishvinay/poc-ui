'use strict';

requirejs.config(
    {
        baseUrl: 'js',

        paths:
            {
                'knockout': '../bower_components/knockout/dist/knockout.debug',
                'knockout-amd-helpers' : 'libs/knockout-amd-helpers/build/knockout-amd-helpers',
                'jquery': '../bower_components/jquery/dist/jquery',
                'jqueryui-amd': '../bower_components/jquery-ui/ui',
                'promise': '../node_modules/es6-promise/dist/es6-promise.min',
                'hammerjs': '../bower_components/hammerjs/hammer',
                'ojdnd': '../bower_components/oraclejet/dist/js/libs/dnd-polyfill/dnd-polyfill-1.0.0.js',
                'ojs': '../bower_components/oraclejet/dist/js/libs/oj/debug',
                'ojL10n': '../bower_components/oraclejet/dist/js/libs/oj/ojL10n',
                'ojtranslations': '../bower_components/oraclejet/dist/js/libs/oj/resources',
                'text': '../bower_components/text/text',
                'signals': '../bower_components/js-signals/dist/signals',
                'underscore': '../bower_components/underscore/underscore',
                'metadata-list-component': 'libs/metadata-list-component/metadata-list-component-noDeps',
                'cloud-app-switcher': 'libs/cloud-app-switcher/cloud-app-switcher'
            },
        shim:
            {
                'jquery':
                    {
                        exports: ['jQuery', '$']
                    }
            },
        config: {
            ojL10n: {
                merge: {
                    'ojtranslations/nls/ojtranslations': 'resources/nls/translations'
                }
            }
        },
        waitSeconds: 0
    }
);

require([
        'jquery',
        'knockout',
        'navController',
        'ojs/ojknockout',
        'ojs/ojmodule',
        'ojs/ojrouter'
    ],
    function ($, ko, nav) {

        $(function () {
            console.log("Rendering UI...");
            oj.Router.sync().then(
                function () {
                    ko.applyBindings(nav, document.getElementById('globalBody'));
                },
                function (error) {
                    oj.Logger.error('Error in root start: ' + error.message);
                }
            );
        });
    }
);