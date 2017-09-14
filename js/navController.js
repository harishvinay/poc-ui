define([
        'ojs/ojcore',
        'knockout',
        'cloud-app-switcher',
        'viewModels/dashboard',
        'jet/designer/integrations/js/viewModels/integrations',
        'jet/designer/connections/js/viewModels/connections',
        'jet/designer/adapters/js/viewModels/adapters',
        'jet/designer/agents/js/viewModels/agents',
        'jet/designer/lookups/js/viewModels/lookups',
        'jet/designer/packages/js/viewModels/packages',
        'jet/designer/libraries/js/viewModels/libraries',
        'ojs/ojrouter',
        'ojs/ojmoduleanimations'
    ],
    function (oj, ko, SuiteComponents, dashboard, integrations, connections, adapters, agents, lookups, packages, libraries) {
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

            var viewModelFactory = function (router) {
                return {
                    createViewModel: function (params, valueAccessor) {
                        var state = router.params.ojRouter.parentRouter.currentState().id;
                        if (state === 'dashboard')
                            return Promise.resolve(dashboard);
                        else if (state === 'integration')
                            return Promise.resolve(integrations);
                        else if (state === 'connections')
                            return Promise.resolve(connections);
                        else if (state === 'lookups')
                            return Promise.resolve(lookups);
                        else if (state === 'packages')
                            return Promise.resolve(packages);
                        else if (state === 'agents')
                            return Promise.resolve(agents);
                        else if (state === 'adapters')
                            return Promise.resolve(adapters);
                        else if (state === 'libraries')
                            return Promise.resolve(libraries);
                    }
                };
            };

            self.router = oj.Router.rootInstance;
            self.router.configure({
                'dashboard': {label: 'Dashboard', value: 'dashboard', isDefault: true},
                'integration': {label: 'integration', value: 'integration'},
                'connections': {label: 'connections', value: 'connections'},
                'adapters': {label: 'adapters', value: 'adapters'},
                'agents': {label: 'agents', value: 'agents'},
                'lookups': {label: 'lookups', value: 'lookups'},
                'packages': {label: 'packages', value: 'packages'},
                'libraries': {label: 'libraries', value: 'libraries'}
            });
            oj.Router.defaults['urlAdapter'] = new oj.Router.urlParamAdapter();

            function mergeConfig(original) {
                return $.extend(true, {}, original, {
                    'viewModelFactory': viewModelFactory(original),
                    'animation': oj.ModuleAnimations.switcher(switcher)
                });
            }

            self.moduleConfig = mergeConfig(self.router.moduleConfig);

            var NavEventHandler = function (event, properties) {
                self.router.go(properties.extraData);
            };
            $(document).on('icsNavEvent', NavEventHandler);

            // self.moduleConfig = ko.pureComputed(function () {
            //     return $.extend({}, self.router.moduleConfig, {
            //         animation: oj.ModuleAnimations.switcher(switcher)
            //     });
            // });

        }

        return new ViewModel();
    }
);
