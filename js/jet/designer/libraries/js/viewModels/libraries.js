/**
 * libraries module
 */
define(['ojs/ojcore', 'knockout', 
                    'metadata-list-component',
                    'jet/designer/libraries/js/viewModels/headerModel',
                    'jet/designer/libraries/js/viewModels/filterPanelModel',
                    'jet/designer/libraries/js/viewModels/listViewModel',
                    'util/ServiceController'
], function (oj, ko, Catalog, headerModel, filterPanelModel, listViewModel, service) {
    /**
     * The view model for the main content view template
     */
    function librariesContentViewModel(libraryContext) {
        var self = this;
        listViewModel.setLibraryContext(libraryContext);
        
        self.handleActivated = function(info) {
            self.catalog = Catalog.app.createInstance(headerModel, filterPanelModel, listViewModel, "Library");
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
        
        self.createView = function() {
            return Catalog.catalogTemplate;
        }    
        
    }
    
    return new librariesContentViewModel;
});
