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
                renderUsers : function(containerID) {

                    oj.ModuleBinding.defaults.modelPath = "jet/settings/users/js/viewModels/";
                    
                    $(document).ready(function() {
                        var usersContainerElement = $('#'+ containerID)[0]; 
    
                        if( usersContainerElement ) {
                            ko.cleanNode(usersContainerElement);
                            ko.applyBindings(this, usersContainerElement);
                            $("body").css("overflow-x", "hidden");
                        }
                    });
                }
            };
            
            return self;            
        }
);
