/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/**
 * filterPanelModel module
 */
define(['ojs/ojcore', 'knockout'
], function (oj, ko) {
    /**
     * The view model for the main content view template
     */
    function filterPanelViewModel() {
        var self = this;
        
        // START --- Add sorting menu items 
        self.sortMenuItemsMap = {};

        // ---- END --- Add sorting menu items 
        // START --- Add filter menu items
        self.filterMenuItems = [];
        self.filterMenuItems.push(
                    {   key: 'type', 
                        label: 'Type',
                        filterMenuItems: [
                            {
                                key: 'type-preinstalled',
                                label: 'Prebuilt',
                                matchKey: 'projectType',
                                //matchValue: 'PREINSTALLED'
                                matchValue: true
                            },
                            {
                                key: 'type-private',
                                label: 'Developed',
                                matchKey: 'projectType',
                                //matchValue: 'PRIVATE'
                                matchValue: false
                            }
                        ]
                    }
                );
        // END --- filter menu items
    }
    
    return new filterPanelViewModel;
});

