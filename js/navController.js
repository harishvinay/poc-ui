define([
        'ojs/ojcore',
        'knockout',
        'viewModels/dashboard',
        'ojs/ojrouter',
        'ojs/ojmodule',
        'ojs/ojmoduleanimations'
    ],
    function (oj, ko, dashboard) {

        var router = oj.Router.rootInstance;
        router.configure({
            'dashboard': {label: 'Dashboard', value: 'dashboard', isDefault: true},
            'integration': {label: 'Integration', value: 'integration'},
            'connections': {label: 'Connections', value: 'connections'},
            'libraries': {label: 'Libraries', value: 'libraries'}
        });

        oj.Router.defaults['urlAdapter'] = new oj.Router.urlParamAdapter();
        oj.Router.sync();

        function ViewModel() {
            var self = this;
            self.router = router;

            var viewModelFactory = function (router) {
                return {
                    createViewModel: function (params, valueAccessor) {
                        return Promise.resolve(dashboard);
                    }
                };
            };

            var switcher = function (context) {
                var params = ko.unwrap(context.valueAccessor()).params;
                return 'coverRight';
            };

            self.moduleConfig = ko.pureComputed(function () {
                return $.extend({}, self.router.moduleConfig, {
                    viewModelFactory: viewModelFactory(self.router),
                    animation: oj.ModuleAnimations.switcher(switcher)
                });
            });
        }

        return new ViewModel();
    }
);
