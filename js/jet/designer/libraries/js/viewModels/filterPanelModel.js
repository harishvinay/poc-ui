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
        self.sortMenuItemsMap['lastUpdate-desc'] = { key: 'modified', 
                                                     direction: 'descending',
                                                     label: 'Last Update',
                                                     icon: 'sort-ascending-icon',
                                                     title: 'Descending'};
                                                
        self.sortMenuItemsMap['name-asc'] = { key: 'name', 
                                              direction: 'ascending',
                                              label: 'Name',
                                              icon: 'sort-descending-icon',
                                              title: 'Ascending'};

        // ---- END --- Add sorting menu items 
        // START --- Add filter menu items
        self.filterMenuItems = [];
        self.filterMenuItems.push(
                    {   key: 'type', 
                        label: 'Type',
                        filterMenuItems: [
                            {
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
                    }
                );
        // END --- filter menu items
    }
    
    return new filterPanelViewModel;
});

