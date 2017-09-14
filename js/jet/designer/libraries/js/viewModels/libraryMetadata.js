//
// $Header: xbus/alsb/cloud/ics/tooling/console/userinterface/public_html/oracle/ics/webconsole/view/js/jet/designer/libraries/js/viewModels/libraryMetadata.js /st_xbus_icsmain/3 2017/09/11 19:16:48 praca Exp $
//
// libraryMetadata.js
//
// Copyright (c) 2017, Oracle and/or its affiliates. All rights reserved.
//
//    NAME
//     libraryMetadata.js - <one-line expansion of the name>
//
//    DESCRIPTION
//     <short description of component this file declares/defines>
//
//    NOTES
//     <other useful comments, qualifications, etc. >
//
//    MODIFIED  (MM/DD/YY)
//    praca      07/26/17 - Created
//


/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * libraryMetadata module
 */
define(['ojs/ojcore', 'knockout', 'text!./../views/libraryMetadata.html',
            'jquery', 'ojs/ojknockout', 'ojs/ojinputtext', 'ojs/ojlistview', 'ojs/ojjsontreedatasource', 'ojs/ojcollectiontabledatasource', 'ojs/ojbutton', 'ojs/ojcheckboxset','ojs/ojselectcombobox'],

function (oj, ko, metadataView) {
    /**
     * The view model for the main content view template
     */
    function libraryMetadataContentViewModel(libraryContextParams) {
     
 var self = this;      

        self.restUri = '/icsapis/v2/libraries/';
 	self.code = libraryContextParams.code();
 	self.version = libraryContextParams.version();
        self.viewMode = (libraryContextParams.mode() === 'VIEW_MODE');
        
    	self.token = null;
    	self.restResponse = null;
	
        self.createView = function() {
            return metadataView;
        }          
        
        self.fetchToken = function() {
            $.ajax({
               type: 'GET',
               url: window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/ic/home/token',
               dataType: 'json',
               async: false,
               success: function (response) {
                        self.token = response.jwt;
                        console.log(self.token);
               },
               error: function (error) {
                        console.log(error);
               }
            });
            return self.token;
    	  };
    
     self.fetchData = function() {
      var url = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + self.restUri +self.code+'|'+self.version+'/configmetadata';
    
    		$.ajax({
                    type: 'GET',
                    url: url,
                    dataType: 'json',
                    async: false,
                    headers: {
                            'Authorization': 'Bearer ' + self.fetchToken()
                    },
                    success: function (response) {
                            self.restResponse = response;
                             console.log("rest response");
                             console.log(self.restResponse);
                    },
                    error: function (error) {
                            console.log(error);
                    }
            	});
    	};
        
         self.fetchMetaData = function() {
                var url = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + self.restUri + self.code+ '|' +self.version + '/metadata';
                var xmlResponse;
    		$.ajax({
                    type: 'GET',
                    url: url,
                    dataType: 'xml',
                    async: false,
                    headers: {
                            'Authorization': 'Bearer ' + self.fetchToken()
                    },
                    success: function (response) {
                            xmlResponse = response;
                             console.log("rest response");
                             console.log(xmlResponse);
                    },
                    error: function (error) {
                            console.log(error);
                    }
            	});
                return xmlResponse;
    	};

        self.fetchData();
        self.data = self.restResponse;
        console.log("response");
        console.log(self.restResponse);
        var titleName = self.data.name + ' (1.0)';
	self.title = ko.observable(titleName);
	self.selectedFuncValue = ko.observable("NONE");
	self.selectedFileName = ko.observable("NONE");
        self.selectedFileAnnotation = ko.observable("Annotation...");
	self.selectedFunctionName = ko.observable("NONE");
	self.selectedFuncClassification = ko.observable(["NONE"]);
	self.selectedFuncInputList = ko.observableArray([]);
	self.selectedFuncOutputList = ko.observableArray([]);
	self.displayParameterList = ko.observable(false);
	self.collection = flattenJSON(self.data.files);
	self.isSorted = ko.observableArray([]);        
	self.libDataSource = new oj.JsonTreeDataSource(self.data.files);
	self.libDataSource.sort({key: 'name', direction: 'ascending'});
	self.filter = ko.observable('');
	self.dataSource = ko.observable(self.libDataSource);

        self.nameFilter = function(model, attr, value)
        {
            var name = model.get("name");
            return (name.toLowerCase().indexOf(value.toLowerCase()) > -1);
        };
        self.statusFilter = function(model, attr, value)
        {
            var status = model.get("status");
            return (status.toLowerCase() === value.toLowerCase());
        };
        self.handleKeyUp = function() 
        {
            var filter = self.filter();
            if (filter.length == 0)
            {
                if (self.dataSource() == self.filteredDataSource)
                    self.dataSource(self.libDataSource);
            }
            else
            {
                if (self.filteredDataSource == undefined)
                {
                    self.filteredCollection = self.collection.clone();
                    self.filteredDataSource = new oj.CollectionTableDataSource(self.filteredCollection);
                }

                var ret = self.collection.where({name:{value:filter,comparator:self.nameFilter}});
                self.filteredCollection.reset(ret);

                if (self.dataSource() == self.libDataSource)
                    self.dataSource(self.filteredDataSource);
            }
        };
    
    self.filterByStatusLabel = ko.observable('All');
    
        self.filterByStatus = function(event, ui) { 
            var filter = ui.item.get(0).id;
            
            if (filter.length == 0 || filter === 'All')
            {
                if (self.dataSource() == self.filteredDataSource )
                    self.dataSource(self.libDataSource);
            }
            else
            {
                if (self.filteredDataSource == undefined)
                {
                    
                    self.filteredCollection = self.collection.clone();
                    self.filteredDataSource = new oj.CollectionTableDataSource(self.filteredCollection);
                }

                var ret = self.collection.where({status:{value:filter,comparator:self.statusFilter}});
                self.filteredCollection.reset(ret);

                if (self.dataSource() == self.libDataSource)
                    self.dataSource(self.filteredDataSource);
            }
            if(filter === 'All'){
               self.filterByStatusLabel('All'); 
            }else if(filter === 'Configured'){
                self.filterByStatusLabel('Configured');
            }else if(filter === 'NonConfigured'){
                self.filterByStatusLabel('Non Configured');
            }
        };


        self.itemOnly = function(context)
        {
            if (context['leaf']  == undefined)
            {
                return true;
            }
            return context['leaf'];
        };

        self.selectTemplate = function(file, bindingContext)
        {
            var leaf = bindingContext.$itemContext.leaf;
            if (leaf == undefined)
            {
                return 'item_template';
            }
            return leaf ? 'item_template' : 'group_template';
        };
        
    var sortCriteriaMap = {};
    sortCriteriaMap['name-asc'] = {key: 'name', direction: 'ascending'};
    sortCriteriaMap['name-desc'] = {key: 'name', direction: 'descending'};
    
     self.handleSortCriteriaChange = function(ui, event) { 
         var data1 = self.isSorted();
       var criteriaMap = data1.length ? sortCriteriaMap['name-asc'] : sortCriteriaMap['name-desc'];
       if(data1 === "selected"){
           self.isSorted('');
       }else{
           self.isSorted("selected");
       }
       self.libDataSource.sort(criteriaMap);
       self.dataSource(self.libDataSource);      
    };
    
    self.functionSelectedListener = function(event, ui) { 
        if(ui.option === 'selection' && ui.value.length>0){
           self.selectedFuncValue(ui.value);
           self.setSelectedFileName(ui.value);
           var classificationType = self.collection.get(ui.value).attributes.classification;
           var ary=[];
           ary.push(classificationType);
           self.selectedFuncClassification(ary);
           self.updateSelectedFunctionDetails(ui.value,classificationType);
           if(self.collection.get(ui.value).attributes.annotation === undefined){
               self.selectedFileAnnotation("Annotation...");
               console.log(self.selectedFileAnnotation());
           } else {
               self.selectedFileAnnotation(self.collection.get(ui.value).attributes.annotation);
               console.log(self.selectedFileAnnotation());
           }
        }
    }
    
     self.setSelectedFileName =  function(apiid){
           var fileName = apiid[0].split(':')[2];
           var funcName = apiid[0].split(':')[3];
           self.selectedFileName(fileName);
           self.selectedFunctionName(funcName);
    }
    
    
    self.updateSelectedFunctionDetails= function(value,classificationType){
            if(classificationType !== 'NONE'){
                var inputParameterList = self.collection.get(value).attributes.inputParameters;
                var outputParameterList = self.collection.get(value).attributes.outputParameters;                
                self.selectedFuncInputList(inputParameterList);
                self.selectedFuncOutputList(outputParameterList);
                self.displayParameterList(true);
            }else{
                self.displayParameterList(false);
            }
    }
     self.orchSelectedListener = function(event, ui) {
         if(ui.value.length>0 && ui.value[0] != undefined ){
             var selectedFileIndex = self.findFileIndex(self.libDataSource.data.children,self.selectedFileName());
             var selectedFunctionIndex = self.findFunction(self.libDataSource.data.children[selectedFileIndex].children, self.selectedFuncValue());            
             self.collection.get(self.selectedFuncValue()).attributes.classification = 'ORCHESTRATION';
             self.collection.get(self.selectedFuncValue()).attributes.status = 'Configured';             
             self.libDataSource.data.children[selectedFileIndex].children[selectedFunctionIndex].attr=self.collection.get(self.selectedFuncValue()).attributes;
             self.updateSelectedFunctionDetails(self.selectedFuncValue(),'ORCHESTRATION');
             self.dataSource(self.libDataSource);
         }else{
             if(self.selectedFuncValue()!=='NONE'){
                delete self.collection.get(self.selectedFuncValue()).attributes.classification;
                self.collection.get(self.selectedFuncValue()).attributes.status = 'NonConfigured';
                var selectedFileIndex = self.findFileIndex(self.libDataSource.data.children,self.selectedFileName());
                if(selectedFileIndex != undefined){
                    var selectedFunctionIndex = self.findFunction(self.libDataSource.data.children[selectedFileIndex].children, self.selectedFuncValue());    
                    self.libDataSource.data.children[selectedFileIndex].children[selectedFunctionIndex].attr=self.collection.get(self.selectedFuncValue()).attributes;
                    self.updateSelectedFunctionDetails("",'NONE');
                    self.dataSource(self.libDataSource);
                }
            }
         }
    }
     
     self.findFunction = function(source, id){
         for(var i=0; i<source.length; i++){
             var func = source[i].attr;
             if(func.id === id[0]){
                 return i;
             }
         }
     };
     
      self.findFileIndex = function(source, id){
         for(var i=0; i<source.length; i++){
             var fileName = source[i].attr.name;
             if(fileName === id){
                 return i;
             }
         }
     };
     
    
    self.getPosition = function ()
      {
        return {'my' : 'start bottom',
                'at' : 'end top',
                'collision' : 'none'};
      };
      
    self.getTail= function ()
      {
        return true;
      };
      
    self.showInputParamsDescField = function(data, event){
       var linkId = '#'+event.currentTarget.id;
        var index = event.currentTarget.id.substr(event.currentTarget.id.lastIndexOf('_'), event.currentTarget.id.length); 
        var tarea_id = 'input_desc_tarea'+index;
       document.getElementById(tarea_id).style.display= 'inline';
       $(linkId).hide();
    }
    self.showOutputParamsDescField = function(data, event){
      var linkId = '#'+event.currentTarget.id;
      var index = event.currentTarget.id.substr(event.currentTarget.id.lastIndexOf('_'), event.currentTarget.id.length); 
      var tarea_id = 'output_desc_tarea'+index;
      document.getElementById(tarea_id).style.display= 'inline';
      $(linkId).hide();
    }
   
    self.addInputParamsDescription= function(index,event,data){
        var selectedFileIndex = self.findFileIndex(self.libDataSource.data.children,self.selectedFileName());
        if(selectedFileIndex != undefined && data.value.trim().length>0){
               var selectedFunctionIndex = self.findFunction(self.libDataSource.data.children[selectedFileIndex].children, self.selectedFuncValue());
               self.collection.get(self.selectedFuncValue()).attributes.inputParameters[index].desc = data.value.trim();
               self.libDataSource.data.children[selectedFileIndex].children[selectedFunctionIndex].attr=self.collection.get(self.selectedFuncValue()).attributes;
               self.dataSource(self.libDataSource);
           }
    }
    
    self.addOutputParamsDescription= function(index,event, data){
        var selectedFileIndex = self.findFileIndex(self.libDataSource.data.children,self.selectedFileName());
         if(selectedFileIndex != undefined && data.value.trim().length>0){
               var selectedFunctionIndex = self.findFunction(self.libDataSource.data.children[selectedFileIndex].children, self.selectedFuncValue());  
               self.collection.get(self.selectedFuncValue()).attributes.outputParameters[index].desc = data.value.trim();
               self.libDataSource.data.children[selectedFileIndex].children[selectedFunctionIndex].attr=self.collection.get(self.selectedFuncValue()).attributes;
               self.dataSource(self.libDataSource);
            }
    }
    
    self.optionChangeCallback = function(event, data)
    {
           var selectedFileIndex = self.findFileIndex(self.libDataSource.data.children,self.selectedFileName());
           if(selectedFileIndex != undefined){
                var selectedFunctionIndex = self.findFunction(self.libDataSource.data.children[selectedFileIndex].children, self.selectedFuncValue());            
                self.collection.get(self.selectedFuncValue()).attributes.annotation = data.value;
                self.libDataSource.data.children[selectedFileIndex].children[selectedFunctionIndex].attr=self.collection.get(self.selectedFuncValue()).attributes;
                self.dataSource(self.libDataSource);
            }
    }
    
    self.launchFileDetails = function(){
         $("#annotate_id").ojInputText("reset"); 
         $( "#popup1" ).ojPopup( "refresh" );
         $("#popup1").ojPopup('open', '#fileName_link',
                                      self.getPosition());
    };
    
    self.downloadJsFile = function(event,data){
//	 var result = self.catalog().serverCommunicationHandler().fetchData('/icsapis/v2/libraries/' + '/' +self.data.code+"%7C"+self.data.version+ '/' + 'archive');
//            console.log("Download JS file : ", result);
            var path = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/icsapis/v2/libraries/' +self.data.code+'%7C'+self.data.version+ '/' + 'archive';
            
            var fileName = self.data.code + '_' +self.data.version + '.jar';
            
            require(['jet/js/utils'],
                function (u) { 
                    $(function () {
                        u.exportFile(path, fileName);
                    });
                }
            );   
     }
     
     self.saveMetadata =function(metaDataStr) {
	var url = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + "/icsapis/v2/libraries/"+self.data.code+"%7C"+self.data.version+"/savemetadata";
        $.ajax({
		type: 'PUT',
		url: url,
		dataType: 'json',
		data: metaDataStr,
		async: false,
		headers: {
				'Authorization': 'Bearer ' + self.fetchToken(),
                                'content-type': 'application/json'
		},
		success: function (response) {
				 var restResponse = response;
		},
		error: function (error) {
				console.log(error);
		}
      	});
     } 
     
     self.closeClicked = function(data, event){
//    resetNav(true,true,"apilibrary_jet");
      libraryContextParams.currentModule('libraries');
     }
    
     self.saveClicked = function(data, event){
     
        var metaData = {
                        "name": "",
                        "code": "",
                        "version": "",
                        "implType": "",
                        "files": []
                       };
                        
        metaData.name = self.data.name;
        metaData.code = self.data.code;
        metaData.version = self.data.version;
        metaData.implType = self.data.implType;
        var jsonData = JSON.stringify(self.libDataSource);       
//      metaData.files.push(ko.toJS(self.dataSource).data.children[0]);
        metaData.files = JSON.parse(jsonData).data.children;
        var metaDataStr = JSON.stringify(metaData);
        self.saveMetadata(metaDataStr);

	console.log(JSON.stringify(ko.toJS(self.dataSource).data.children[0]));
	console.log(metaDataStr);
//      resetNav(true,true,"apilibrary_jet");
        libraryContextParams.currentModule('libraries');
    }
    
    self.exportLibraryMetadataActionHandler = function(data, event) {
            console.log("exportMetadata xml : ", data); 
            var xmlResp = self.fetchMetaData();
            var path = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + self.restUri + self.data.code +'|' + self.data.version + '/' + 'metadata';        
            var fileName = self.data.code +'_' + self.data.version + '.xml';
            
            require(['jet/js/utils'],
                function (u) { 
                    $(function () {
                        u.exportFile(path, fileName);
                    });
                }
            );          
        };
}

  
    function flattenJSON(data)
    {
        var collection = new oj.Collection();

        for (var i=0;i<data.length;i++)
        {
            collection.add(data.attr);
            var children = data[i].children;
            if (children != null && children.length > 0)
            {
                for (var j=0;j<children.length;j++)
                {
                    collection.add(children[j].attr);
                }
            }
        }

        return collection;
    }
    
    return libraryMetadataContentViewModel;
});
