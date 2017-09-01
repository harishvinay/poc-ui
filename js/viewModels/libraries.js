define(['ojs/ojcore', 'knockout', 'jquery', 'metadata-list-component'],
    function (oj, ko, $, CatalogApp) {

        function headerViewModel() {
            var self = this;

            self.headerText = 'Libraries';
            self.headerButtons = [];

            // Register button - click action handler
            self.registerActionHandler = function (data, event) {
                console.log('Register action handler : ');
                console.log(data);
                console.log(event);
            };

            // create header buttons and its actions
            self.headerButtons.push({
                "label": 'Register',
                "clickEventHandler": self.registerActionHandler
            });

        }

        function filterPanelViewModel() {
            var self = this;

            // START --- Add sorting menu items
            self.sortMenuItemsMap = {};
            self.sortMenuItemsMap['lastUpdate-desc'] = {
                key: 'modified',
                direction: 'descending',
                label: 'Last Update',
                icon: 'sort-ascending-icon',
                title: 'Descending'
            };

            self.sortMenuItemsMap['name-asc'] = {
                key: 'name',
                direction: 'ascending',
                label: 'Name',
                icon: 'sort-descending-icon',
                title: 'Ascending'
            };

            // ---- END --- Add sorting menu items
            // START --- Add filter menu items
            self.filterMenuItems = [];
            self.filterMenuItems.push({
                key: 'type',
                label: 'Type',
                filterMenuItems: [{
                    key: 'type-preinstalled',
                    label: 'Preinstalled',
                    matchKey: 'mode_type',
                    matchValue: 'PREINSTALLED'
                },
                    {
                        key: 'type-private',
                        label: 'Private',
                        matchKey: 'mode_type',
                        matchValue: 'PRIVATE'
                    }
                ]
            });
            // END --- filter menu items
        }

        function listViewModel() {
            var self = this;

            self.restURL = "/icsapis/v2/libraries";

            self.response = {
                "items": [{
                    "id": "RECURSIONTEST|1.0",
                    "calloutType": "PRIVATE",
                    "createdBy": "weblogic",
                    "createdDate": "2017-03-12T15:25:13.618+0000",
                    "displayName": "RecursionTest100",
                    "lastUpdatedBy": "weblogic",
                    "lastUpdatedDate": "2017-07-13T15:25:13.618+0000",
                    "libraryType": "API",
                    "status": "LOCKED",
                    "version": "1.0",
                    "usage": 5
                },

                    {
                        "id": "JSCALLOUT_FUNCTOFUNC|1.0",
                        "calloutType": "PRIVATE",
                        "createdBy": "weblogic",
                        "createdDate": "2017-03-12T15:24:44.549+0000",
                        "displayName": "JSCallout_FuncToFunc",
                        "lastUpdatedBy": "weblogic",
                        "lastUpdatedDate": "2017-03-12T15:24:44.549+0000",
                        "libraryType": "API",
                        "version": "1.0",
                        "status": "CONFIGURED"
                    },

                    {
                        "id": "LOANPROCESSAPI",
                        "calloutType": "PRIVATE",
                        "createdBy": "weblogic",
                        "createdDate": "2017-03-12T15:21:12.907+0000",
                        "displayName": "LoanProcessAPI",
                        "lastUpdatedBy": "weblogic",
                        "lastUpdatedDate": "2017-03-12T15:21:12.907+0000",
                        "libraryType": "API",
                        "version": "1.0.11",
                        "status": "INPROGRESS"
                    },

                    {
                        "id": "TESTAPILIBRARY",
                        "calloutType": "PRIVATE",
                        "createdBy": "weblogic",
                        "createdDate": "2017-03-12T15:21:11.335+0000",
                        "displayName": "TestAPILibrary",
                        "lastUpdatedBy": "weblogic",
                        "lastUpdatedDate": "2017-03-12T15:21:11.335+0000",
                        "libraryType": "API",
                        "version": "1.0.22",
                        "status": "INPROGRESS"
                    }
                ],
                "totalResults": 4
            };

            self.useDummyResponse = true;

            self.constructRowData = function (jsonRow) {
                var rData = self.catalog().rowData();

                rData.id = jsonRow.id;
                rData.code = jsonRow.id.split('|')[0];
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

            self.rowSelectionListener = function (data, event) {
            };

            self.myCustomNavToDetails = function (data, event) {
            };

            self.navToDetailsActionListener = function (data, event) {
                // type should be 'URL' for navigation using deep-link
                self.navToDetailsLink.type = 'CUSTOM';

                // create url by getting information from 'data'
                self.navToDetailsLink.customHandler = 'myCustomNavToDetails';
            };

            //  START - dynamic actions menu launch implementations
            self.getActionMenuDetails = function (data) {
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
                    'action_handler': 'editActionMenuItemHandler',
                    'disabled': data.status === 'CONFIGURED'
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
                if (data.status === 'CONFIGURED') {
                    menu_json.menuItems.push({
                        'menu_id': 'EXTRA_menu_id',
                        'obj_id': data.id,
                        'label': 'EXTRA Library File',
                        'action_handler': 'downloadLibraryFileActionMenuItemHandler'
                    });
                }
                return menu_json;
            };

            self.viewActionMenuItemHandler = function (data, event) {
            };

            self.editActionMenuItemHandler = function (data, event) {
            };

            self.deleteLibrary = function (data, event) {
                self.catalog().closeCatalogDialog(data, event);
            };

            self.deleteActionMenuItemHandler = function (data, event) {
                var dlgData;
                var template;
                var dialog = self.catalog().dialogGenerator().createDialog();

                if (data.usage > 0) {
                    template = self.catalog().usageContentTemplate();
                    dlgData = self.catalog().usageContentTemplateData();

                    dlgData.title = 'Library Is In Use';
                    dlgData.metadata_name = data.name + ' (' + data.version + ')';
                    dlgData.metadata_inuse_description = 'Library cannot be deleted at this time because ' + data.usage + ' integrations are using it. Deleting the library would invalidate these integrations. Active integrations would stop running. Remove the library from the integrations and then delete the library.';
                    dlgData.used_by_count_message = 'Integrations using this library: ' + data.usage;
                    dlgData.active_count_message = 'Active: 1';
                    dlgData.inactive_count_message = 'Inactive: 2';
                    dlgData.used_by = [{
                        'name': 'Integration1',
                        'active': false
                    },
                        {
                            'name': 'Integration2',
                            'active': false
                        },
                        {
                            'name': 'Integration3',
                            'active': false
                        },
                        {
                            'name': 'Integration4',
                            'active': true
                        },
                        {
                            'name': 'Integration5',
                            'active': false
                        }
                    ];
                } else {
                    template = self.catalog().deleteConfirmContentTemplate();
                    dlgData = self.catalog().deleteConfirmContentTemplateData();

                    dlgData.title = 'Delete Library?';
                    dlgData.metadata_name = data.name + ' (' + data.version + ')';
                    dlgData.confirmFunction = self.deleteLibrary;
                }

                dialog.setDialogTemplateContent(template);
                dialog.setDialogData(dlgData);
                dialog.launch();
            };

            self.downloadLibraryFileActionMenuItemHandler = function (data, event) {
            };
            //  END - dynamic actions menu launch implementations

            self.launchInfoPopupEventListener = function (data, event) {

                var actualRowData = self.getActualData(data.id);
                var popupData = {
                    items: [{
                        label: 'Description',
                        value: 'Example describing a simple callout functions usage, Call the endpoint as, https://<host>:<port>/ic/api/integration/v1/flows/rest/CONTACTMESSAGES/1.0/welcome?message1={value1}&message2={value2}'
                    },
                        {
                            label: 'Identifier',
                            value: actualRowData.id.split('|')[0]
                        },
                        {
                            label: 'Updated',
                            value: new Date(actualRowData.lastUpdatedDate).toUTCString()
                        },
                        {
                            label: 'Updated By',
                            value: actualRowData.lastUpdatedBy
                        },
                        {
                            label: 'Created',
                            value: new Date(actualRowData.createdDate).toUTCString()
                        },
                        {
                            label: 'Created By',
                            value: actualRowData.createdBy
                        }
                    ]
                };

                var popup = self.catalog().popupGenerator().createPopup(popupData);
                popup.launch(event.currentTarget.id);
            };

        }

        function ViewModel() {
            var self = this;

            self.createView = function () {
                return CatalogApp.catalogTemplate;
            };

            self.handleActivated = function (info) {
                self.catalog = CatalogApp.app.createInstance(headerModel, filterPanelModel, listViewModel, 'Library');
            };

            self.handleAttached = function (info) {
                // Implement if needed
            };

            self.handleBindingsApplied = function (info) {
                // Implement if needed
            };

            self.handleDetached = function (info) {
                // Implement if needed
            };
        }

        return new ViewModel();
    }
);
