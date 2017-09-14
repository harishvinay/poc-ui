/**
 * listViewModel module
 */
define(['ojs/ojcore', 'knockout'
], function (oj, ko) {
    
    function listViewModel() {
        var self = this;
        
        self.restURL = "/icsapis/v2/users";//MISSING
        
        // Customize method to create common row data based on the resource type and its rest response.
        // This method needs to be passed as a function parameter to initialize common catalog data model
        self.constructRowData = function(jsonRow) {
            var rData = self.catalog().rowData();
            rData.id = jsonRow.id;
            rData.name = jsonRow.name;
            rData.description = jsonRow.description;
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
            console.log('certificate - navToDetailsActionListener');
            /*
            self.navToDetailsLink.type = 'URL';     
        
            var pathName = window.location.pathname;
            pathName = pathName.replace('/faces/global','');
            var deepLinkUrl = window.location.origin + pathName + '/faces/link?page=integration&code='+ data.id.split('|')[0] + '&version=' + self.catalog().util().unTrimVersion(data.version);
            console.log('deepLinkUrl : '+deepLinkUrl);
            // create url by getting information from 'data' 
            self.navToDetailsLink.url = deepLinkUrl;
            */
        };        
        
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
                'menu_id': 'manage_menu_id',
                'obj_id': data.id,
                'label': 'Manage Roles',
                'action_handler': 'manageActionMenuItemHandler'
            });
            
            menu_json.menuItems.push({
                'menu_id': 'delete_menu_id',
                'obj_id': data.id,
                'label': 'Delete',
                'action_handler': 'deleteActionMenuItemHandler'
            });
            menu_json.menuItems.push({
                'menu_id': 'change_menu_id',
                'obj_id': data.id,
                'label': 'Change Password',
                'action_handler': 'changeActionMenuItemHandler'
            });
            return menu_json;
        };
        
        self.editActionMenuItemHandler = function(data, event) {
            console.log("editActionMenuItemHandler : "+data);
        };
        
        self.manageActionMenuItemHandler = function(data, event) {
            console.log("manageActionMenuItemHandler : "+data);
        };
        
        self.deleteActionMenuItemHandler = function(data, event) {
            console.log("deleteActionMenuItemHandler : "+data);
        };
        
        self.changeActionMenuItemHandler = function(data, event) {
            console.log("changeActionMenuItemHandler : "+data);
        };        
    }
    
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