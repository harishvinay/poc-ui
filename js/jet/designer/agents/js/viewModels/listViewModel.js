/**
 * listViewModel module
 */
define(['ojs/ojcore', 'knockout'
], function (oj, ko) {
    
    function listViewModel() {
        var self = this;
        
        self.restURL = "/icsapis/v2/agents";//MISSING
        self.useDummyResponse = true;
        self.response = [];
        
        // Customize method to create common row data based on the resource type and its rest response.
        // This method needs to be passed as a function parameter to initialize common catalog data model
        self.constructRowData = function(jsonRow) {
            var rData = self.catalog().rowData();
            rData.id = jsonRow.id;
            rData.name = jsonRow.name;
            rData.description = jsonRow.description;

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
            console.log('agent - navToDetailsActionListener');
            /*
            self.navToDetailsLink.type = 'URL';     
        
            var pathName = window.location.pathname;
            pathName = pathName.replace('/faces/global','');
            var deepLinkUrl = window.location.origin + pathName + '/faces/link?page=integration&code='+ data.id.split('|')[0] + '&version=' + Catalog.util.unTrimVersion(data.version);
            console.log('deepLinkUrl : '+deepLinkUrl);
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
                'menu_id': 'view_menu_id',
                'obj_id': data.id,
                'label': 'View',
                'action_handler': 'viewActionMenuItemHandler'
            });

            menu_json.menuItems.push({
                'menu_id': 'agents_version_menu_id',
                'obj_id': data.id,
                'label': 'Agents',
                'action_handler': 'agentsActionMenuItemHandler'
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
            console.log("viewActionMenuItemHandler : "+data);
        };
        
        self.agentsActionMenuItemHandler = function(data, event) {
            console.log("agentsActionMenuItemHandler : "+data);
        };
        
        self.deleteActionMenuItemHandler = function(data, event) {
            console.log("deleteActionMenuItemHandler : "+data);
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
            if (actualRowData.description) { 
                popupData.items.unshift({ label:'Description', value: actualRowData.description });
            }            
            var popup = self.catalog().popupGenerator().createPopup(popupData);
            popup.launch(event.currentTarget.id);
        };           
        
    }
    return new listViewModel;
});
