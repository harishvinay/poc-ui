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
                    'jet/designer/integrations/js/viewModels/listViewModel'
], function (oj, ko, Catalog, headerModel, filterPanelModel, listViewModel) {
    /**
     * The view model for the main content view template
     */
    function integrationsContentViewModel() {
        var self = this;
        
        self.handleActivated = function(info) {
            self.catalog = Catalog.app.createInstance(headerModel, filterPanelModel, listViewModel, "Integration");
        }
        
        self.createView = function() {
            return Catalog.catalogTemplate;
        }            
    }
    
    return new integrationsContentViewModel;
});
