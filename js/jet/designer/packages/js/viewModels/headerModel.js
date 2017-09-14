/**
 * header module
 */
define(['ojs/ojcore', 'knockout', 
            'text!jet/templates/metadata_dialog_import_content.tmpl.html', 'jet/templatesData/MetadataImportContentTemplateData', 'jet/js/utils'
], function (oj, ko, importDlgTemplate, importDlgData, utils) {
    /**
     * The view model for the main content view template
     */
    function headerViewModel() {
        var self = this;
        self.restURL = "/icsapis/v2/packages";
        
        self.headerText = 'Packages';
        self.headerButtons = [];
        
        var formData = new FormData();
        
        // click action handlers
        self.importActionHandler = function(data, event) {
            //alert('Import Package...');
            var dialog = self.catalog().dialogGenerator().createDialog();
            var dlgData = importDlgData.getDefault();
            
            dlgData.title = 'Import Package';
            dlgData.dialogHelpTopicId = 'package_help_guid';
            dlgData.selectFilesText = 'Select Package File (.par)';
            dlgData.acceptFileTypes = '.par';
            dlgData.importMessage = 'Integrations in an exported package do not contain connection credentials. You may provide this data before activating the integrations.';
            dlgData.confirmFunction = self.importPackage;
            dlgData.confirmButtonLabel = 'Import';
            
            dialog.setDialogTemplateContent(importDlgTemplate);
            dialog.setDialogData(dlgData);
            self.importCallback = self.replaceActionHandler;
            dialog.launch();               
        };
        
        // create header buttons and set its actions
        self.headerButtons.push({
                    "id": 'import_btn_id',
                    "label": 'Import',
                    "clickEventHandler": self.importActionHandler
                    });
                    
        self.importPackage = function(data, event) {
            console.log("importPackage : ", data);
            console.log("importPackage file : ", data.getFile());
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
    
            dlgData.title = 'Import and Replace Package?';
            dlgData.metadata_name = formData.get('file').name;//MISSING API to get the name
            dlgData.confirmFunction = self.replacePackage;
            dlgData.confirmButtonLabel = 'Import and Replace';
            //A package with the same name and version already exists. It will be replaced when the new package zzz is imported. Existing integrations with the same name and version which are included in the new package will be overwritten and moved into the new package.
            dialog.setDialogTemplateContent(template);
            dialog.setDialogData(dlgData);
            
            dialog.launch();       

        };        
        
        self.replacePackage = function(data, event) {
            console.log("replacePackage : ", data);
            console.log("replacePackage formData : ", formData);  
            var url = self.restURL + '/archive';
            
            utils.replaceResource(url, formData, self.catalog());
            
            self.catalog().closeCatalogDialog(data, event); // close the dialog
            //self.catalog().refresh();            
        };          
    }
    return new headerViewModel;
});
