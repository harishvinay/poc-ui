/**
 * header module
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'promise', 'ojs/ojlistview', 'ojs/ojarraytabledatasource', 'ojs/ojaccordion', 'ojs/ojcollapsible', 'ojs/ojradioset'], function (oj, ko, $) {
    
    function MetadataSelectData() {
        var self = this;

        var defaultData = function () {
        
            var source1 = [{name: 'Settings', version: '10.3.6', nodes: 2, cpu: 2, type: 'Java Cloud Service Virtual Image', balancer: 1, memory: 8},
                    {name: 'Tools', version: '10.3.6', nodes: 2, cpu: 2, type: 'Java Cloud Service Virtual Image', balancer: 1, memory: 8},
                    {name: 'Base', version: '10.3.6', nodes: 2, cpu: 2, type: 'Java Cloud Service Virtual Image', balancer: 1, memory: 8},
                    {name: 'Environment', version: '10.3.6', nodes: 2, cpu: 2, type: 'Java Cloud Service Virtual Image', balancer: 1, memory: 8},
                    {name: 'Security', version: '10.3.6', nodes: 2, cpu: 2, type: 'Java Cloud Service Virtual Image', balancer: 1, memory: 8}];
            var source2 = [{name: 'Settings', version: '10.3.6', nodes: 2, cpu: 2, type: 'Java Cloud Service Virtual Image', balancer: 1, memory: 8},
                    {name: 'Tools', version: '10.3.6', nodes: 2, cpu: 2, type: 'Java Cloud Service Virtual Image', balancer: 1, memory: 8},
                    {name: 'Security', version: '10.3.6', nodes: 2, cpu: 2, type: 'Java Cloud Service Virtual Image', balancer: 1, memory: 8}];      
                    
            var data = {
                title : 'Select Integration Style/Pattern', 
                confirmButtonLabel : 'Select', 
                enableConfirm : ko.observable(true), 
                dataSource1 : new oj.ArrayTableDataSource(source1, {idAttribute: "name"}),
                dataSource2 : new oj.ArrayTableDataSource(source2, {idAttribute: "name"})
            };

            return data;

        };

        self.getDefault = function () {
            return defaultData();
        };
      
    }

   return new MetadataSelectData();
    
});