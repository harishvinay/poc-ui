define(['ojs/ojcore', 'knockout', 
            'text!jet/templates/metadata_dialog_import_content.tmpl.html',
            'jet/templatesData/MetadataImportContentTemplateData'
], function (oj, ko, importDlgTemplate, importDlgData) {

    function headerViewModel() {
        var self = this;
        self.restURL = "/icsapis/v2/adapters";
        
        self.headerText = 'Adapters';
        self.headerButtons = [];
        
        // click action handlers
        self.importActionHandler = function(data, event) {
            //alert('Register Adapter...');
            var dialog = self.catalog().dialogGenerator().createDialog();
            var dlgData = importDlgData.getDefault();
            
            dlgData.title = 'Register Adapter';
            dlgData.dialogHelpTopicId = 'adapter_help_guid';
            dlgData.selectFilesText = 'Select Adapter File (.jar)';
            dlgData.acceptFileTypes = '.jar';
            dlgData.confirmFunction = self.importAdapter;
            dlgData.confirmButtonLabel = 'Register';
            
            dialog.setDialogTemplateContent(importDlgTemplate);
            dialog.setDialogData(dlgData);
            dialog.launch();                           
        };
        
        // create header buttons and set its actions
        self.headerButtons.push({
            "id": 'register_btn_id',
            "label": 'Register',
            "clickEventHandler": self.importActionHandler
        });
        
        self.importAdapter = function(data, event) {
            console.log("importAdapter : ", data);
            console.log("importAdapter file : ", data.getFile());
            var url = self.restURL + '/archive';
            
            //var token = self.getAuthorizationToken();
            var file = data.getFile();
            var fd = new FormData();
            
            fd.append('file', file);
            require(['jet/js/utils'],
                function (u) { 
                    $(function () {
                        u.importResource(url, fd, self);
                    });
                }
            );               
            self.catalog().closeCatalogDialog(data, event); // close the dialog           
            //self.catalog().refresh();            
        };           
    }
    
    return new headerViewModel;
});
