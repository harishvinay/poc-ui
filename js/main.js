'use strict';

requirejs.config(
    {
        baseUrl: 'js',

        paths:
            {
                'knockout': '../bower_components/knockout/dist/knockout.debug',
                'jquery': '../bower_components/jquery/dist/jquery',
                'jqueryui-amd': '../bower_components/jquery-ui/ui',
                'promise': '../bower_components/es6-promise/promise',
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

require(['ojs/ojcore', 'knockout', 'appController', 'ojs/ojknockout',
        'ojs/ojmodule', 'ojs/ojrouter', 'ojs/ojnavigationlist', 'ojs/ojbutton', 'ojs/ojtoolbar'],
    function (oj, ko, app) {
        $(function () {
            function init() {
                oj.Router.sync().then(
                    function () {
                        ko.applyBindings(app, document.getElementById('globalBody'));
                    },
                    function (error) {
                        oj.Logger.error('Error in root start: ' + error.message);
                    }
                );
            }

            if ($(document.body).hasClass('oj-hybrid')) {
                document.addEventListener("deviceready", init);
            } else {
                init();
            }
        });
    }
);