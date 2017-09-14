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
        
        self.headerText = 'Agents';
        self.headerButtons = [];
        
        // click action handlers
        self.createActionHandler = function(data, event) {
            alert('Create Agent Group...');
        };
        
        //TODO 'Download' dropdown button
        
        // create header buttons and set its actions
        self.headerButtons.push({
            "id": 'create_btn_id',
            "label": 'Create Agent Group',
            "clickEventHandler": self.createActionHandler
            });
    }
    return new headerViewModel;
});
