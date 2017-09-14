/**
 * libraries module
 */
define(['ojs/ojcore', 'knockout', 
                    'metadata-list-component',
                    'jet/designer/libraries/js/viewModels/headerModel',
                    'jet/designer/libraries/js/viewModels/filterPanelModel',
                    'jet/designer/libraries/js/viewModels/listViewModel'
], function (oj, ko, Catalog, headerModel, filterPanelModel, listViewModel) {
    /**
     * The view model for the main content view template
     */
    function librariesContentViewModel(libraryContext) {
        var self = this;
        listViewModel.setLibraryContext(libraryContext);
        
        self.handleActivated = function(info) {
            self.catalog = Catalog.app.createInstance(headerModel, filterPanelModel, listViewModel, "Library");
        };

        self.handleAttached = function (info) {
            $(Catalog.catalogTemplate).appendTo($('#metadata-list-container'));
        };
        
        self.createView = function() {
            return Catalog.catalogTemplate;
        }    
        
    }
    
    return new librariesContentViewModel;
});
