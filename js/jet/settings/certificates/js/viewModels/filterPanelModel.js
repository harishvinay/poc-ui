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
        
        self.sortMenuItemsMap = {};

        self.filterMenuItems = [];
        self.filterMenuItems.push(
                    {   key: 'type', 
                        label: 'Type',
                        filterMenuItems: [
                            {
                                key: 'type-preinstalled',
                                label: 'Preinstalled',
                                matchKey: 'type',
                                matchValue: 'SYSTEM'
                            },
                            {
                                key: 'type-private',
                                label: 'Uploaded',
                                matchKey: 'type',
                                matchValue: 'USER'
                            }
                        ]
                    }
                );
    }
    
    return new filterPanelViewModel;
});

