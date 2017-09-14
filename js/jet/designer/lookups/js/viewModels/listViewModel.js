/**
 * listViewModel module
 */
define(['ojs/ojcore', 'knockout', 'jet/js/utils'
], function (oj, ko, utils) {
    
    function listViewModel() {
        var self = this;
        
        self.restURL = "/icsapis/v2/lookups";
        self.useDummyResponse = true;
        self.response = [];
        
        // Customize method to create common row data based on the resource type and its rest response.
        // This method needs to be passed as a function parameter to initialize common catalog data model
        self.constructRowData = function(jsonRow) {
            var rData = self.catalog().rowData();
            
            //var detailsData = self.getDetailsData(jsonRow.id);
            var detailsData;
            
            rData.id = jsonRow.id;
            rData.name = jsonRow.name;
            rData.description = jsonRow.description;
            rData.modified = jsonRow.lastUpdated;
            rData.status = jsonRow.status;
            rData.columns = jsonRow.columns ? jsonRow.columns : [];
            rData.rowCount = jsonRow.rowCount;
            rData.type = 'Values mapped: ' + rData.rowCount;
            rData.locked = jsonRow.lockedDVMFlag;
            
            if (rData.locked) {
                rData.status = 'LOCKED';
            } 
            
            rData.film_strip = true;     
            
            
            rData.film_strip_data = {
                items : []
            };
            
            /*
            var columns = rData.columns;
            if (columns) {
                for (var i = 0; i < columns.length; i++) {
                    var name = columns[i];
                    var adapterDetailsData = self.getAdapterDetailsData(name);
                    if (!$.isEmptyObject(adapterDetailsData)) {
                        rData.mediumIconUrl = adapterDetailsData.mediumIconUrl;
                        rData.film_strip_data.items.push({
                            imgUrl: rData.mediumIconUrl ? '/ic/integration/home' + rData.mediumIconUrl : '../oracle/ics/webconsole/view/images/mono_connector_48_mono.png',
                            title: name                        
                        });                        
                    }
                    else {
                        rData.film_strip_data.items.push({
                            imgUrl: '../oracle/ics/webconsole/view/images/qual_squaresnine_48_full.png',
                            title: name                        
                        });
                    }
                }
            }
            */
            
            for (var i = 0; i < rData.columns.length; i++) {
                var z = rData.columns[i];
                rData.film_strip_data.items.push(
                    {
                        //imgUrl: '../oracle/ics/webconsole/view/images/mono_connector_48_mono.png',
                        imgUrl: '../oracle/ics/webconsole/view/images/qual_squaresnine_48_full.png',
                        title: z
                    });
            }
            
            rData.usage = 0;//MISSING
            
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
            utils.trace('package - navToDetailsActionListener');
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
            utils.trace("viewActionMenuItemHandler : "+data);
        };
        
        self.editActionMenuItemHandler = function(data, event) {
            utils.trace("editActionMenuItemHandler : "+data);
        };
        
        self.cloneActionMenuItemHandler = function(data, event) {
            utils.trace("cloneActionMenuItemHandler : ", data);
            self.cloneLookup(data, event);
        };

        self.cloneLookup = function(data, event) {
            utils.trace("cloneIntegration : ", data);
            //self.catalog().closeCatalogDialog(data, event); // close the dialog
            var url = self.restURL + '/' + data.name + '/' + 'clone';
            //var token = self.getAuthorizationToken();
            var e = utils.getRandomInteger(1, 9999);
            var clonedata = {
                "name" : "Clone4" + (999 - e)
                };

            //self.catalog().serverCommunicationHandler().postData(url, {}, clonedata, false, false, "application/json", self.cloneIntegrationCallback);
            utils.cloneResource(url, clonedata, self.catalog());
           
            //self.catalog().refresh();
        };

        self.exportActionMenuItemHandler = function(data, event) {
            utils.trace("exportActionMenuItemHandler : ", data);
            var path = self.restURL + '/' + data.name + '/' + 'archive';
            var fileName = data.name + '.csv';
            //var token = self.getAuthorizationToken();
            
            utils.exportResource(path, fileName, self.catalog());
        };
        
        self.deleteActionMenuItemHandler = function(data, event) {
            utils.trace("deleteActionMenuItemHandler : ", data);
            var dlgData;
            var template;
            var dialog = self.catalog().dialogGenerator().createDialog();
            if (data.status === 'LOCKED') {
                template = self.catalog().usageContentTemplate();
                dlgData = self.catalog().usageContentTemplateData();

                dlgData.title = 'Lookup Is Locked';
                dlgData.metadata_name = data.name;
                dlgData.metadata_inuse_description = 'Lookup cannot be deleted at this time because it is locked. Unlock the lookup first and then delete it.';
            } 
            else {            
                if (data.usage > 0) {
                        template = self.catalog().usageContentTemplate();
                        dlgData = self.catalog().usageContentTemplateData();
    
                        dlgData.title = 'Lookup Is In Use';
                        dlgData.metadata_name = data.name;
                        dlgData.metadata_inuse_description = 'Lookup cannot be deleted at this time because ' + data.usage + ' integrations are using it. Deleting the lookup would invalidate these integrations. Active integrations would stop running. Remove the lookup from the integrations and then delete the lookup.';
                        dlgData.used_by_count_message = 'Integrations using this lookup: ' + data.usage;
                        
                        dlgData.active_count_message = 'Active: 1';
                        dlgData.inactive_count_message = 'Inactive: 1';
                        //dlgData.used_by = self.fetchLookupUsageData(data.name);
                } 
                else {
                        template = self.catalog().deleteConfirmContentTemplate();
                        dlgData = self.catalog().deleteConfirmContentTemplateData();
    
                        dlgData.title = 'Delete Lookup?';
                        dlgData.metadata_name = data.name;
                        dlgData.id = data.name;
                        dlgData.confirmFunction = self.deleteLookup;
                        dlgData._data = data;
                }
            }

            dialog.setDialogTemplateContent(template);
            dialog.setDialogData(dlgData);
            dialog.launch();                  
        };        
        
        self.deleteLookup = function(data, event) {
            utils.trace("deleteLookup : ", data);
            self.catalog().closeCatalogDialog(data, event); // close the dialog
            var url = self.restURL + '/' + data._data.name;
            //var token = self.getAuthorizationToken();
            /*
            require(['jet/js/utils'],
                function (u) { 
                    $(function () {
                        u.deleteResource(url, self.catalog());
                    });
                }
            );               
           */
            var response = self.catalog().serverCommunicationHandler().deleteData(url);
            utils.trace("deleteIntegration response : ", response);

           if (response) {
               if (response.status == 200) {
                    self.catalog().refresh();
               }
           }           
            //self.catalog().refresh();            
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
//            if (actualRowData.description) {
//                popupData.items.unshift({ label:'Description', value: actualRowData.description });
//            }                
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
