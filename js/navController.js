define([
        'ojs/ojcore',
        'knockout',
        'cloud-app-switcher',
        'ojs/ojrouter',
        'ojs/ojmoduleanimations'
    ],
    function (oj, ko, SuiteComponents) {
        function ViewModel() {
            var self = this;

            self.switcher = SuiteComponents.getSwitcher();
            self.switcher.init('toggleNav', 'js/data/navData.json');

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

            var switcher = function (context) {
                var params = ko.unwrap(context.valueAccessor()).params;
                return 'coverRight';
            };

            self.router = oj.Router.rootInstance;
            self.router.configure({
                'dashboard': {label: 'Dashboard', value: 'dashboard', isDefault: true},
                'connections': {label: 'connections', value: 'connections'},
                'libraries': {label: 'libraries', value: 'libraries'}
            });
            oj.Router.defaults['urlAdapter'] = new oj.Router.urlParamAdapter();

            function mergeConfig(original) {
                return $.extend(true, {}, original, {
                    'animation': oj.ModuleAnimations.switcher(switcher)
                });
            }

            self.moduleConfig = mergeConfig(self.router.moduleConfig);

            // self.moduleConfig = ko.pureComputed(function () {
            //     return $.extend({}, self.router.moduleConfig, {
            //         animation: oj.ModuleAnimations.switcher(switcher)
            //     });
            // });

        }

        return new ViewModel();
    }
);
