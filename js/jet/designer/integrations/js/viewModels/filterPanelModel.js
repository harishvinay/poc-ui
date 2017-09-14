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
                                matchValue: 'DEACTIVATED'
                            },
                            {
                                key: 'status-active',
                                label: 'Active',
                                matchKey: 'status',
                                matchValue: 'ACTIVATED'
                            },
                            {
                                key: 'status-failed',
                                label: 'Failed',
                                matchKey: 'status',
                                matchValue: 'FAILED'
                            }
                        ]
                    }
                );
        self.filterMenuItems.push(
                    {   key: 'type', 
                        label: 'Type',
                        filterMenuItems: [
                            {
                                key: 'type-customized',
                                label: 'Customized',
                                matchKey: 'projectType',
                                matchValue: 'CUSTOMIZED'
                            },
                            {
                                key: 'type-developed',
                                label: 'Developed',
                                matchKey: 'projectType',
                                matchValue: 'DEVELOPED'
                            },
                            {
                                key: 'type-prebuilt',
                                label: 'Prebuilt',
                                matchKey: 'projectType',
                                matchValue: 'PREBUILT'
                            }
                        ]
                    }
                );
        self.filterMenuItems.push(
                    {   key: 'style', 
                        label: 'Style',
                        filterMenuItems: [
                            {
                                key: 'style-template',
                                label: 'Template',
                                matchKey: 'style',
                                matchValue: 'TEMPLATE'
                            },
                            {
                                key: 'style-orchestration',
                                label: 'Orchestration',
                                matchKey: 'style',
                                matchValue: 'FREEFORM'
                            }
                        ]
                    }
                );
        self.filterMenuItems.push(
                    {   key: 'pattern', 
                        label: 'Pattern',
                        filterMenuItems: [
                            {
                                key: 'pattern-schedule',
                                label: 'Schedule',
                                matchKey: 'pattern',
                                //matchValue: 'Schedule' || 'File Transfer'
                                matchValue: 'Schedule'
                            },
                            {
                                key: 'pattern-mapdata',
                                label: 'Map Data',
                                matchKey: 'patternDescription',
                                matchValue: 'Map Data'
                            },
                            {
                                key: 'pattern-notification',
                                label: 'Notification',
                                matchKey: 'patternDescription',
                                matchValue: 'Notification'
                            },
                            {
                                key: 'pattern-publish_to_ics',
                                label: 'Publish To IC',
                                matchKey: 'pattern',
                                matchValue: 'Publish To IC'
                            },
                            {
                                key: 'pattern-subscribe_to_ics',
                                label: 'Subscribe To IC',
                                matchKey: 'pattern',
                                matchValue: 'Subscribe To IC'
                            },
                            {
                                key: 'pattern-undefined',
                                label: 'Undefined',
                                matchKey: 'pattern',
                                matchValue: 'Undefined'
                            }
                        ]
                    }
                );
        // END --- filter menu items
    }
    return new filterPanelViewModel;
});

