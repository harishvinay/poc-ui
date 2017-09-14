/**
 * header module
 */
define(['ojs/ojcore', 'knockout', 
            'text!jet/templates/metadata_dialog_import_content.tmpl.html',
            'jet/templatesData/MetadataImportContentTemplateData', 'text!jet/designer/integrations/js/views/selectDialog.html', 
            'jet/designer/integrations/js/views/selectDialog', 'jet/js/utils'
], function (oj, ko, importDlgTemplate, importDlgData, selectDialog, selectDialogData, utils) {
    /**
     * The view model for the main content view template
     */
    function headerViewModel() {
        var self = this;
        self.restURL = "/icsapis/v2/integrations";
        
        self.headerText = 'Integrations';
        self.headerButtons = [];
        
        var formData = new FormData();
        
     
        // click action handlers
        self.createActionHandler = function(data, event) {
            alert('Create Integration...');
            /*
            console.log("createActionHandler data : ", data);
            var dialog = self.catalog().dialogGenerator().createDialog();
            var dlgData = selectDialogData.getDefault();

            dlgData.confirmFunction = self.selectPattern;  
            dialog.setDialogTemplateContent(selectDialog);
            dialog.setDialogData(dlgData);
           
            dialog.launch();                   
            */
        };
        self.selectPattern = function(data, event) {
        console.log("selectPattern data : ", data);
        };
        self.importActionHandler = function(data, event) {
            //alert('Import Integration...');
            var dialog = self.catalog().dialogGenerator().createDialog();
            var dlgData = importDlgData.getDefault();
            
            dlgData.title = 'Import Integration';
            dlgData.dialogHelpTopicId = 'integration_help_guid';
            dlgData.selectFilesText = 'Select Integration File (.iar)';
            dlgData.acceptFileTypes = '.iar';
            dlgData.importMessage = 'Exported integration does not contain connection credentials. You may provide this data before activating the integration.';
            dlgData.confirmFunction = self.importIntegration;
            dlgData.confirmButtonLabel = 'Import';
            
            dialog.setDialogTemplateContent(importDlgTemplate);
            dialog.setDialogData(dlgData);
            
            //self.importCallback = self.replaceActionHandler;             
            dialog.launch();              
        };
        
        self.importIntegration = function(data, event) {
            console.log("importIntegration data : ", data);
            console.log("importIntegration event : ", event);
            console.log("importIntegration file : ", data.getFile());
            
            
            var url = self.restURL + '/archive';
            
            //var token = self.getAuthorizationToken();
            var file = data.getFile();
            formData.set('file', file);
            //formData.append('file', file);
            
            self.catalog().serverCommunicationHandler().postData(url, {}, formData, false, false, "multipart/form-data", self.importIntegrationCallback);            
  
        };
        
        self.importIntegrationCallback = function(response) {
            console.log("importIntegrationCallback response : ", response);           
            
            self.catalog().closeCatalogDialog();
            
            if (response) {
                if (response.status == 409) {
                    self.replaceActionHandler();
                }
            }
            //assume success NO RESPONSE with 204
            if (! response || (response && response.status > 199 && response.status < 299)) {
                self.catalog().refresh();   
            }
        };        
        
        self.replaceActionHandler = function() {
            //alert('Import and Replace Integration...');
            console.log("replaceActionHandler formData file : ", formData.get('file'));  
            var dialog = self.catalog().dialogGenerator().createDialog();

            var template = self.catalog().deleteConfirmContentTemplate();
            var dlgData = self.catalog().deleteConfirmContentTemplateData();
    
            dlgData.title = 'Import and Replace Integration?';
            dlgData.metadata_name = formData.get('file').name;//MISSING API to get the name
            dlgData.confirmFunction = self.replaceIntegration;
            dlgData.confirmButtonLabel = 'Import and Replace';
            
            dialog.setDialogTemplateContent(template);
            dialog.setDialogData(dlgData);
            
            dialog.launch();       

        };        
        
        self.replaceIntegration = function(data, event) {
            console.log("replaceIntegration : ", data);
            console.log("replaceIntegration formData file : ", formData.get('file'));  
            var url = self.restURL + '/archive';
            
            //var token = self.getAuthorizationToken();
            //var fd = data.fd;
            //var response = self.catalog().serverCommunicationHandler().putData(url, {}, formData); //NOT WORKING  
            //console.log("replaceIntegration response : ", response);
            utils.replaceResource(url, formData, self.catalog());

            self.catalog().closeCatalogDialog(data, event); // close the dialog
            //self.catalog().refresh();            
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
    }
    
   
    return new headerViewModel;
});
