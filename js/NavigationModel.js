"use strict";
define(['knockout'], function(ko) {  

    return function(toggle) {
        var self = this;
        var navKeys = [];
        self.adfComp = "pt1:bBarFDC:logo";
        self.listener = "setWhichPage";
        
        self.working = false;
        
        self.navMenuLabel = ko.observable();
        self.showHamburger = ko.observable(false);
        self.showNav = ko.observable(true);
        self.hidden = false;
        self.nav = [];
        
        self.toggle = toggle;
        self.selectedId = "welcome";
        
        self.setGroupedSelectedId = function() {
            if (self.selectedId == 'runtime' || self.selectedId == 'systemhealth' || self.selectedId == 'designtimemetrics') {
                self.selectedId = 'dashboards';
            }
            else if (self.selectedId == 'integrationMonitoringPage' || self.selectedId == 'activityStreamLoggerView') {
                self.selectedId = 'integrations';
            }
            else if (self.selectedId == 'errorFlowLanding' || self.selectedId == 'errorConnection' || self.selectedId == 'errorMessages' || self.selectedId == 'resubBatchLanding') {
                self.selectedId = 'errors';
            }            
        }
        
        self.isNav = function(key) {            
            if (navKeys.length == 0 && self.nav.length > 0) {
                buildKeys(self.nav);
            }
            
            function buildKeys(items){
                items = items.forEach(function(item) {
                    navKeys.push(item.attr.id);
                    if (Array.isArray(item.children)) {
                        buildKeys(item.children);
                    }
                });
            }
            
            return navKeys.indexOf(key) != -1;   
        }

        function ics_resource(str){
            return str;
        }
        
        self.localize = function() { 
            self.navMenuLabel(ics_resource("NAV_MENU"));
            
            var itemsToRemove = [];
            navKeys = [];
            
            //Removal rules
            //Add navigation items that should be removed at login time so they don't show up in menu bar
            /* onPremise + admin : display users; */
            /* onPremise : remove agents, agentmon */
            if (!ics_getUsersPageAccessible()) {
                itemsToRemove.push("users");
                itemsToRemove.push("users_jet");
            }
            if (!ics_getAgentsPageAccessible()){
                itemsToRemove.push("agents");
                itemsToRemove.push("agentmon");
            }
            if (!ics_isPreviewFeatureMode()) {
                itemsToRemove.push("apilibrary_jet");
                itemsToRemove.push("composer_jet");
                itemsToRemove.push("package_jet");
                itemsToRemove.push("adapter_jet");
                itemsToRemove.push("applications_jet");
                itemsToRemove.push("dvm_jet");
                itemsToRemove.push("agents_jet");
                itemsToRemove.push("certificate_jet");                
            }            
            //Removal rules
            
            if (self.nav.length == 0) {
                var nav = [
                   {
                    "attr":{
                     "id":"welcome",
                     "label":ics_resource("INTEGRATION_NAME"),
                     "type":"JQUERY",
                     "executeOnBack":true,
                     "properties":{
                        "event":"rootNav",
                        "page":"welcome"
                     }
                  },
                  "children":[
                     {
                        "attr":{
                           "id":"catalog",
                           "icon":"CATALOG",
                           "label":ics_resource("DESIGNER_TITLE")
                        },
                        "children":[
                           {
                              "attr":{
                                 "id":"composer",
                                 "icon":"INTEGRATIONS_LIST",
                                 "label":ics_resource("INTEGRATION_NAME"),
                                 "type":"ADF",
                                 "properties":{
                                    "event":"rootNav",
                                    "source":self.adfComp,
                                    "listener":self.listener,
                                    "page":"composer"
                                 }
                              }
                           },
                           {
                              "attr":{
                                 "id":"composer_jet",
                                 "icon":"INTEGRATIONS_LIST",
                                 "label":ics_resource("INTEGRATION_NAME") + " (JET | Preview)",                                 
                                 "type":"ADF",
                                 "properties":{
                                    "event":"rootNav",
                                    "source":self.adfComp,
                                    "listener":self.listener,
                                    "page":"composer_jet"
                                 }
                              }
                           },                           
                           {
                              "attr":{
                                 "id":"applications",
                                 "icon":"CONNECTIONS",
                                 "label":ics_resource("CONNECTIONS_NAME"),
                                 "type":"ADF",
                                 "properties":{
                                    "event":"rootNav",
                                    "source":self.adfComp,
                                    "listener":self.listener,
                                    "page":"applications"
                                 }
                              }
                           },
                           {
                              "attr":{
                                 "id":"applications_jet",
                                 "icon":"CONNECTIONS",
                                 "label":ics_resource("CONNECTIONS_NAME") + " (JET | Preview)",                                 
                                 "type":"ADF",
                                 "properties":{
                                    "event":"rootNav",
                                    "source":self.adfComp,
                                    "listener":self.listener,
                                    "page":"applications_jet"
                                 }
                              }
                           },                            
                           {
                              "attr":{
                                 "id":"dvm",
                                 "icon":"LOOKUPS",
                                 "label":ics_resource("LOOKUPS_NAME"),
                                 "type":"ADF",
                                 "properties":{
                                    "event":"rootNav",
                                    "source":self.adfComp,
                                    "listener":self.listener,
                                    "page":"dvm"
                                 }
                              }
                           },
                           {
                              "attr":{
                                 "id":"dvm_jet",
                                 "icon":"LOOKUPS",
                                 "label":ics_resource("LOOKUPS_NAME") + " (JET | Preview)",                                 
                                 "type":"ADF",
                                 "properties":{
                                    "event":"rootNav",
                                    "source":self.adfComp,
                                    "listener":self.listener,
                                    "page":"dvm_jet"
                                 }
                              }
                           },                             
                           {
                              "attr":{
                                 "id":"package",
                                 "icon":"PACKAGES",
                                 "label":ics_resource("PACKAGES"),
                                 "type":"ADF",
                                 "properties":{
                                    "event":"rootNav",
                                    "source":self.adfComp,
                                    "listener":self.listener,
                                    "page":"package"
                                 }
                              }
                           },
                           {
                              "attr":{
                                 "id":"package_jet",
                                 "icon":"PACKAGES",
                                 "label":ics_resource("PACKAGES") + " (JET | Preview)",                                 
                                 "type":"ADF",
                                 "properties":{
                                    "event":"rootNav",
                                    "source":self.adfComp,
                                    "listener":self.listener,
                                    "page":"package_jet"
                                 }
                              }
                           },                             
                           {
                              "attr":{
                                 "id":"agents",
                                 "icon":"AGENTS",
                                 "label":ics_resource("AGENTS"),
                                 "type":"ADF",
                                 "properties":{
                                    "event":"rootNav",
                                    "source":self.adfComp,
                                    "listener":self.listener,
                                    "page":"agents"
                                 }
                              }
                           },
                           {
                              "attr":{
                                 "id":"agents_jet",
                                 "icon":"AGENTS",
                                 "label":ics_resource("AGENTS") + " (JET | Preview)",                                 
                                 "type":"ADF",
                                 "properties":{
                                    "event":"rootNav",
                                    "source":self.adfComp,
                                    "listener":self.listener,
                                    "page":"agents_jet"
                                 }
                              }
                           },                               
                           {
                              "attr":{
                                 "id":"adapter",
                                 "icon":"ADAPTERS",
                                 "label":ics_resource("ADAPTER_TITLE"),
                                 "type":"ADF",
                                 "properties":{
                                    "event":"rootNav",
                                    "source":self.adfComp,
                                    "listener":self.listener,
                                    "page":"adapter"
                                 }
                              }
                           },
                           {
                              "attr":{
                                 "id":"adapter_jet",
                                 "icon":"ADAPTERS",
                                 "label":ics_resource("ADAPTER_TITLE") + " (JET | Preview)",                                 
                                 "type":"ADF",
                                 "properties":{
                                    "event":"rootNav",
                                    "source":self.adfComp,
                                    "listener":self.listener,
                                    "page":"adapter_jet"
                                 }
                              }
                           },                                
                           {
                              "attr":{
                                 "id":"apilibrary",
                                 "icon":"LIBRARIES",
                                 "label":ics_resource("API_LIBRARY_NAVIGATION_TILE_NAME"),
                                 "type":"ADF",
                                 "properties":{
                                    "event":"rootNav",
                                    "source":self.adfComp,
                                    "listener":self.listener,
                                    "page":"apilibrary"
                                 }
                              }
                           },
                           {
                              "attr":{
                                 "id":"apilibrary_jet",
                                 "icon":"LIBRARIES",
                                 "label":ics_resource("API_LIBRARY_NAVIGATION_TILE_NAME") + " (JET | Preview)",                                 
                                 "type":"ADF",
                                 "properties":{
                                    "event":"rootNav",
                                    "source":self.adfComp,
                                    "listener":self.listener,
                                    "page":"apilibrary_jet"
                                 }
                              }
                           }                           
                        ]
                     },
                     {
                        "attr":{
                           "id":"monitoring",
                           "icon":"MONITORING_INTEGRATIONS",
                           "label":ics_resource("MONITORING_TITLE")
                        },
                        children:[
                           {
                              "attr":{
                                 "id":"dashboards",
                                 "icon":"DASHBOARDS",
                                 "label":ics_resource("DASHBOARDS"),
                                 "type":"ADF",
                                 "properties":{
                                   "event":"rootNav",
                                   "source":self.adfComp,
                                   "listener":self.listener,
                                   "page":"runtime"
                                 }                           
                              }
                           },
                           {
                              "attr":{
                                 "id":"integrations",
                                 "icon":"INTEGRATIONS_LIST",
                                 "label":ics_resource("INTEGRATIONS_TITLE"),
                                   "type":"ADF",
                                   "properties":{
                                      "event":"rootNav",
                                      "source":self.adfComp,
                                      "listener":self.listener,
                                      "page":"integrationMonitoringPage"
                                   }                                 
                              }
                           },
                           {
                              "attr":{
                                 "id":"agentmon",
                                 "icon":"AGENTS",
                                 "label":ics_resource("AGENTS_NAVIGATION_LABEL"),
                                 "type":"ADF",
                                 "properties":{
                                    "event":"rootNav",
                                    "source":self.adfComp,
                                    "listener":self.listener,
                                    "page":"agentmon"
                                 }
                              }
                           },
                           {
                              "attr":{
                                 "id":"tracking",
                                 "icon":"TRACKING",
                                 "label":ics_resource("TRACKING"),
                                 "type":"ADF",
                                 "properties":{
                                    "event":"rootNav",
                                    "source":self.adfComp,
                                    "listener":self.listener,
                                    "page":"tracking",
                                    "checkTimeInterval":true
                                 }
                              }
                           }, 
                          {
                              "attr":{
                                "id":"trackingRunsView",
                                "icon":"RUNS",
                                "label":ics_resource("RUNS"),
                                "type":"ADF",
                                "properties":{
                                    "event":"rootNav",
                                    "source":self.adfComp,
                                    "listener":self.listener,
                                    "page":"trackingRunsView",
                                    "checkTimeInterval":true
                                }
                              }
                           },
                           {
                              "attr":{
                                 "id":"errors",
                                 "icon":"ERRORS",
                                 "label":ics_resource("EH_ERRBOARD_MSG"),
                                   "type":"ADF",
                                   "properties":{
                                      "event":"rootNav",
                                      "source":self.adfComp,
                                      "listener":self.listener,
                                      "page":"errorMessages",
                                      "checkTimeInterval":true
                                   }                                 
                              }
                           }
                        ]
                     },
                     {
                        "attr":{
                           "id":"admin",
                           "icon":"SETTINGS",
                           "label":ics_resource("ADMIN_TITLE")
                        },
                        "children":[
                            {
                              "attr":{
                                 "id":"users",
                                 "icon":"USERS",
                                 "label":ics_resource("USERS_TITLE"),
                                 "type":"ADF",
                                 "properties":{
                                    "event":"rootNav",
                                    "source":self.adfComp,
                                    "listener":self.listener,
                                    "page":"users"
                                 }
                              }
                            },
                            {
                              "attr":{
                                 "id":"users_jet",
                                 "icon":"USERS",
                                 "label":ics_resource("USERS_TITLE") + " (JET | Preview)",
                                 "type":"ADF",
                                 "properties":{
                                    "event":"rootNav",
                                    "source":self.adfComp,
                                    "listener":self.listener,
                                    "page":"users_jet"
                                 }
                              }
                            },                            
                           {
                              "attr":{
                                 "id":"certificate",
                                 "icon":"RECOMMENDATIONS",
                                 "label":ics_resource("CERTIFICATE_TITLE"),
                                 "type":"ADF",
                                 "properties":{
                                    "event":"rootNav",
                                    "source":self.adfComp,
                                    "listener":self.listener,
                                    "page":"certificate"
                                 }
                              }
                           },
                           {
                              "attr":{
                                 "id":"certificate_jet",
                                 "icon":"RECOMMENDATIONS",
                                 "label":ics_resource("CERTIFICATE_TITLE") + " (JET | Preview)",                                 
                                 "type":"ADF",
                                 "properties":{
                                    "event":"rootNav",
                                    "source":self.adfComp,
                                    "listener":self.listener,
                                    "page":"certificate_jet"
                                 }
                              }
                           },                               
                           {
                              "attr":{
                                 "id":"notifications",
                                 "icon":"NOTIFICATIONS",
                                 "label":ics_resource("NOTIFICATIONS"),
                                 "type":"ADF",
                                 "properties":{
                                    "event":"rootNav",
                                    "source":self.adfComp,
                                    "listener":self.listener,
                                    "page":"notifications"
                                 }
                              }
                           },
                           {
                              "attr":{
                                 "id":"databaseconfiguration",
                                 "icon":"DATABASE",
                                 "label":ics_resource("DATABASE_CONFIG"),
                                 "type":"ADF",
                                 "properties":{
                                    "event":"rootNav",
                                    "source":self.adfComp,
                                    "listener":self.listener,
                                    "page":"databaseconfiguration"
                                 }
                              }
                           },
                           {
                              "attr":{
                                 "id":"loggers",
                                 "icon":"LOGGING_LEVELS",
                                 "label":ics_resource("LOGGERS"),
                                 "type":"ADF",
                                 "properties":{
                                    "event":"rootNav",
                                    "source":self.adfComp,
                                    "listener":self.listener,
                                    "page":"loggers"
                                 }
                              }
                           },
                           {
                              "attr":{
                                 "id":"recommendengine",
                                 "icon":"MANAGE_CERTIFICATES",
                                 "label":ics_resource("PREFERENCES_RE_LABEL"),
                                 "type":"ADF",
                                 "properties":{
                                    "event":"rootNav",
                                    "source":self.adfComp,
                                    "listener":self.listener,
                                    "page":"recommendengine"
                                 }
                              }
                           },
                           {
                              "attr":{
                                 "id":"apiics",
                                 "icon":"ADAPTERS",
                                 "label":ics_resource("API_ICS_LABEL"),
                                 "type":"JQUERY",
                                 "properties":{
                                    "event":"rootNav",
                                    "source":self.adfComp,
                                    "listener":self.listener,
                                    "page":"apiics"
                                 }
                              }
                           },

                            ]
                              }
                                                      
                        ]
                   }
                ];
                
                navKeys = [];
                
                if (itemsToRemove.length > 0 ) {
                    self.nav = recurseFilter(nav);
                } else {
                    self.nav = nav;
                }               
            }
            
            function recurseFilter(items){
                items = items.filter(function(item) {
                    var returnVal = true;
                    if (itemsToRemove.indexOf(item.attr.id) != -1) {
                        returnVal = false;
                    } else if (Array.isArray(item.children)) {
                        item.children = recurseFilter(item.children);
                    }
                    return returnVal;
                });
                
                return items;
            }            
        }
    }
});
