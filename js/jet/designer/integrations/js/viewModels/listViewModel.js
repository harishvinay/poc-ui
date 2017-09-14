/**
 * listViewModel module
 */
define(['ojs/ojcore', 'knockout', 'text!jet/designer/integrations/js/views/activateDialog.html', 'jet/designer/integrations/js/views/activateDialog', 'jet/js/utils'
], function (oj, ko, activateDialog, activateDialogData, utils) {
    
    function listViewModel() {
        var self = this;
        
        self.restURL = "/icsapis/v2/integrations";
        
        // Customize method to create common row data based on the resource type and its rest response.
        // This method needs to be passed as a function parameter to initialize common catalog data model
        self.constructRowData = function(jsonRow) {
            var rData = self.catalog().rowData();
            utils.trace('constructRowData rData', rData);
            utils.trace("constructRowData jsonRow", jsonRow);
            
            //var detailsData = self.getDetailsData(jsonRow.id);
            var detailsData;
 
            rData.id = jsonRow.id;
            rData.name = jsonRow.name;
            rData.version = self.catalog().util().trimVersion(jsonRow.version);
            rData.description = jsonRow.description;
            rData.type = self.getType(jsonRow);
            rData.projectType = jsonRow.projectType;
            rData.modified = jsonRow.lastUpdated;//sort
            rData.status = jsonRow.status;
            rData.pattern = jsonRow.pattern;
            
            rData.traceEnabled = detailsData ? detailsData.tracingEnabledFlag : false;
            rData.payloadEnabled = detailsData ? detailsData.payloadTracingEnabledFlag : false;
            rData.scheduleDefined = detailsData ? detailsData.scheduleDefinedFlag : false;
            rData.scheduleApplicable = detailsData ? detailsData.scheduleApplicableFlag : false;
            rData.locked = detailsData ? detailsData.lockedFlag : false;

            rData.packageName = jsonRow.packageName;
            rData.style = jsonRow.style;
            
            rData.patternDescription = jsonRow.patternDescription;
            
            if (jsonRow.status === 'CONFIGURED') {
                rData.status = 'DEACTIVATED';
            }
            if (rData.locked) {
                rData.status = 'LOCKED';
            }       
            rData.film_strip = true; 
            /*
            var endPoints = detailsData.endPoints;
                 
            if (!endPoints) {
                rData.film_strip_data = {
                    items : [
                        {
                            imgUrl: '../oracle/ics/webconsole/view/images/mono_connector_48_mono.png',
                            title: 'No connection is added'
                        }
                    ]
                };       
            }
            else {
            //if (endPoints) {
                rData.film_strip_data = {items: [] };
                for (var i = 0; i < endPoints.length; i++) {
                    var connectionId = endPoints[i].connection.id;
                    var connectionDetailsData = self.getConnectionDetailsData(connectionId);
                    if (connectionDetailsData && connectionDetailsData.adapterType) {
                        var adapterDetailsData = self.getAdapterDetailsData(connectionDetailsData.adapterType.name);
                        if (adapterDetailsData) {
                            var img = adapterDetailsData.mediumIconUrl;
                            var name = adapterDetailsData.displayName;
                            
                            //if (!utils.hasValue(rData.film_strip_data.items, title, name))
                            {
                                rData.film_strip_data.items.push(
                                {
                                    imgUrl: img ? '/ic/integration/home' + img : '../oracle/ics/webconsole/view/images/mono_connector_48_mono.png',
                                    title: name
                                });           
                            }
                        }            
                    }
                    else {
                        //no adapterType
                    }
                }
            }
            */
            
            rData.film_strip_data = {
                items : [
                    {
                        imgUrl: '../oracle/ics/webconsole/view/images/mono_connector_48_mono.png',
                        title: 'No connection is added'
                    },
                    {
                        imgUrl: '../oracle/ics/webconsole/view/images/qual_calendar_48_ena.png',
                        title: 'Trigger: Schedule'
                    },
                    {
                        imgUrl: '../images/soap/wssoap_46.png',
                        title: 'Webservice Connection'
                    },
                    {
                        imgUrl: '../images/rest/rest_46.png',
                        title: 'REST Service'
                    }
                ]
            };                   
            
            rData.endpointUrl = "http://host:8001/ic/api/integration/v1/flows/rest/" + jsonRow.code + "/" + jsonRow.version;//?
//            rData.fetchRuntimeData = function() {
//                    var promise = new Promise(function(resolve, reject) {
//                            setTimeout(function() {
//                                    var data = {
//                                            'success': 5,
//                                            'failure': 10,
//                                            'successRate': Math.ceil(Math.random(1) * 100)
//                                    };
//                                    resolve(data);
//                            }, 0);
//                    });
//                    return promise;
//            };          

            return rData;
        };
        
        self.rowSelectionListener = function(data, event) {
            var pathName = window.location.pathname;
            pathName = pathName.replace('/faces/global','');
            var url = window.location.origin + pathName + '/home/faces/link?page=integration&code=';
        };        
        
        self.myCustomNavToDetails = function(data, event) {
            utils.trace("myCustomNavToDetails : ", data);
            //window.location.href = '/Catalog/integrations.html';
        };
        
        self.navToDetailsActionListener = function(data, event) {
            utils.trace("navToDetailsActionListener : ", data);
            // type should be 'URL' for navigation using deep-link
            self.navToDetailsLink.type = 'URL';     

            var pathName = window.location.pathname;
            if (pathName.indexOf('/faces/global') > 0) {
                pathName = pathName.replace('/faces/global','');
            }
            else if (pathName.indexOf('/faces/link') > 0) {
                pathName = pathName.replace('/faces/link','');
            }
            else {
                utils.trace("myCustomNavToDetails BAD URL: ", window.location.href);
            }
            var deepLinkUrl = window.location.origin + pathName + '/faces/link?page=integration&code='+ data.id.split('|')[0] + '&version=' + self.catalog().util().unTrimVersion(data.version);
            utils.trace('deepLinkUrl : '+deepLinkUrl);
            // create url by getting information from 'data' 
            self.navToDetailsLink.url = deepLinkUrl;
        };        
        
        
        //  START - dynamic actions menu launch implementations
        self.getActionMenuDetails = function(data) {
            utils.trace('getActionMenuDetails', data);
            var menu_json = {
                'menuItems': []
            };
            menu_json.menuItems.push({
                'menu_id': 'view_menu_id',
                'obj_id': data.id,
                'label': 'View',
                'action_handler': 'viewActionMenuItemHandler'
            });
            
            if( data.status != "ACTIVATED") {
                if( data.projectType === "PREBUILT") {
                    menu_json.menuItems.push({
                        'menu_id': 'customize_menu_id',
                        'obj_id': data.id,
                        'label': 'Customize',
                        'action_handler': 'customizeActionMenuItemHandler'
                    });
                }            
                else {
                    menu_json.menuItems.push({
                        'menu_id': 'edit_menu_id',
                        'obj_id': data.id,
                        'label': 'Edit',
                        'action_handler': 'editActionMenuItemHandler'
                    });
                }
            }
            menu_json.menuItems.push({
                'menu_id': 'clone_menu_id',
                'obj_id': data.id,
                'label': 'Clone',
                'action_handler': 'cloneActionMenuItemHandler'
            });
         
            menu_json.menuItems.push({
                'menu_id': 'create_version_menu_id',
                'obj_id': data.id,
                'label': 'Create Version',
                'action_handler': 'createVersionActionMenuItemHandler'
            });
            menu_json.menuItems.push({
                'menu_id': 'export_version_menu_id',
                'obj_id': data.id,
                'label': 'Export',
                'action_handler': 'exportActionMenuItemHandler'
            });
            menu_json.menuItems.push({
                'menu_id': 'download_artifacts_menu_id',
                'obj_id': data.id,
                'label': 'Download Artifacts',
                'action_handler': 'downloadArtifactsActionMenuItemHandler'
            });
            menu_json.menuItems.push({
                'menu_id': 'delete_menu_id',
                'obj_id': data.id,
                'label': 'Delete',
                'action_handler': 'deleteActionMenuItemHandler'
            });
            
            if( data.status === "ACTIVATED") {
                menu_json.menuItems.push({
                    'menu_id': 'deactivate_menu_id',
                    'obj_id': data.id,
                    'label': 'Deactivate',
                    'action_handler': 'deactivateActionMenuItemHandler'
                });            
                if (data.scheduleApplicable) {
                    menu_json.menuItems.push({
                        'menu_id': 'srunnow_menu_id',
                        'obj_id': data.id,
                        'label': 'Submit Now',
                        'action_handler': 'submitnowActionMenuItemHandler'
                    });              
                }
            };

            if( data.status === "DEACTIVATED") {
                if (data.scheduleApplicable) {
                    menu_json.menuItems.push({
                        'menu_id': 'schedule_menu_id',
                        'obj_id': data.id,
                        'label': data.scheduleDefined ? 'Schedule' : 'Add Schedule',
                        'action_handler': 'scheduleActionMenuItemHandler'
                    });                
                }
                menu_json.menuItems.push({
                    'menu_id': 'activate_menu_id',
                    'obj_id': data.id,
                    'label': 'Activate',
                    'action_handler': 'activateActionMenuItemHandler'
                });
            };            
            
            if( data.status === "ACTIVATED" || data.status === "DEACTIVATED") {
                menu_json.menuItems.push({
                    'menu_id': 'map_to_insight_menu_id',
                    'obj_id': data.id,
                    'label': 'Map to Insight',
                    'action_handler': 'mapToInsightActionMenuItemHandler'
                });
                menu_json.menuItems.push({
                    'menu_id': 'insight_console_menu_id',
                    'obj_id': data.id,
                    'label': 'Insight Console',
                    'action_handler': 'insightConsoleActionMenuItemHandler'
                });
            };
            
            if( data.status === "LOCKED") {
                menu_json.menuItems.push({
                    'menu_id': 'unlock_menu_id',
                    'obj_id': data.id,
                    'label': 'Unlock',
                    'action_handler': 'unlockActionMenuItemHandler'
                });              
            }
            
            return menu_json;
        };
        
        self.viewActionMenuItemHandler = function(data, event) {
            utils.trace("viewActionMenuItemHandler : "+data);
        };
        
        self.editActionMenuItemHandler = function(data, event) {
            utils.trace("editActionMenuItemHandler : "+data);
        };
        
        self.customizeActionMenuItemHandler = function(data, event) {
            utils.trace("customizeActionMenuItemHandler : "+data);
        };        

        self.scheduleActionMenuItemHandler = function(data, event) {
            utils.trace("scheduleActionMenuItemHandler : "+data);
        };      

        self.submitnowActionMenuItemHandler = function(data, event) {
            utils.trace("submitnowActionMenuItemHandler : "+data);
        };  

        self.cloneActionMenuItemHandler = function(data, event) {
            utils.trace("cloneActionMenuItemHandler : " ,data);
            self.cloneIntegration(data, event);
        };
        
        self.cloneIntegration = function(data, event) {
            utils.trace("cloneIntegration2 : ", data);
            self.catalog().closeCatalogDialog(data, event); // close the dialog
            var url = self.restURL + '/' + data.id + '/' + 'clone';
            var e = utils.getRandomInteger(1, 9999);
            var clonedata = {
                "code":"SC2RNSYNC",
                "version": "04.01." + e,
                "name" : "Clone4" + (999 - e),
                "packageName": "MyPackage",
                "description" : "xxxxx" };

            utils.cloneResource(url, clonedata, self.catalog());
            //self.catalog().serverCommunicationHandler().postData(url, {}, clonedata, false, false, "application/json", self.cloneIntegrationCallback);//NOT WORKING
                
            //self.catalog().refresh();
        };
        
        self.cloneIntegrationCallback = function(response) {
            utils.trace("cloneIntegrationCallback response : ", response);           
            self.catalog().closeCatalogDialog();
               
            if (response) {
                if (response.status == 200) {
                    self.catalog().refresh();
                }
            }
        };            
        
        self.createVersionActionMenuItemHandler = function(data, event) {
            utils.trace("createVersionActionMenuItemHandler : "+data);
        };
        
        self.exportActionMenuItemHandler = function(data, event) {
            utils.trace("exportActionMenuItemHandler : ", data);
            var path = self.restURL + '/' + data.id + '/' + 'archive';
            var fileName = data.id.split('|').join('_') + '.iar';

            utils.exportResource(path, fileName, self.catalog());
             
        };
        
        self.downloadArtifactsActionMenuItemHandler = function(data, event) {
            utils.trace("downloadArtifactsActionMenuItemHandler : "+data);
        };

        self.deleteActionMenuItemHandler = function(data, event) {
            var dlgData;
            var template;
            var dialog = self.catalog().dialogGenerator().createDialog();

            if (data.status === 'ACTIVATED') {
                    template = self.catalog().usageContentTemplate();
                    dlgData = self.catalog().usageContentTemplateData();

                    dlgData.title = 'Integration Is Active';
                    dlgData.metadata_name = data.name + ' (' + data.version + ')';
                    dlgData.metadata_inuse_description = 'Integration cannot be deleted at this time because it is active. Deleting this integration would prevent any in-progress requests from completing. It would also break any metrics collection on the data processed by this integration. Deactivate the integration first and then delete it.';
            }
            else if (data.status === 'LOCKED') {
                    template = self.catalog().usageContentTemplate();
                    dlgData = self.catalog().usageContentTemplateData();

                    dlgData.title = 'Integration Is Locked';
                    dlgData.metadata_name = data.name + ' (' + data.version + ')';
                    dlgData.metadata_inuse_description = 'Integration cannot be deleted at this time because it is locked. Unlock the integration first and then delete it.';
            } 
            else {
                    template = self.catalog().deleteConfirmContentTemplate();
                    dlgData = self.catalog().deleteConfirmContentTemplateData();

                    dlgData.title = 'Delete Integration?';
                    dlgData.metadata_name = data.name + ' (' + data.version + ')';
                    dlgData.id = data.id;
                    dlgData.confirmFunction = self.deleteIntegration;
                    dlgData.id = data.id;
            }
            dialog.setDialogTemplateContent(template);
            dialog.setDialogData(dlgData);
            dialog.launch();
        };
        
        self.deleteIntegration = function(data, event) {
            utils.trace("deleteIntegration data : ", data);
            utils.trace("deleteIntegration event : ", event);
            self.catalog().closeCatalogDialog(data, event); // close the dialog
            var url = self.restURL + '/' + data.id;

            var response = self.catalog().serverCommunicationHandler().deleteData(url);
            utils.trace("deleteIntegration response : ", response);

           if (response) {
               if (response.status == 200) {
                    self.catalog().refresh();
               }
           }
        };        
        
        self.mapToInsightActionMenuItemHandler = function(data, event) {
            utils.trace("mapToInsightActionMenuItemHandler : "+data);
        };
        
        self.insightConsoleActionMenuItemHandler = function(data, event) {
            utils.trace("insightConsoleActionMenuItemHandler : "+data);
        };
        
        self.unlockActionMenuItemHandler = function(data, event) {
            utils.trace("iunlockActionMenuItemHandler : "+data);
        };        
        
        self.activateActionMenuItemHandler = function(data, event) {
            utils.trace("activateActionMenuItemHandler : ", data);
            
            var dialog = self.catalog().dialogGenerator().createDialog();
            var dlgData = activateDialogData.getDefault();

            dlgData.metadata_name = data.name + ' (' + data.version + ')';
            dlgData.id = data.id;
            dlgData.confirmFunction = self.activateIntegration;  
            dialog.setDialogTemplateContent(activateDialog);
            dialog.setDialogData(dlgData);
            dialog.launch();              
        };
        
        self.activateIntegration = function(data, event) {
            utils.trace("activateIntegration : ", data);
            self.catalog().closeCatalogDialog(data, event); 
            var url = self.restURL + '/' + data.id + '/';
            
            var updatedata = {
                "status": "ACTIVATED",
                "tracingEnabledFlag": data.getTracing(), 
                "payloadTracingEnabledFlag": data.getPayload()
                };

            //self.catalog().serverCommunicationHandler().postData(url, {'X-HTTP-Method-Override': 'PATCH'}, JSON.stringify(updatedata), false, false, "json", self.activateIntegrationCallback); //NOT WORKING
            utils.updateResource(url, updatedata, self.catalog());
        };        

        self.activateIntegrationCallback = function(response) {
            utils.trace("activateIntegrationCallback response : ", response);           
            
            self.catalog().closeCatalogDialog();
               
            if (response) {
                if (response.status == 200) {
                    self.catalog().refresh();
                }
            }
        };           
            
        self.deactivateActionMenuItemHandler = function(data, event) {
            utils.trace("deactivateActionMenuItemHandler : ", data);
            var dialog = self.catalog().dialogGenerator().createDialog();
            var template = self.catalog().deleteConfirmContentTemplate();
            var dlgData = self.catalog().deleteConfirmContentTemplateData();

            dlgData.title = 'Deactivate Integration?';
            dlgData.metadata_name = data.name + ' (' + data.version + ')';
            dlgData.id = data.id;
            dlgData.confirmFunction = self.deactivateIntegration;
            dlgData.confirmButtonLabel = 'Deactivate';
            dialog.setDialogTemplateContent(template);
            dialog.setDialogData(dlgData);
            dialog.launch();            
        };
        
        self.deactivateIntegration = function(data, event) {
            utils.trace("deactivateIntegration : ", data);
            self.catalog().closeCatalogDialog(data, event);
            var url = self.restURL + '/' + data.id + '/';

            var updatedata = {
                "status": "CONFIGURED",
                "tracingEnabledFlag": false, 
                "payloadTracingEnabledFlag": false
                };

            //self.catalog().serverCommunicationHandler().postData(url, {}, updatedata, false, false, "application/json", self.deactivateIntegrationCallback); //NOT WORKING 
             utils.updateResource(url, updatedata, self.catalog());
        };              

       
        self.deactivateIntegrationCallback = function(response) {
            utils.trace("deactivateIntegrationCallback response : ", response);           
            
            self.catalog().closeCatalogDialog();
               
            
            if (response) {
                if (response.status == 200) {
                    self.catalog().refresh();
                }
            }       
        };
        // launch info popup listener
        self.launchInfoPopupEventListener = function(data, event) {
            var actualRowData = self.getActualData(data.id);
            utils.trace("launchInfoPopupEventListener actualRowData: ", actualRowData);
            utils.trace("launchInfoPopupEventListener data: ", data);
            var popupData = {
                items : [
                    { label:'Name', value: actualRowData.name },
                    { label:'Identifier', value: actualRowData.id.split('|')[0] },
                    { label:'Version', value: actualRowData.id.split('|')[1] },
                    { label:'Updated', value: new Date(actualRowData.lastUpdated).toUTCString() },
                    { label:'Updated By', value: actualRowData.lastUpdatedBy },
                    { label:'Created', value: new Date(actualRowData.created).toUTCString() },
                    { label:'Created By', value: actualRowData.createdBy }                
                ]
            };

            if (utils.isValidString(data.packageName)) {
                //popupData.items.unshift({ label:'Endpoint URL', value: actualRowData.endPointURI });
                popupData.items.push({ label:'Package', value: data.packageName });
            }              
            if (data.traceEnabled) {
                var trace = 'Trace Enabled';
                if (data.payloadEnabled) {
                    trace = 'Trace Enabled with Payload';
                }
                popupData.items.push({ label:'Tracing', value: trace });
            }   
            
            if (data.locked === true) {
                popupData.items.push({ label:'Locked', value: data.locked });
            }              
            
            if (utils.isValidString(actualRowData.description)) {
                popupData.items.push({ label:'Description', value: actualRowData.description  });
            }                
            
            var popup = self.catalog().popupGenerator().createPopup(popupData);
            popup.launch(event.currentTarget.id);
        };          
        
        self.getDetailsData = function(id) {
            var result = self.catalog().serverCommunicationHandler().fetchData(self.restURL + '/' + id);
            utils.trace("getDetailsData for " + id + " : ", result);
            return result;
        };       
        
        self.getConnectionDetailsData = function(id) {
            var result = self.catalog().serverCommunicationHandler().fetchData('/icsapis/v2/connections' + '/' + id);
            utils.trace("getConnectionDetailsData " + id + " : ", result);
            return result;        
        };
        
        self.getAdapterDetailsData = function(id) {
            var result = self.catalog().serverCommunicationHandler().fetchData('/icsapis/v2/adapters' + '/' + id);
            utils.trace("getAdapterDetailsData " + id + " : ", result);
            return result;        
        };        
        
        self.getType = function(jsonRow) {
          var style = jsonRow.styleDescription;
          var pattern = jsonRow.patternDescription == 'Notification' || jsonRow.patternDescription == 'Map Data' ? jsonRow.patternDescription : jsonRow.pattern == 'File Transfer' || jsonRow.pattern == 'Schedule' ? 'Schedule' : jsonRow.pattern;
          var text = style + ": " + pattern;
          //return text;
          return jsonRow.pattern;
        };
    }
    return new listViewModel;
});
