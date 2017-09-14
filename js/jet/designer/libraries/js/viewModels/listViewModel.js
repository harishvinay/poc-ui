/**
 * listViewModel module
 */
define(['ojs/ojcore', 'knockout', 'jet/designer/libraries/js/viewModels/libraryCatalog'
], function (oj, ko, libraryCatalog) {
    
    function listViewModel() {
        var self = this;
        
        self.restURL = "/icsapis/v2/libraries";
        self.useDummyResponse = true;
        self.response = [];
        self.libraryContextParam = null;
    
        self.deleteResource = function(urlPath) {
            self.catalog().serverCommunicationHandler().deleteData(urlPath);
        };
        
        self.fetchLibraryUsageData = function(id) {
            var restUrl = '/icsapis/v2/libraries/'+ id +'/usage';
            return self.catalog().serverCommunicationHandler().getData(restUrl);
        };
        
        self.constructRowData = function(jsonRow) {
            var rData = self.catalog().rowData();
            rData.id = jsonRow.id;
            rData.name = jsonRow.displayName;
            rData.version = self.catalog().util().trimVersion(jsonRow.version);
            rData.description = jsonRow.description;
            rData.type = jsonRow.libraryType === 'API' ? 'Extension Library' : null;
            rData.mode_type = jsonRow.calloutType;
            rData.modified = jsonRow.lastUpdatedDate;
            rData.status = jsonRow.status;
            rData.usage = jsonRow.usage;
            return rData;
        };
        
        self.rowSelectionListener = function(data, event) {
            console.log("prev selected row : "+self.prevSelectedRow);
            console.log("curr selected row : "+self.currSelectedRow);
            console.log("selected rows : "+self.selectedRows());
        };        
        
        self.myCustomNavToDetails = function(data, event) {
            var name = data.name;
            var version = data.id.split('|')[1];
            var code = data.id;
            var desc = data.description;
            var mode = "edit";

            getLibraryCatalog().code(data.id.split('|')[0]);
            getLibraryCatalog().version(version);
            getLibraryCatalog().mode("EDIT_MODE");
            getLibraryCatalog().currentModule('libraryMetadata');
        };
        
        self.navToDetailsActionListener = function(data, event) {
            // type should be 'URL' for navigation using deep-link
            self.navToDetailsLink.type = 'CUSTOM';     
            
            // create url by getting information from 'data' 
            self.navToDetailsLink.customHandler = 'myCustomNavToDetails';
        };
        
        //  START - dynamic actions menu customization
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
                'menu_id': 'edit_menu_id',
                'obj_id': data.id,
                'label': 'Edit',
                'action_handler': 'editActionMenuItemHandler'
            });
            menu_json.menuItems.push({
                'menu_id': 'delete_menu_id',
                'obj_id': data.id,
                'label': 'Delete',
                'action_handler': 'deleteActionMenuItemHandler'
            });
            menu_json.menuItems.push({
                'menu_id': 'download_menu_id',
                'obj_id': data.id,
                'label': 'Download Library File',
                'action_handler': 'downloadLibraryFileActionMenuItemHandler'
            });
            
            return menu_json;
        };

        self.viewActionMenuItemHandler = function(data, event) {
            var name = data.name;
            var version = data.id.split('|')[1];
            var code = data.id;
            var desc = data.description;
            var mode = "view";
            getLibraryCatalog().code(data.id.split('|')[0]);
            getLibraryCatalog().version(version);
             getLibraryCatalog().mode("VIEW_MODE");
            getLibraryCatalog().currentModule('libraryMetadata');
        };
        
        self.editActionMenuItemHandler = function(data, event) {
            var name = data.name;
            var version = data.id.split('|')[1];
            var code = data.id;
            var desc = data.description;
            var mode = "edit"; 
            getLibraryCatalog().code(data.id.split('|')[0]);
            getLibraryCatalog().version(version);
            getLibraryCatalog().mode("EDIT_MODE");
            getLibraryCatalog().currentModule('libraryMetadata');
        };
        
        self.deleteLibrary = function(data, event) {
            self.catalog().closeCatalogDialog(data, event);
            self.deleteResource(self.restURL + '/' + data.id);
            self.catalog().refresh();   // refresh list
        }
        
        self.deleteActionMenuItemHandler = function(data, event) {
            var dlgData;
            var template;
            var dialog = self.catalog().dialogGenerator().createDialog();

            if (data.usage > 0) {
                template = self.catalog().usageContentTemplate();
                dlgData = self.catalog().usageContentTemplateData();

                dlgData.title = 'Library Is In Use';
                dlgData.dialogHelpTopicId = 'help_guid';
                dlgData.metadata_name = data.name + ' (' + data.version + ')';
                dlgData.metadata_inuse_description = 'Library cannot be deleted at this time because ' + data.usage + ' integrations are using it. Deleting the library would invalidate these integrations. Active integrations would stop running. Remove the library from the integrations and then delete the library.';
                dlgData.used_by_count_message = 'Integrations using this library: ' + data.usage;
                
                var usageData = self.fetchLibraryUsageData(data.id);
                var activeCount = 0;
                var inactiveCount = 0;
                for( var i = 0 ; i < usageData.length ; i++){
                    if( usageData[i].name ) {
                        if( usageData[i].active === true ) {
                            activeCount += 1;
                        } else {
                            inactiveCount += 1;
                        }
                    }
                }
                
                dlgData.active_count_message = 'Active: ' + activeCount;
                dlgData.inactive_count_message = 'Inactive: ' + inactiveCount;
                dlgData.used_by = usageData;
            } else {
                template = self.catalog().deleteConfirmContentTemplate();
                dlgData = self.catalog().deleteConfirmContentTemplateData();

                dlgData.title = 'Delete Library?';
                dlgData.dialogHelpTopicId = 'help_guid';
                dlgData.metadata_name = data.name + ' (' + data.version + ')';
                dlgData.id = data.id;
                dlgData.confirmFunction = self.deleteLibrary;
            }

            dialog.setDialogTemplateContent(template);
            dialog.setDialogData(dlgData);
            dialog.launch();        
        };

        self.downloadLibraryFileActionMenuItemHandler = function(data, event) {
            console.log("exportActionMenuItemHandler : ", data);
            var path = self.restURL + '/' + data.id + '/' + 'archive';
            var fileName = data.id.split('|').join('_') + '.jar';
            //var token = self.getAuthorizationToken();
            
            require(['jet/js/utils'],
                function (u) { 
                    $(function () {
                        u.exportResource(path, fileName, self.catalog());
                    });
                }
            );   
        };      
        //  END - dynamic actions menu launch implementations
        
        // info popup event listener
        self.launchInfoPopupEventListener = function(data, event) {
            var actualRowData = self.getActualData(data.id);
            var popupData = {
                items : [
                    { label:'Identifier', value: actualRowData.id.split('|')[0] },
                    { label:'Updated', value: new Date(actualRowData.lastUpdatedDate).toUTCString() },
                    { label:'Updated By', value: actualRowData.lastUpdatedBy },
                    { label:'Created', value: new Date(actualRowData.createdDate).toUTCString() },
                    { label:'Created By', value: actualRowData.createdBy }                
                ]
            };
            var popup = self.catalog().popupGenerator().createPopup(popupData);
            popup.launch(event.currentTarget.id);
        };           
        
        self.usageLinkActionEventListener = function(data,event) {
            var dlgData = self.catalog().usageContentTemplateData();
            var template = self.catalog().usageContentTemplate();
            var dialog = self.catalog().dialogGenerator().createDialog();

            dlgData.title = 'Library Is In Use';
            dlgData.dialogHelpTopicId = 'help_guid';
            dlgData.metadata_name = data.name + ' (' + data.version + ')';
            dlgData.used_by_count_message = 'Integrations using this library: ' + data.usage;
            
            var usageData = self.fetchLibraryUsageData(data.id);
            var activeCount = 0;
            var inactiveCount = 0;
            for( var i = 0 ; i < usageData.length ; i++){
                if( usageData[i].name ) {
                    if( usageData[i].active === true ) {
                        activeCount += 1;
                    } else {
                        inactiveCount += 1;
                    }
                }
            }
            
            dlgData.active_count_message = 'Active: ' + activeCount;
            dlgData.inactive_count_message = 'Inactive: ' + inactiveCount;
            dlgData.used_by = usageData;

            dialog.setDialogTemplateContent(template);
            dialog.setDialogData(dlgData);
            dialog.launch();                
        }
        
         self.setLibraryContext = function(libContext){
                self.libraryContextParam = libContext;
         }
         
         self.getLibraryContext = function(){
                return self.libraryContextParam;
         }
        
    }
    
    return new listViewModel;
});
