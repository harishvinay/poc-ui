/**
* Copyright (c) 2014, 2017, Oracle and/or its affiliates. All rights reserved.
 * The Universal Permissive License (UPL), Version 1.0
 */
'use strict';

/**
 * Example of Require.js boostrap javascript
 */

requirejs.config(
            {
                mainConfigFile: '../oracle/ics/webconsole/view/js/require-config.js',
                paths: {
                    //'ojdnd': '../libs/dnd-polyfill/dnd-polyfill-1.0.0'
                }        
        
        });

        require(['ojs/ojcore', 'knockout', 'ojs/ojknockout', 'ojs/ojpagingcontrol',
            'ojs/ojmodule', 'ojs/ojrouter', 'ojs/ojnavigationlist', 'ojs/ojbutton', 'ojs/ojtoolbar'],
                function (oj, ko, app) { // this callback gets executed when all required modules are loaded
                    $(function () {
                    });

                }
        );