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
                    'jet/settings/users/js/viewModels/headerModel',
                    'jet/settings/users/js/viewModels/filterPanelModel',
                    'jet/settings/users/js/viewModels/listViewModel'
], function (oj, ko, Catalog, headerModel, filterPanelModel, listViewModel) {
    /**
     * The view model for the main content view template
     */
    function usersContentViewModel() {
        var self = this;
        
        self.handleActivated = function(info) {
            self.catalog = Catalog.app.createInstance(headerModel, filterPanelModel, listViewModel, "User");
        }
        
        self.createView = function() {
            return Catalog.catalogTemplate;
        }    
        
    }
    
    return new usersContentViewModel;
});
