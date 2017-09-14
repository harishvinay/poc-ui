define(['ojs/ojcore', 'knockout', 'jquery'],
    function (oj, ko, $) {

        function DashboardViewModel() {
            var self = this;

            self.name = 'ICS UI';
            self.subname = 'Dashboard';

        }

        return new DashboardViewModel();
    }
);
