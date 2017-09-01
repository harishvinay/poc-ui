define(['ojs/ojcore', 'knockout', 'ojs/ojrouter', 'ojs/ojknockout', 'ojs/ojarraytabledatasource'],
    function (oj, ko) {
        function ControllerViewModel() {
            var self = this;

            var smQuery = oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
            self.smScreen = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);

            self.router = oj.Router.rootInstance;
            self.router.configure({
                'dashboard': {label: 'Dashboard', isDefault: true},
                'integration': {label: 'Integration'},
                'connections': {label: 'Connections'},
                'libraries': {label: 'Libraries'}
            });
            oj.Router.defaults['urlAdapter'] = new oj.Router.urlParamAdapter();

            var navData = [
                {
                    name: 'Dashboard', id: 'dashboard',
                    iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-chart-icon-24'
                },
                {
                    name: 'Integration', id: 'integration',
                    iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-fire-icon-24'
                },
                {
                    name: 'Libraries', id: 'libraries',
                    iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-info-icon-24'
                },
                {
                    name: 'Connections', id: 'connections',
                    iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-people-icon-24'
                }
            ];
            self.navDataSource = new oj.ArrayTableDataSource(navData, {idAttribute: 'id'});

            self.appName = ko.observable("Integration Cloud Service");
            self.userLogin = ko.observable("Weblogic");

            function footerLink(name, id, linkTarget) {
                this.name = name;
                this.linkId = id;
                this.linkTarget = linkTarget;
            }

            self.footerLinks = ko.observableArray([
                new footerLink('About Oracle', 'aboutOracle', 'http://www.oracle.com/us/corporate/index.html#menu-about'),
                new footerLink('Contact Us', 'contactUs', 'http://www.oracle.com/us/corporate/contact/index.html'),
                new footerLink('Legal Notices', 'legalNotices', 'http://www.oracle.com/us/legal/index.html'),
                new footerLink('Terms Of Use', 'termsOfUse', 'http://www.oracle.com/us/legal/terms/index.html'),
                new footerLink('Your Privacy Rights', 'yourPrivacyRights', 'http://www.oracle.com/us/legal/privacy/index.html')
            ]);
        }

        return new ControllerViewModel();
    }
);
