define(['ojs/ojcore', 'knockout', 'text!jet/designer/adapters/js/views/detailsDialog.html', 'jet/designer/adapters/js/views/detailsDialog', 'jet/js/utils'
], function (oj, ko, detailsDialog, detailsDialogData, utils) {
    
    function listViewModel() {
        var self = this;
        self.restURL = "/icsapis/v2/adapters";

        self.useDummyResponse = true;
        self.response = [];

        self.constructRowData = function(jsonRow) {
            var rData = self.catalog().rowData();
            
            //var detailsData = self.getDetailsData(jsonRow.id);
            var detailsData;

            rData.id = jsonRow.id;
            rData.version = self.catalog().util().trimVersion(jsonRow.version);            
            rData.name = jsonRow.displayName;
            rData.description = jsonRow.description;
            //rData.role = jsonRow.role;//MISSING
            rData.type = jsonRow.type;
            rData.info_icon = false;

            rData.mediumIconUrl = detailsData ? detailsData.mediumIconUrl : '';
            rData.film_strip = true;      
            rData.film_strip_data = {
                items : [
                    {
                        imgUrl: rData.mediumIconUrl ? '/ic/integration/home' + rData.mediumIconUrl : '../oracle/ics/webconsole/view/images/mono_connector_48_mono.png',
                        title: rData.name
                    }
                ]
            };          
            rData.usage = 0;//MISSING - API layer? USED BY CONNECTION
            
            return rData;
        };
        
        self.rowSelectionListener = function(data, event) {
        };        
        
        self.myCustomNavToDetails = function(data, event) {
            utils.trace("myCustomNavToDetails : ", data);
        };
        
        self.navToDetailsActionListener = function(data, event) {
            // type should be 'URL' for navigation using deep-link
            utils.trace('adapter - navToDetailsActionListener', data);
            
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
                'menu_id': 'delete_menu_id',
                'obj_id': data.id,
                'label': 'Delete',
                'action_handler': 'deleteActionMenuItemHandler'
            });
            
            return menu_json;
        };
        
        self.viewActionMenuItemHandler = function(data, event) {
            utils.trace('adapter - viewActionMenuItemHandler', data);
            self.displayDetailsDialog(data, event);            
        };
        
        self.deleteActionMenuItemHandler = function(data, event) {
            utils.trace("deleteActionMenuItemHandler : ", data);
            utils.trace("deleteActionMenuItemHandler type = : ", data.type);
            var dlgData;
            var template;
            var dialog = self.catalog().dialogGenerator().createDialog();

            if (data.type === 'PREINSTALLED') {
                    template = self.catalog().usageContentTemplate();
                    dlgData = self.catalog().usageContentTemplateData();

                    dlgData.title = 'Prebuilt Adapter';
                    dlgData.metadata_name = data.name + ' (' + data.version + ')';
                    dlgData.metadata_inuse_description = 'Adapters that were prebuilt for your system cannot be deleted.';
            } 
            else {
                if (data.usage > 0) {
                    template = self.catalog().usageContentTemplate();
                    dlgData = self.catalog().usageContentTemplateData();

                    dlgData.title = 'Adapter Is In Use';
                    dlgData.metadata_name = data.name;
                    dlgData.metadata_inuse_description = 'Adapter cannot be deleted at this time because ' + data.usage + ' connections are using it. Deleting the adapter would invalidate these connections. Active integrations would stop running. Remove the adapter from the connections and then delete the adapter.';
                    dlgData.used_by_count_message = 'Integrations using this library: ' + data.usage;
                    
                    dlgData.active_count_message = 'Active: 1';
                    dlgData.inactive_count_message = 'Inactive: 1';
                    //dlgData.used_by = self.fetchAdapterUsageData(data.name);
                } 
                else {
            
                    template = self.catalog().deleteConfirmContentTemplate();
                    dlgData = self.catalog().deleteConfirmContentTemplateData();

                    dlgData.title = 'Delete Adapter?';
                    dlgData.metadata_name = data.name + ' (' + data.version + ')';
                    dlgData.confirmFunction = self.deleteAdapter;
                    dlgData._data = data;
                }
            }
            dialog.setDialogTemplateContent(template);
            dialog.setDialogData(dlgData);
            dialog.launch();            
        };
        
        self.deleteAdapter = function(data, event) {
            utils.trace("deleteAdapter : ", data);
            self.catalog().closeCatalogDialog(data, event); // close the dialog
            var url = self.restURL + '/' + data._data.name;
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
        
        self.getDetailsData = function(id) {
            var result = self.catalog().serverCommunicationHandler().fetchData(self.restURL + '/' + id);
            utils.trace("getDetailsData for " + id + " : ", result);
            return result;
        }            
    }
    
    return new listViewModel;
});
