/**
 * header module
 */
define(['ojs/ojcore', 'knockout', 'text!jet/templates/metadata_dialog_import_content.tmpl.html', 'jet/templatesData/MetadataImportContentTemplateData', 'jet/js/utils'
], function (oj, ko, importDlgTemplate, importDlgData, utils) {
    /**
     * The view model for the main content view template
     */
    function headerViewModel() {
        var self = this;
        self.restURL = "/icsapis/v2/lookups";
        
        self.headerText = 'Lookups';
        self.headerButtons = [];
        
        var formData = new FormData();
        
        // click action handlers
        self.importActionHandler = function(data, event) {
            //alert('Import Lookup...');
            var dialog = self.catalog().dialogGenerator().createDialog();
            var dlgData = importDlgData.getDefault();
            
            dlgData.title = 'Import Lookup';
            dlgData.dialogHelpTopicId = 'lookup_help_guid';
            dlgData.selectFilesText = 'Select Lookup File (.csv)';
            dlgData.acceptFileTypes = '.csv';
            dlgData.confirmFunction = self.importLookup;
            dlgData.confirmButtonLabel = 'Import';
            
            dialog.setDialogTemplateContent(importDlgTemplate);
            dialog.setDialogData(dlgData);
            self.importCallback = self.replaceActionHandler; 
            dialog.launch();                          
        };
        self.createActionHandler = function(data, event) {
            alert('Create...');
        };        
        // create header buttons and set its actions
        self.headerButtons.push({
                    "id": 'import_btn_id',
                    "label": 'Import',
                    "clickEventHandler": self.importActionHandler
                    });
        self.headerButtons.push({
                    "id": 'create_btn_id',
                    "label": 'Create',
                    "clickEventHandler": self.createActionHandler
                    });                    
                    
        self.importLookup = function(data, event) {
            console.log("importLookup : ", data);
            console.log("importLookup file : ", data.getFile());
            var url = self.restURL + '/archive';
            
            //var token = self.getAuthorizationToken();
            var file = data.getFile();
            formData.set('file', file);
            
            utils.importResource(url, formData, self);     
            self.catalog().closeCatalogDialog(data, event); // close the dialog           
            //self.catalog().refresh();            
        };                
        
        self.replaceActionHandler = function() {
            //alert('Import and Replace Integration...');
            console.log("replaceActionHandler formData : ", formData);  
            var dialog = self.catalog().dialogGenerator().createDialog();

            var template = self.catalog().deleteConfirmContentTemplate();
            var dlgData = self.catalog().deleteConfirmContentTemplateData();
    
            dlgData.title = 'Import and Replace Lookup?';
            dlgData.metadata_name = formData.get('file').name;//MISSING API to get the name
            dlgData.confirmFunction = self.replaceLookup;
            dlgData.confirmButtonLabel = 'Import and Replace';
            
            dialog.setDialogTemplateContent(template);
            dialog.setDialogData(dlgData);
            
            dialog.launch();       

        };   
        
        self.replaceLookup = function(data, event) {
            console.log("replaceLookup : ", data);
            console.log("replaceLookup formData : ", formData);  
            var url = self.restURL + '/archive';
            
            utils.replaceResource(url, formData, self.catalog());
            
            self.catalog().closeCatalogDialog(data, event); // close the dialog
            //self.catalog().refresh();            
        };              
    }
    return new headerViewModel;
});
