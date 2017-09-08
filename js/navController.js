define([
        'ojs/ojcore',
        'knockout',
        'cloud-app-switcher',
        'text!data/navData.json',
        'ojs/ojrouter'
    ],
    function (oj, ko, SuiteComponents, json) {
        function ViewModel() {
            var self = this;

            var data = JSON.parse(json);
            self.switcher = SuiteComponents.getSwitcher();
            self.switcher.init('toggleNav', data);

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

            self.router = oj.Router.rootInstance;
            self.router.configure({
                'dashboard': {label: 'Dashboard', value: 'dashboard', isDefault: true},
                'connections': {label: 'connections', value: 'connections'},
                'libraries': {label: 'libraries', value: 'libraries'}});
            oj.Router.defaults['urlAdapter'] = new oj.Router.urlParamAdapter();


        }

        return new ViewModel();
    }
);
