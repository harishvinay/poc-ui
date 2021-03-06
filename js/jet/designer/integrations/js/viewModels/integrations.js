/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * integrations module
 */
define(['ojs/ojcore', 'knockout',
    'metadata-list-component',
    'jet/designer/integrations/js/viewModels/headerModel',
    'jet/designer/integrations/js/viewModels/filterPanelModel',
    'jet/designer/integrations/js/viewModels/listViewModel',
    'util/ServiceController'
], function (oj, ko, Catalog, headerModel, filterPanelModel, listViewModel, service) {
    /**
     * The view model for the main content view template
     */
    function integrationsContentViewModel() {
        var self = this;

        self.handleActivated = function (info) {
            self.catalog = Catalog.app.createInstance(headerModel, filterPanelModel, listViewModel, "Integration");
            self.fetchData(self.catalog);
        };

        self.fetchData = function (catalog) {
            service.get(listViewModel.restURL).then(
                function (res) {
                    listViewModel.response = res.data;
                    catalog.refresh();
                },
                function (err) {
                    console.log(err);
                }
            );
        };

        self.handleAttached = function (info) {
            $(Catalog.catalogTemplate).appendTo($('#metadata-list-container'));
        };

        self.createView = function () {
            return Catalog.catalogTemplate;
        }
    }

    return new integrationsContentViewModel;
});
