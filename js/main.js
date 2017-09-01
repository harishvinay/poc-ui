'use strict';

requirejs.config(
    {
        baseUrl: 'js',

        paths:
            {
                'knockout': '../node_modules/knockout/build/output/knockout-latest.debug',
                'jquery': '../node_modules/jquery/dist/jquery',
                'jqueryui-amd': '../node_modules/jquery-ui/ui',
                'promise': '../node_modules/es6-promise/dist/es6-promise',
                'hammerjs': '../node_modules/hammerjs/hammer',
                'ojdnd': '../node_modules/oraclejet/dist/js/libs/dnd-polyfill/dnd-polyfill-1.0.0',
                'ojs': '../node_modules/oraclejet/dist/js/libs/oj/debug',
                'ojL10n': '../node_modules/oraclejet/dist/js/libs/oj/ojL10n',
                'ojtranslations': '../node_modules/oraclejet/dist/js/libs/oj/resources',
                'text': '../node_modules/requirejs-text/text',
                'signals': '../node_modules/signals/dist/signals',
                'customElements': '../node_modules/oraclejet/dist/js/libs/webcomponents/CustomElements',
                'underscore': '../node_modules/underscore/underscore-min',
                'metadata-list-component': 'libs/metadata-list-component/metadata-list-component-noDeps'
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