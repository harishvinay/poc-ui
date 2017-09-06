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

require([
        'cloud-app-switcher',
        'jquery',
        'knockout',
        'text!data/navData.json',
        'navController'],
    function (SuiteComponents, $, ko, json, nav) {
        var data = JSON.parse(json);
        var switcher = SuiteComponents.getSwitcher();
        switcher.init('toggleNav', data);

        $('.hamburger').on('click', function () {
            $(document).trigger('toggleNav');
        });

        self.userName = 'weblogic';

        self.buttonDisplay = ko.pureComputed(function () {
            return true;
        });

        self.userMenuSelect = function (event, ui) {

        };

        self.helpMenuSelect = function (event, ui) {

        };

        ko.applyBindings();
    }
);