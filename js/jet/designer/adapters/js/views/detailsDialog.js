/**
 * listViewModel module
 */
define(['ojs/ojcore', 'knockout', 'jquery'
], function (oj, ko, $) {

    function MetadataAdapterDetailsData() {
        var self = this;

        var defaultData = function(data) {
            var _data = {
                    title:'Adapter Details',
                    closeButtonLabel: 'Close',
                    
                    basic: "Basic Details",
                    name: "Name:",
                    _name: data.name,
                    dname: "Display Name:",
                    _dname: data.displayName,
                    version: "Version:",
                    _version: data.version,
                    role: "Integration Role:",
                    _role: data.integrationRole == 'SOURCE' ? 
                        'Trigger' : data.integrationRole == 'TARGET' ? 'Invoke ' :
                        data.integrationRole == 'SOURCE_AND_TARGET' ? 'Trigger and Invoke' : '',  
                    description: "Description:",
                    _description: data.description,
                    oversion: "Other Version(s):",
                    _oversion: data.otherVersions,//missing                    
                    
                    security: "Security Details",                    
                    defaultpolicy: "Default Policies:",
                    _defaultpolicy: data.defaultSecurityPolicy,//missing
                    supportedpolicy: "Supported Policies:",
                    _supportedpolicy: data.supportedSecurityPolicies,                    

                    vendor: "Vendor Details",                    
                    vendorname: "Name:",
                    _vendorname: data.vendorInfo ? data.vendorInfo.name : '',
                    about: "About Us:",
                    _about: data.vendorInfo ? data.vendorInfo.description : '',    
                    contact: "Contact Us:",
                    _contact: data.vendorInfo ? data.vendorInfo.contactUS : '',    
                    documentation: "Documentation:",
                    _documentation: data.vendorInfo ? data.vendorInfo.documentationURL : '',    
                    release: "Release Note:",
                    _release: data.vendorInfo ? data.vendorInfo.releaseNotes : '',    
                    support: "Support:",
                    _support: data.vendorInfo ? data.vendorInfo.supportURL : '',//not used

                    
                    helpTopicId: "ADAPTER_LANDING_VIEW"
            };
            return _data;
        };

        self.getDefault = function(data) {
            return defaultData(data);
        };
    }

    return new MetadataAdapterDetailsData();

});
 
 
 /*
define(['jquery', 'knockout', 'ojs/ojdialog'], function($, ko){
    
    var dialog = {
        locale : navigator.languages[0],
        docType : 'oic',
        mainHelp : 'http://www.oracle.com',
        openDialog : function(){
            $("#scrollingDialog").ojDialog("open");
        },
        getGuid : function() {
            return dialog.guid[self.helpTopicId];
        },
        guid : {
            'ADAPTER_LANDING_VIEW' : 'ICSUG-GUID-CBCA7A36-690C-4EF9-AD19-FBEF0F8C5CBC'
        },
        /**
         * Shows Help
         *//*
        showHelp: function(){
            var helpUrl = dialog.getHelpUrl();
            //"http://www.oracle.com/pls/topic/lookup?ctx=oic_en&id=ICSUG-GUID-CBCA7A36-690C-4EF9-AD19-FBEF0F8C5CBC"
            window.open(helpUrl, "", "width = 800, height = 500");
        },
        
        getHelpUrl: function() {
            var url = dialog.mainHelp + "/pls/topic/lookup?ctx=" + dialog.docType + '_' + dialog.locale + "&id=" + dialog.getGuid();
            return url;
        },
        
        addDialogHelp : function (dialogHeaderClass, containerClass, containerId, helpId, helpIconSource) {
            var dialogHeader = $("." + dialogHeaderClass);
            var divHelpContainer = $("<div />", 
            {
                id : containerId, "class" : containerClass
            });

            dialogHeader.prepend(divHelpContainer);

            var helpAnchor = $("<a />", 
            {
                href : "#", id : helpId
            });
            var helpContainerDiv = $("#" + containerId);
            helpContainerDiv.append(helpAnchor);
            var helpImage = $("<img />", 
            {
                src : helpIconSource
            });
            var helpAnchorElement = $("#" + helpId);
            helpAnchorElement.append(helpImage);
        },    
        
        openAdapterDetailsDialog: function(data) {
            var title = 'Adapter Details';
            $("#adapterDetails #adapterDetailsDialog").empty();
            require(['text!jet/designer/adapters/js/views/dialog.html'], function (dialogInfoView) {
                var $dialogWrapper = $("#dialogWrapper");
                if ($dialogWrapper.length == 0) {
                    $('body').append('<div id="dialogWrapper"></div>');
                    $dialogWrapper = $("#dialogWrapper");
                }
                ko.cleanNode($dialogWrapper.get(0));
                $dialogWrapper.html(dialogInfoView);
                
                function adapterDetailsModel()
                {
                    var self = this;
                    self.no = 'Close';
                    
                    self.basic = "Basic Details";
                    self.name = "Name:";
                    self._name = data.name;
                    self.dname = "Display Name:";
                    self._dname = data.displayName;
                    self.version = "Version:";
                    self._version = data.version;
                    self.role = "Integration Role:";
                    self._role = data.integrationRole == 'SOURCE' ? 
                        'Trigger' : data.integrationRole == 'TARGET' ? 'Invoke ' :
                        data.integrationRole == 'SOURCE_AND_TARGET' ? 'Trigger and Invoke' : '';  
                    self.description = "Description:";
                    self._description = data.description;
                    self.oversion = "Other Version(s):";
                    self._oversion = data.otherVersions;//missing                    
                    
                    self.security = "Security Details";                    
                    self.defaultpolicy = "Default Policies:";
                    self._defaultpolicy = data.defaultSecurityPolicy;//missing
                    self.supportedpolicy = "Supported Policies:";
                    self._supportedpolicy = data.supportedSecurityPolicies;                    

                    self.vendor = "Vendor Details";                    
                    self.vendorname = "Name:";
                    self._vendorname = data.vendorInfo.name;
                    self.about = "About Us:";
                    self._about = data.vendorInfo.description;    
                    self.contact = "Contact Us:";
                    self._contact = data.vendorInfo.contactUS;    
                    self.documentation = "Documentation:";
                    self._documentation = data.vendorInfo.documentationURL;    
                    self.release = "Release Note:";
                    self._release = data.vendorInfo.releaseNotes;    
                    self.support = "Support:";
                    self._support = data.vendorInfo.supportURL;//not used
                    
                    self.helpTopicId = "ADAPTER_LANDING_VIEW";
                    
                    self.handleNoClose = $("#dialogWrapper #closeButton").click(function(event) {
                        $("#adapterDetailsDialog").ojDialog("close"); 
                          if (event.preventDefault)
                            event.preventDefault();          
                          if (event.stopPropagation)
                            event.stopPropagation();
                    });
                };
                                
                var ad = new adapterDetailsModel();
                
                $("#adapterDetailsDialog").attr("title", title);
                $("#dialogWrapper #closeButton").attr("autofocus","true");
                ko.applyBindings(ad, $("#dialogWrapper #adapterDetails").get(0));
                
                dialog.addDialogHelp("oj-dialog-header", "jm-dialog-header-close-wrapper", "adapterDetailsDialogHelpDiv", "adapterDetailsDialogHelp", "images/func_help_16_onb.png");
                $("#adapterDetailsDialogHelp").click(function (event) {
                    dialog.showHelp();
                });
                
                
                $("#adapterDetailsDialog").ojDialog("open");      
            });                        
        }
    };
    return dialog;
});
//# sourceURL=dialog.js
*/