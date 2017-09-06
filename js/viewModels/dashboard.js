define(['ojs/ojcore', 'knockout', 'jquery'],
    function (oj, ko, $) {

        function DashboardViewModel() {
            var self = this;

            self.name = 'ICS Dashboard';

        }

        return new DashboardViewModel();
    }
);
