/**
 * header module
 */
define(['ojs/ojcore', 'knockout',
                        'text!jet/templates/library_register_content.tmpl.html',
                        'jet/templatesData/LibraryRegisterContentTemplateData'
], function (oj, ko, registerDlgTemplate, registerDlgData) {
    /**
     * The view model for the main content view template
     */
    function headerViewModel() {
        var self = this;
        
        var newRegisteredLibrary = {};
        
        self.headerText = 'Libraries';
        self.headerButtons = [];
        
        self.registerLibraryCallback = function(response) {
            var version = newRegisteredLibrary.getLibraryVersion();
            var code = newRegisteredLibrary.getLibraryIdentifier();

            getLibraryCatalog().code(code);
            getLibraryCatalog().version(version);
            getLibraryCatalog().mode("EDIT_MODE");
            getLibraryCatalog().currentModule('libraryMetadata');            
            
            self.catalog().closeCatalogDialog();
            
            newRegisteredLibrary = {};
        };
        
        self.registerLibrary = function(data, event) {
            var formData = new FormData();
            formData.append('file', data.getFile());
            formData.append('name', data.getLibraryName());
            formData.append('version', data.getLibraryVersion());
            formData.append('type', 'API');
            formData.append('description', data.getLibraryDesc());
            newRegisteredLibrary = $.extend({}, data);  // copy to navigate into details page.
            self.catalog().serverCommunicationHandler().postData("/icsapis/v2/libraries/archive", {}, formData, false, false, "multipart/form-data", self.registerLibraryCallback);
        };        
        
        // Register button - click action handler
        self.registerActionHandler = function(data, event) {
            var dlgData = registerDlgData.getDefault(self.catalog().util());
            var template = registerDlgTemplate;
            var dialog = self.catalog().dialogGenerator().createDialog();

            dlgData.title = 'Register Library';
            dlgData.dialogHelpTopicId = 'help_guid';
            dlgData.selectFilesText = 'Select Library File (.js/.jar)';
            dlgData.acceptFileTypes = '.jar,.js';
            dlgData.confirmFunction = self.registerLibrary;

            dialog.setDialogTemplateContent(template);
            dialog.setDialogData(dlgData);
            dialog.launch();            
        };
        
        // create header buttons and its actions
        self.headerButtons.push({
                    "id": 'register_btn_id',
                    "label": 'Register',
                    "clickEventHandler": self.registerActionHandler
                    });

    }
    
    return new headerViewModel;
});


