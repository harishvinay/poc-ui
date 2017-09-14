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
                    'jet/settings/certificates/js/viewModels/headerModel',
                    'jet/settings/certificates/js/viewModels/filterPanelModel',
                    'jet/settings/certificates/js/viewModels/listViewModel'
], function (oj, ko, Catalog, headerModel, filterPanelModel, listViewModel) {
    /**
     * The view model for the main content view template
     */
    function certificatesContentViewModel() {
        var self = this;
        
        self.handleActivated = function(info) {
            self.catalog = Catalog.app.createInstance(headerModel, filterPanelModel, listViewModel, "Certificate");
        }
        
        self.createView = function() {
            return Catalog.catalogTemplate;
        }    
        
    }
    
    return new certificatesContentViewModel;
});
