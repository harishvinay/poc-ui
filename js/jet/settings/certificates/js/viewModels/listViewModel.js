define(['ojs/ojcore', 'knockout', 'text!jet/settings/certificates/js/views/detailsDialog.html', 'jet/settings/certificates/js/views/detailsDialog'
], function (oj, ko, detailsDialog, detailsDialogData) {
    
    function listViewModel() {
        var self = this;
        
        self.restURL = "/icsapis/v2/certificates";
        
        // Customize method to create common row data based on the resource type and its rest response.
        // This method needs to be passed as a function parameter to initialize common catalog data model
        self.constructRowData = function(jsonRow) {
            var rData = self.catalog().rowData();
            rData.id = jsonRow.id;
            rData.name = jsonRow.name;
            rData.keyStore = jsonRow.keystore;
            rData.keyStoreDescription = jsonRow.keyStoreDescription;
            rData.description = jsonRow.description;
            rData.mode_type = rData.keyStoreDescription;
            rData.type = jsonRow.type;
            return rData;
        };
        
        self.rowSelectionListener = function(data, event) {
            console.log("prev selected row : "+self.prevSelectedRow);
            console.log("curr selected row : "+self.currSelectedRow);
            console.log("selected rows : "+self.selectedRows());
            console.log(window.location);
            console.log(window.location.pathname);
            /*
            var pathName = window.location.pathname;
            pathName = pathName.replace('/faces/global','');
            var url = window.location.origin + pathName + '/home/faces/link?page=integration&code=';
            console.log("URL : "+url);
            */
        };        
        
        self.myCustomNavToDetails = function(data, event) {
            console.log("myCustomNavToDetails : "+data);
            //window.location.href = '/Catalog/integrations.html';
        };
        
        self.navToDetailsActionListener = function(data, event) {
            // type should be 'URL' for navigation using deep-link
            console.log('certificate - navToDetailsActionListener', data);
            self.displayDetailsDialog(data, event);
        };        
        
        self.displayDetailsDialog = function(data, event) {
            var result = self.catalog().serverCommunicationHandler().fetchData(self.restURL + '/' + data.id);
            var dialog = self.catalog().dialogGenerator().createDialog();
            var dlgData = detailsDialogData.getDefault(result);
           
            dialog.setDialogTemplateContent(detailsDialog);
            dialog.setDialogData(dlgData);
            dialog.launch();                
        };        
        
        self.getActionMenuDetails = function(data) {
            var menu_json = {
                'menuItems': []
            };
            menu_json.menuItems.push({
                'menu_id': 'view_menu_id',
                'obj_id': data.id,
                'label': 'View',
                'action_handler': 'viewActionMenuItemHandler'
            });

            menu_json.menuItems.push({
                'menu_id': 'update_version_menu_id',
                'obj_id': data.id,
                'label': 'Update',
                'action_handler': 'updateActionMenuItemHandler'
            });
            
            menu_json.menuItems.push({
                'menu_id': 'delete_menu_id',
                'obj_id': data.id,
                'label': 'Delete',
                'action_handler': 'deleteActionMenuItemHandler'
            });

            return menu_json;
        };
        
        self.viewActionMenuItemHandler = function(data, event) {
            console.log("viewActionMenuItemHandler : ", data);
        };
        
        self.updateActionMenuItemHandler = function(data, event) {
            console.log("updateActionMenuItemHandler : ", data);
        };
        
        self.deleteActionMenuItemHandler = function(data, event) {
            console.log("deleteActionMenuItemHandler : ", data);
            var dlgData;
            var template;
            var dialog = self.catalog().dialogGenerator().createDialog();

            if (data.type === 'PREINSTALLED') {
                    template = self.catalog().usageContentTemplate();
                    dlgData = self.catalog().usageContentTemplateData();

                    dlgData.title = 'Prebuilt Certificate';
                    dlgData.metadata_name = data.name + ' (' + data.version + ')';
                    dlgData.metadata_inuse_description = 'Certificates that were prebuilt for your system cannot be deleted.';
            } 
            else {
           
                    template = self.catalog().deleteConfirmContentTemplate();
                    dlgData = self.catalog().deleteConfirmContentTemplateData();

                    dlgData.title = 'Delete Certificate?';
                    dlgData.metadata_name = data.name + ' (' + data.version + ')';
                    dlgData.confirmFunction = self.deleteCertificate;
                    dlgData._data = data;
                }
                dialog.setDialogTemplateContent(template);
                dialog.setDialogData(dlgData);
                dialog.launch();                        
            }
        };
        
        self.deleteCertificate = function(data, event) {
            console.log("deleteCertificate : ", data);
            self.catalog().closeCatalogDialog(data, event); // close the dialog
            var url = self.restURL + '/' + data._data.id;
            //var token = self.getAuthorizationToken();
            
            require(['jet/js/utils'],
                function (u) { 
                    $(function () {
                        u.deleteResource(url, self.catalog());
                    });
                }
            );               
           
            //self.catalog().refresh();            
        };            
    
        // launch info popup listener
        self.launchInfoPopupEventListener = function(data, event) {
            var actualRowData = self.getActualData(data.id);
            var popupData = {
                items : []
            };
            if (actualRowData.description) {
                popupData.items.push({ label:'Description', value: actualRowData.description });
            }                
            var popup = self.catalog().popupGenerator().createPopup(popupData);
            popup.launch(event.currentTarget.id);
        };       
    
    return new listViewModel;
});