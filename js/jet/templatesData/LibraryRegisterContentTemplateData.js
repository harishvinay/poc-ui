/**
 * header module
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'jet/templatesData/MetadataImportContentTemplateData'
], function (oj, ko, $, importTemplateData) {

	function LibraryRegisterContentTemplateData() {
		var self = this;

		var defaultData = function(_util) {
			var data = $.extend({}, importTemplateData.getDefault());

                        // extra data for register library dialog 
			data.confirmButtonLabel = 'Register';
			data.enableConfirm = ko.observable(false);
			data.libraryName = ko.observable('');
			data.libraryIdentifier = ko.observable('');
			data.libraryVersion = ko.observable('01.00.0000');
			data.libraryDesc = ko.observable('');

			data.onLibraryNameChange = function(event) {
				data.libraryIdentifier(data.libraryName().toUpperCase());
			};
			data.confirmEnableCheck = function(data, event) {
				this.enableConfirm(
					($.trim($('#metadataInputFile').val()).length > 0) &&
					(data.libraryName().length > 0) &&
					(data.libraryIdentifier().length > 0) &&
					(data.libraryVersion().length > 0)
				);
			};
			data.trimVersion = function(data, event) {
				var trimVer = _util.unTrimVersion(data.libraryVersion());
				data.libraryVersion(trimVer);
				data.confirmEnableCheck(data);
			};
			data.getLibraryName = function() {
				return data.libraryName();
			};
			data.getLibraryIdentifier = function() {
				return data.libraryIdentifier();
			};
			data.getLibraryVersion = function() {
				return data.libraryVersion();
			};
			data.getLibraryDesc = function() {
				return data.libraryDesc();
			};
			return data;
		};

		self.getDefault = function(catalogUtil) {
			return defaultData(catalogUtil);
		};
	}

	return new LibraryRegisterContentTemplateData();

});
