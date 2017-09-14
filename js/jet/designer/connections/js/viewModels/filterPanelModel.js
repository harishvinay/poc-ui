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
                                              
        self.sortMenuItemsMap['type-asc'] = { key: 'type', 
                                              direction: 'ascending',
                                              label: 'Type',
                                              icon: 'sort-descending-icon',
                                              title: 'Ascending'};                                              

        // ---- END --- Add sorting menu items 
        // START --- Add filter menu items
        self.filterMenuItems = [];
        self.filterMenuItems.push(
                    {   key: 'status', 
                        label: 'Status',
                        filterMenuItems: [
                            {
                                key: 'status-draft',
                                label: 'Draft',
                                matchKey: 'status',
                                matchValue: 'INPROGRESS'
                            },
                            {
                                key: 'status-configured',
                                label: 'Configured',
                                matchKey: 'status',
                                matchValue: 'CONFIGURED'
                            }
                        ]
                    }
                );
        self.filterMenuItems.push(
                    {   key: 'role', 
                        label: 'Role',
                        filterMenuItems: [
                            {
                                key: 'role-trigger',
                                label: 'Trigger',
                                matchKey: 'role',
                                matchValue: 'SOURCE'
                            },
                            {
                                key: 'role-invoke',
                                label: 'Invoke',
                                matchKey: 'role',
                                matchValue: 'TARGET'
                            },
                            {
                                key: 'role-trigger_and_invoke',
                                label: 'Trigger & Invoke',
                                matchKey: 'role',
                                matchValue: 'SOURCE_AND_TARGET'
                            }
                        ]
                    }
                );
        // END --- filter menu items
    }
    
    return new filterPanelViewModel;
});

