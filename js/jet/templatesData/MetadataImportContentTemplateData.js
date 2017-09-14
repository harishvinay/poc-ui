/**
 * header module
 */
define(['ojs/ojcore', 'knockout', 'jquery'
], function (oj, ko, $) {

    function MetadataImportContentTemplateData() {
        var self = this;

        var defaultData = function() {
            var data = {
                title:'',
                dialogHelpTopicId:'',
                selectFilesText:'',
                acceptFileTypes:'',
                importMessage:'',
                confirmButtonLabel: '',
                confirmFunction: '',
                enableConfirm : ko.observable(false),
                onChange: function(data, event) {
                    this.enableConfirm($.trim($('#metadataInputFile').val()).length > 0);
                },
                getFile: function() {
                    return $('#metadataInputFile')[0].files[0];
                }
            };
            return data;
        };

        self.getDefault = function() {
            return defaultData();
        };
    }

    return new MetadataImportContentTemplateData();

});
