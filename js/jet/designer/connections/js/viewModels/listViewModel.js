/**
 * listViewModel module
 */
define(['ojs/ojcore', 'knockout', 'jet/js/utils'
], function (oj, ko, utils) {
    
    function listViewModel() {
        var self = this;
        
        self.restURL = "/icsapis/v2/connections";
        self.useDummyResponse = true;
        self.response = [];
        
        // Customize method to create common row data based on the resource type and its rest response.
        // This method needs to be passed as a function parameter to initialize common catalog data model
        self.constructRowData = function(jsonRow) {
            var rData = self.catalog().rowData();
            
            //var detailsData = self.getDetailsData(jsonRow.id);
            var detailsData;             
            
            utils.trace('constructRowData rData', rData);
            utils.trace("constructRowData jsonRow", jsonRow);            
            rData.id = jsonRow.id;
            rData.name = jsonRow.name;
            rData.description = jsonRow.description;
            rData.modified = jsonRow.lastUpdated;
            rData.status = jsonRow.status;
            rData.displayName = jsonRow.adapterType.displayName;
            rData.role = jsonRow.role;
            rData.usage = jsonRow.usage;//MISSING
            rData.type = rData.displayName;
            rData.locked = detailsData ? detailsData.lockedFlag : false;
            
            if (rData.locked) {
                rData.status = 'LOCKED';
            }                
            
            rData.film_strip = true;      
            /*
            var adapterDetailsData = self.getAdapterDetailsData(jsonRow.adapterType.name);
            rData.mediumIconUrl = adapterDetailsData.mediumIconUrl;
            rData.film_strip_data = { 
                items : [
                    {
                        imgUrl: rData.mediumIconUrl ? '/ic/integration/home' + rData.mediumIconUrl : '../oracle/ics/webconsole/view/images/mono_connector_48_mono.png',
                        title: rData.displayName
                    }
                ]
            };          
            */
            
            rData.film_strip_data = { //we need only 1 icon
                items : [
                    {
                        imgUrl: '../oracle/ics/webconsole/view/images/mono_connector_48_mono.png',
                        title: rData.displayName
                    }
                ]
            };            
            
            return rData;
        };
        
        self.rowSelectionListener = function(data, event) {
            utils.trace("prev selected row : "+self.prevSelectedRow);
            utils.trace("curr selected row : "+self.currSelectedRow);
            utils.trace("selected rows : "+self.selectedRows());
            utils.trace(window.location);
            utils.trace(window.location.pathname);
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
            utils.trace('connection - navToDetailsActionListener');
            /*
            self.navToDetailsLink.type = 'URL';     
        
            var pathName = window.location.pathname;
            pathName = pathName.replace('/faces/global','');
            var deepLinkUrl = window.location.origin + pathName + '/faces/link?page=integration&code='+ data.id.split('|')[0] + '&version=' + Catalog.util.unTrimVersion(data.version);
            utils.trace('deepLinkUrl : '+deepLinkUrl);
            // create url by getting information from 'data' 
            self.navToDetailsLink.url = deepLinkUrl;
            */
        };        
        
        
        //  START - dynamic actions menu launch implementations
        self.getActionMenuDetails = function(data) {
            var menu_json = {
                'menuItems': []
            };
            menu_json.menuItems.push({
                'menu_id': 'edit_menu_id',
                'obj_id': data.id,
                'label': 'Edit',
                'action_handler': 'editActionMenuItemHandler'
            });            
            menu_json.menuItems.push({
                'menu_id': 'view_menu_id',
                'obj_id': data.id,
                'label': 'View',
                'action_handler': 'viewActionMenuItemHandler'
            });

            menu_json.menuItems.push({
                'menu_id': 'clone_menu_id',
                'obj_id': data.id,
                'label': 'Clone',
                'action_handler': 'cloneActionMenuItemHandler'
            });
            menu_json.menuItems.push({
                'menu_id': 'delete_menu_id',
                'obj_id': data.id,
                'label': 'Delete',
                'action_handler': 'deleteActionMenuItemHandler'
            });
            menu_json.menuItems.push({
                'menu_id': 'refresh_menu_id',
                'obj_id': data.id,
                'label': 'Refresh Metadata',
                'action_handler': 'refreshActionMenuItemHandler'
            });
            
            return menu_json;
        };
        
        self.editActionMenuItemHandler = function(data, event) {
            utils.trace("editActionMenuItemHandler : "+data);
        };        
        
        self.viewActionMenuItemHandler = function(data, event) {
            utils.trace("viewActionMenuItemHandler : "+data);
        };
        
        self.cloneActionMenuItemHandler = function(data, event) {
            utils.trace("cloneActionMenuItemHandler : "+data);
        };
        
        self.deleteActionMenuItemHandler = function(data, event) {
            utils.trace("deleteActionMenuItemHandler : ", data);
            var dlgData;
            var template;
            var dialog = self.catalog().dialogGenerator().createDialog();
            if (data.status === 'LOCKED') {
                template = self.catalog().usageContentTemplate();
                dlgData = self.catalog().usageContentTemplateData();

                dlgData.title = 'Connection Is Locked';
                dlgData.metadata_name = data.name;
                dlgData.metadata_inuse_description = 'Connection cannot be deleted at this time because it is locked. Unlock the connection first and then delete it.';
            } 
            else {
                if (data.usage > 0) {
                        template = self.catalog().usageContentTemplate();
                        dlgData = self.catalog().usageContentTemplateData();
    
                        dlgData.title = 'Connection Is In Use';
                        dlgData.metadata_name = data.name;
                        dlgData.metadata_inuse_description = 'Connection cannot be deleted at this time because ' + data.usage + ' integrations are using it. Deleting the connection would invalidate these integrations. Active integrations would stop running. Remove the connection from the integrations and then delete the connection.';
                        dlgData.used_by_count_message = 'Integrations using this connection: ' + data.usage;
                        
                        dlgData.active_count_message = 'Active: 1';
                        dlgData.inactive_count_message = 'Inactive: 1';
                        //dlgData.used_by = self.fetchLookupUsageData(data.name);
                } 
                else {
                        template = self.catalog().deleteConfirmContentTemplate();
                        dlgData = self.catalog().deleteConfirmContentTemplateData();
    
                        dlgData.title = 'Delete Connection?';
                        dlgData.metadata_name = data.name;
                        dlgData.id = data.id;
                        dlgData.confirmFunction = self.deleteConnection;
                        dlgData._data = data;
                }
            }

            dialog.setDialogTemplateContent(template);
            dialog.setDialogData(dlgData);
            dialog.launch();                 
        };
        
        self.refreshActionMenuItemHandler = function(data, event) {
            utils.trace("refreshActionMenuItemHandler : "+data);
        };        
        
        self.deleteConnection = function(data, event) {
            utils.trace("deleteConnection : ", data);
            self.catalog().closeCatalogDialog(data, event); 
            var url = self.restURL + '/' + data._data.id;

            var response = self.catalog().serverCommunicationHandler().deleteData(url);
            utils.trace("deleteConnection response : ", response);

           if (response) {
               if (response.status == 200) {
                    self.catalog().refresh();
               }
           }            
      
        };           
        
        // launch info popup listener
        self.launchInfoPopupEventListener = function(data, event) {
            var actualRowData = self.getActualData(data.id);
            var popupData = {
                items : [
                    { label:'Identifier', value: actualRowData.id.split('|')[0] },
                    { label:'Updated', value: new Date(actualRowData.lastUpdated).toUTCString() },
                    { label:'Updated By', value: actualRowData.lastUpdatedBy },
                    { label:'Created', value: new Date(actualRowData.created).toUTCString() },
                    { label:'Created By', value: actualRowData.createdBy }      
                ]
            };
            if (utils.isValidString(actualRowData.description)) {
                popupData.items.push({ label:'Description', value: actualRowData.description });
            }
            var popup = self.catalog().popupGenerator().createPopup(popupData);
            popup.launch(event.currentTarget.id);
        };           
        
        self.getDetailsData = function(id) {
            var result = self.catalog().serverCommunicationHandler().fetchData(self.restURL + '/' + id);
            utils.trace("getDetailsData for " + id + " : ", result);
            return result;
        }        
        
        self.getAdapterDetailsData = function(id) {
            var result = self.catalog().serverCommunicationHandler().fetchData('/icsapis/v2/adapters' + '/' + id);
            utils.trace("getAdapterDetailsData " + id + " : ", result);
            return result;        
        }

    }
    return new listViewModel;
});
