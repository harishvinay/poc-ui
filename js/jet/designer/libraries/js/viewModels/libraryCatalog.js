//
// $Header: xbus/alsb/cloud/ics/tooling/console/userinterface/public_html/oracle/ics/webconsole/view/js/jet/designer/libraries/js/viewModels/libraryCatalog.js /st_xbus_icsmain/1 2017/08/24 11:05:46 gjaszay Exp $
//
// libraryCatalog.js
//
// Copyright (c) 2017, Oracle and/or its affiliates. All rights reserved.
//
//    NAME
//     libraryCatalog.js - <one-line expansion of the name>
//
//    DESCRIPTION
//     <short description of component this file declares/defines>
//
//    NOTES
//     <other useful comments, qualifications, etc. >
//
//    MODIFIED  (MM/DD/YY)
//    praca      08/01/17 - Created
//
define(['jquery', 'ojs/ojcore', 'knockout', 'text!./../views/libraryCatalog.html',
                                'ojs/ojrouter', 'knockout-amd-helpers', 'ojs/ojknockout', 'ojs/ojmodule'],
        function ($, oj, ko, parentView) {
            function LibraryCatalogModel() {
                  var self = this;
                  self.name = ko.observable('');
                  self.code = ko.observable('');
                  self.version = ko.observable('');
                  self.currentModule = ko.observable("libraries");
                  self.mode = ko.observable('');   
                  setLibraryCatalog(this);

                  self.createView = function() {
                       return parentView;
                  }
             }
            return LibraryCatalogModel;
        });
