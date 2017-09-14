/**
* Copyright (c) 2014, 2017, Oracle and/or its affiliates. All rights reserved.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your application specific code will go here
 */
define(['ojs/ojcore', 'knockout','jquery','ojs/ojrouter', 'ojs/ojknockout', 'ojs/ojarraytabledatasource', 'ojs/ojpagingtabledatasource',
    'ojs/ojoffcanvas'],
        function (oj, ko, $) {
            var self = {
                /*
                 *  This method can be used by the consumers to bind and render the ojModule 
                 */
                renderCertificates : function(containerID) {

                    oj.ModuleBinding.defaults.modelPath = "jet/settings/certificates/js/viewModels/";
                    
                    $(document).ready(function() {
                        var certificatesContainerElement = $('#'+ containerID)[0]; 
    
                        if( certificatesContainerElement ) {
                            ko.cleanNode(certificatesContainerElement);
                            ko.applyBindings(this, certificatesContainerElement);
                            $("body").css("overflow-x", "hidden");
                        }
                    });
                }
            };
            
            return self;            
        }
);
