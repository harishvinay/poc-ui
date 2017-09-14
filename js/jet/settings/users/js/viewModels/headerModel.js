/**
 * header module
 */
define(['ojs/ojcore', 'knockout'
], function (oj, ko) {
    /**
     * The view model for the main content view template
     */
    function headerViewModel() {
        var self = this;
        
        self.headerText = 'Users';
        self.headerButtons = [];
        
        // click action handlers
        self.createActionHandler = function(data, event) {
            alert('Create User...');
        };
        
        // create header buttons and set its actions
        self.headerButtons.push({
                    "id": 'create_btn_id',
                    "label": 'Create',
                    "clickEventHandler": self.createActionHandler
                    });
    }
    return new headerViewModel;
});
