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
                    'jet/designer/lookups/js/viewModels/headerModel',
                    'jet/designer/lookups/js/viewModels/filterPanelModel',
                    'jet/designer/lookups/js/viewModels/listViewModel'
], function (oj, ko, Catalog, headerModel, filterPanelModel, listViewModel) {
    /**
     * The view model for the main content view template
     */
    function lookupsContentViewModel() {
        var self = this;
        
        self.handleActivated = function(info) {
            self.catalog = Catalog.app.createInstance(headerModel, filterPanelModel, listViewModel, "Lookup");
        }
        
        self.createView = function() {
            return Catalog.catalogTemplate;
        }    
        
    }
    
    return new lookupsContentViewModel;
});
