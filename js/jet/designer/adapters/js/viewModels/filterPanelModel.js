/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/**
 * filterPanelModel module
 */
define(['ojs/ojcore', 'knockout'], function (oj, ko) {

    function filterPanelViewModel() {
        var self = this;
        
        self.sortMenuItemsMap = {};//default sort by NAME

        self.filterMenuItems = [];
        self.filterMenuItems.push({   
            key: 'type', 
            label: 'Type',
            filterMenuItems: [
                {
                    key: 'type-preinstalled',
                    label: 'Preinstalled',
                    matchKey: 'type',
                    matchValue: 'PREINSTALLED'
                },
                {
                    key: 'type-private',
                    label: 'Private',
                    matchKey: 'type',
                    matchValue: 'PRIVATE'
                },
                {
                    key: 'type-marketplace',
                    label: 'Marketplace',
                    matchKey: 'type',
                    matchValue: 'MARKETPLACE'
                }
            ]
        });
    }
    
    return new filterPanelViewModel;
});

