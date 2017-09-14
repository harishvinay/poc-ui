/**
 * listViewModel module
 */
define(['ojs/ojcore', 'knockout', 'jet/js/utils'
], function (oj, ko, utils) {
    
    function listViewModel() {
        var self = this;
        
        self.restURL = "/icsapis/v2/packages";
        
        // Customize method to create common row data based on the resource type and its rest response.
        // This method needs to be passed as a function parameter to initialize common catalog data model
        self.constructRowData = function(jsonRow) {
            var rData = self.catalog().rowData();
            
            //var detailsData = self.getDetailsData(jsonRow.id);
            var detailsData;
            
            rData.id = jsonRow.id;
            rData.name = jsonRow.name;
            rData.description = jsonRow.description;
            //rData.type = jsonRow.type; //MISSING == prebuiltFlag, but it should be the same as for integration projectType
            rData.modified = jsonRow.lastUpdated;
            rData.usage = jsonRow.countOfIntegrations;
            rData.info_icon = false;
            
            rData.projectType = detailsData ? detailsData.prebuiltFlag : false;
            return rData;
        };
        
        self.rowSelectionListener = function(data, event) {
            /*
            var pathName = window.location.pathname;
            pathName = pathName.replace('/faces/global','');
            var url = window.location.origin + pathName + '/home/faces/link?page=integration&code=';
            utils.trace("URL : "+url);
            */
        };        
        
        self.myCustomNavToDetails = function(data, event) {
            utils.trace("myCustomNavToDetails : "+data);
            //window.location.href = '/Catalog/integrations.html';
        };
        
        self.navToDetailsActionListener = function(data, event) {
            // type should be 'URL' for navigation using deep-link
            utils.trace('package - navToDetailsActionListener');
            self.viewIntegrations(data, event);
        };        
       
        
        //  START - dynamic actions menu launch implementations
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
                'menu_id': 'export_version_menu_id',
                'obj_id': data.id,
                'label': 'Export',
                'action_handler': 'exportActionMenuItemHandler'
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
            utils.trace("viewActionMenuItemHandler : ", data);
            self.viewIntegrations(data, event);
        };
        
        self.exportActionMenuItemHandler = function(data, event) {
            utils.trace("exportActionMenuItemHandler : ", data);
            var path = self.restURL + '/' + data.name + '/' + 'archive';
            var fileName = data.name + '.par';
            
            utils.exportResource(path, fileName, self.catalog());
         };
        
        self.deleteActionMenuItemHandler = function(data, event) {
            utils.trace("deleteActionMenuItemHandler : ", data);
            var dlgData;
            var template;
            var dialog = self.catalog().dialogGenerator().createDialog();
            
            if (data.projectType) {
                    template = self.catalog().usageContentTemplate();
                    dlgData = self.catalog().usageContentTemplateData();

                    dlgData.title = 'Prebuilt Package';
                    dlgData.metadata_name = data.name;
                    dlgData.metadata_inuse_description = 'Packages that were prebuilt for your system cannot be deleted. To delete prebuilt package, use marketplace.';
            }             
            else {
                var detailsData = self.getDetailsData(data.name);
                var _active_ = self.fetchActiveIntegrations(detailsData.integrations);
                
                if (_active_ > 0) {
                        template = self.catalog().usageContentTemplate();
                        dlgData = self.catalog().usageContentTemplateData();
    
                        dlgData.title = 'Package Is In Use';
                        dlgData.metadata_name = data.name;
                        dlgData.metadata_inuse_description = 'Package cannot be deleted at this time because ' + _active_ + ' integrations in it are locked or active. Deleting the package would delete these integrations. Active integrations would stop running. Remove these integrations from the package and then delete the package';
                        dlgData.used_by_count_message = 'Integrations in this package: ' + data.usage;
                        
                        dlgData.active_count_message = 'Active: ' + _active_;
                        dlgData.inactive_count_message = 'Inactive: ' + (data.usage - _active_);
                        dlgData.used_by = self.fetchPackageUsageData(detailsData.integrations);
                } 
                else {
                        template = self.catalog().deleteConfirmContentTemplate();
                        dlgData = self.catalog().deleteConfirmContentTemplateData();
    
                        dlgData.title = 'Delete Package?';
                        dlgData.metadata_name = data.name;
                        dlgData.id = data.name;
                        dlgData.confirmFunction = self.deletePackage;
                }
            }

            dialog.setDialogTemplateContent(template);
            dialog.setDialogData(dlgData);
            dialog.launch();              
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
        
        self.viewIntegrations = function(data, event) {
            var dlgData;
            var template;
            var dialog = self.catalog().dialogGenerator().createDialog();

            template = self.catalog().usageContentTemplate();
            dlgData = self.catalog().usageContentTemplateData();

            var detailsData = self.getDetailsData(data.name);
            var _active_ = self.fetchActiveIntegrations(detailsData.integrations);

            dlgData.title = 'Integrations in Package';
            dlgData.metadata_name = data.name;
            //dlgData.metadata_inuse_description = '';
            dlgData.used_by_count_message = 'Integrations in this package: ' + data.usage;
            
            dlgData.active_count_message = 'Active: ' + _active_;
            dlgData.inactive_count_message = 'Inactive: ' + (data.usage - _active_);
            dlgData.used_by = self.fetchPackageUsageData(detailsData.integrations);

            dialog.setDialogTemplateContent(template);
            dialog.setDialogData(dlgData);
            dialog.launch();                    
        };
        
        self.fetchActiveIntegrations = function(list) {
            var retValue = 0;
            $(list).each(function(index) {
                var result = self.catalog().serverCommunicationHandler().fetchData('/icsapis/v2/integrations/' + this.id);
                if (result.status == 'ACTIVATED') {
                    retValue++;
                }
            });
            return retValue;
        };
        
         self.fetchPackageUsageData = function(list) {
         //[{"active":false,"name":"LOAN_APP_TEST"}]
            var retValue = [];
            $(list).each(function(index) {
                var result = self.catalog().serverCommunicationHandler().fetchData('/icsapis/v2/integrations/' + this.id);
                if (result.status == 'ACTIVATED') {
                    retValue.push({'active' : true, 'name' : result.name + ' (' + result.version + ')' });
                }
                else {
                    retValue.push({'active' : false, 'name' : result.name + ' (' + result.version + ')' });
                }
            });
            return retValue;
    	};        
        
        self.deletePackage = function(data, event) {
            utils.trace("deletePackage : ", data);
            self.catalog().closeCatalogDialog(data, event);            
            var url = self.restURL + '/' + data.id;

            var response = self.catalog().serverCommunicationHandler().deleteData(url);
            utils.trace("deletePackage response : ", response);

           if (response) {
               if (response.status == 200) {
                    self.catalog().refresh();
               }
           }             
        };        
        
        self.getDetailsData = function(id) {
            var result = self.catalog().serverCommunicationHandler().fetchData(self.restURL + '/' + id);
            utils.trace("getDetailsData for " + id + " : ", result);
            return result;
        }               
 
    }
    return new listViewModel;
});
