/**
 * header module
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'jet/templatesData/MetadataImportContentTemplateData'
], function (oj, ko, $, importTemplateData) {

	function MetadataCertificateRegisterData() {
		var self = this;

		var defaultData = function(_util) {
			var data = $.extend({}, importTemplateData.getDefault());

                        data.title = 'Upload Certificate';
                        data.dialogHelpTopicId = 'certificate_help_guid';
                        data.selectFilesText = 'Select Certificate File (.cer, .crt)';
                        data.acceptFileTypes = '.cer, .crt';

                        // extra data for register upload dialog 
			data.confirmButtonLabel = 'Upload';
			data.enableConfirm = ko.observable(false);
			data.aliasName = ko.observable('');
                        data.aliasNameLabel = 'Certificate Alias Name';
                        data.certificateTypeLabel = 'Certificate Type';

			data.certificateMessage = 'Enter a certificate alias name and select a certificate file. Certificate allows Integration Cloud Service connect with external services. If the external service/endpoint needs a specific certificate, request the certificate and then import it into Integration Cloud Service.';
                        data.certificateTypeValues = ["Trust Certificate", "Message Protection Certificate", "Identity Certificate"];
                        data.selectedCertificateTypeValue = ko.observable("Alpha");
                        
			data.onAliasNameChange = function(event) {
				
			};
			data.confirmEnableCheck = function(data, event) {
				this.enableConfirm(
					($.trim($('#metadataInputFile').val()).length > 0) &&
					(data.aliasName().length > 0)
				);
			};
			data.trimVersion = function(data, event) {
				var trimVer = _util.unTrimVersion(data.libraryVersion());
				data.libraryVersion(trimVer);
				data.confirmEnableCheck(data);
			};
			data.getAliasName = function() {
				return data.aliasName();
			};
			data.getCertificateType = function() {
                            var type = data.selectedCertificateTypeValue();
                            var retValue = "";
                            if (type == 'Trust Certificate') {
                                retValue = 'TRUST';
                            }
                            else if (type == 'Message Protection Certificate') {
                                retValue = 'OWSM';
                            }
                            else if (type == 'Identity Certificate') {
                                retValue = 'IDENTITY';
                            }                            
                            return retValue;
			};

			return data;
		};

		self.getDefault = function(catalogUtil) {
			return defaultData(catalogUtil);
		};
	}

	return new MetadataCertificateRegisterData();

});
