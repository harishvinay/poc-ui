/**
 * header module
 */
define(['ojs/ojcore', 'knockout', 'jquery'], function (oj, ko, $) {
    
    function MetadataActivateData() {
        var self = this;

        var defaultData = function () {
            var data = {
                title : 'Activate Integration', 
                confirmButtonLabel : 'Activate', 
                enableConfirm : ko.observable(true), 
                traceTitle : 'Tracing: ',
                traceDescription : 'When tracing is enabled, integration activity can be viewed in the Activity Stream.', 
                tracing : ko.observable(false), 
                payload : ko.observable(false), 
                traceCheckboxLabel : 'Enable Tracing', 
                warningMessage: 'When payload is included, sensitive information from the payload is written into log files, which can be downloaded and viewed. This may pose a security risk, and also slow down your system. Not recommended in a production environment.',
                payloadCheckboxLabel : 'Include Payload',
                getTracing: function() {
                    return this.tracing();
                },
                getPayload: function() {
                    return this.payload();
                }
            };

            return data;

        };

        self.getDefault = function () {
            return defaultData();
        };
    }

    return new MetadataActivateData();

});