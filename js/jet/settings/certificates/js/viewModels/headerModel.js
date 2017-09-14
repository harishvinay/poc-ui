/**
 * header module
 */
define(['ojs/ojcore', 'knockout', 'text!jet/settings/certificates/js/views/uploadDialog.html', 'jet/settings/certificates/js/views/uploadDialog'
], function (oj, ko, uploadDialog, uploadDialogData) {
    /**
     * The view model for the main content view template
     */
    function headerViewModel() {
        var self = this;
        self.restURL = "/icsapis/v2/certificates";
        
        self.headerText = 'Certificates';
        self.headerButtons = [];
        
        // click action handlers
        self.importActionHandler = function(data, event) {
            //alert('Upload Certificate...');
            var dialog = self.catalog().dialogGenerator().createDialog();
            var dlgData = uploadDialogData.getDefault();
            dlgData.confirmFunction = self.registerCertificate;
            dialog.setDialogTemplateContent(uploadDialog);
            dialog.setDialogData(dlgData);
            dialog.launch();              
        };
        
        // create header buttons and set its actions
        self.headerButtons.push({
                    "id": 'upload_btn_id',
                    "label": 'Upload',
                    "clickEventHandler": self.importActionHandler
                    });
                    
        self.importCertificate = function(data, event) {
            console.log("importCertificate : ", data);
            var url = self.restURL + '/archive';
            
            //var token = self.getAuthorizationToken();
            var file = $('#_import_')[0].files[0];
            
            require(['jet/js/utils'],
                function (u) { 
                    $(function () {
                        u.importResource(url, file, self);
                    });
                }
            );               
            
            self.catalog().closeCatalogDialog(data, event); // close the dialog                       
            //self.catalog().refresh();            
        };                    
        
        self.registerCertificate = function(data, event) {
            console.log("registerCertificate : ", data);
            console.log("registerCertificate file : ", data.getFile());
            console.log("registerCertificate name : ", data.getAliasName());
            console.log("registerCertificate type : ", data.getCertificateType());
            var url = self.restURL + '/archive';
            
            //var token = self.getAuthorizationToken();
            var file = data.getFile();
            var fd = new FormData();
            fd.append('file', file);
            fd.append('id', data.getCertificateType() + '|' + data.getAliasName());
            
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
