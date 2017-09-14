/**
 * utils functions
 */
define(['jquery', 'knockout'], function($, ko){
    
    //var TRACE = true;
    var TRACE = false;
    
    var utils = {
        importResource: function(url, fd, header) {
            var token = utils.getAuthorizationToken(header.catalog());
            $.ajax({
                type: 'POST',
                url: url,
                headers: {
                        'Authorization': 'Bearer ' + token
                },                
                data: fd,
                processData: false,
                contentType: false,
                success: function (response) {
                    //utils.trace("importResource response");
                    utils.trace("importResource success", response ? response.status + ' ' + response.statusText : 'N/A');
                    header.catalog().refresh();
                },
                error: function (error) {
                    utils.trace("importResource error", error.status + ' ' + error.statusText);
                    if (error.status == 409) {
                        if (header && header.importCallback) {
                            header.importCallback(fd);
                        }
                    }
                }                
                }).done(function(data) {
                    utils.trace("importResource done", data); 
            });            
        },
        replaceResource: function(url, fd, cat) {
            var token = utils.getAuthorizationToken(cat);
            $.ajax({
                type: 'PUT',
                url: url,
                headers: {
                        'Authorization': 'Bearer ' + token
                },                
                data: fd,
                processData: false,
                contentType: false,
                success: function (response) {
                    //utils.trace("replaceResource response");
                    utils.trace("replaceResource success", response ? response.status + ' ' + response.statusText : 'N/A');
                    cat.refresh();
                },
                error: function (error) {
                    //utils.trace("replaceResource error", error);
                    utils.trace("replaceResource error", error.status + ' ' + error.statusText);
                }                
                }).done(function(data) {
                    utils.trace("replaceResource done", data); 
            });            
        },        
        exportResource: function(url, fileName, cat) {
            var token = utils.getAuthorizationToken(cat);
            var request = new XMLHttpRequest();
            request.open("GET", url, true); 
            request.responseType = "blob";
            request.setRequestHeader('Authorization', 'Bearer ' + token);
            request.onload = function (e) {
                if (this.status === 200) {
                    //blob response
                    utils.trace("exportResource onload", this.response);
                    var file = window.URL.createObjectURL(this.response);
                    var a = document.createElement("a");
                    a.href = file;
                    a.download = fileName;
                    if (document.createEvent) {
                        var event = document.createEvent('MouseEvents');
                        event.initEvent('click', true, true);
                        a.dispatchEvent(event);
                    }
                    else {
                        a.click();
                    }                     
                };
            };
            request.send();            
        },
        cloneResource: function(url, data, cat) {
            var token = utils.getAuthorizationToken(cat);
            $.ajax({
                beforeSend: function(xhrObj) {
                    xhrObj.setRequestHeader("Content-Type","application/json");
                    xhrObj.setRequestHeader("Accept","application/json");
                },
                headers: {
                        'Authorization': 'Bearer ' + token
                },                
                type: "POST",
                url: url,       
                data: JSON.stringify(data),               
                dataType: "json",
                success: function(response) {
                   //utils.trace("cloneResource", response);
                   utils.trace("cloneResource success", response ? response.status + ' ' + response.statusText : 'N/A');
                   cat.refresh();
                },
                error: function (error) {
                    //utils.trace("cloneResource error", error);
                    utils.trace("cloneResource error", error.status + ' ' + error.statusText);
                }                  
                }).done(function(done) {
                    utils.trace("cloneResource done", done);   
                });
        },
        updateResource: function(url, data, cat) {
            var token = utils.getAuthorizationToken(cat);
            $.ajax({
                beforeSend: function(xhrObj) {
                    xhrObj.setRequestHeader("Content-Type","application/json");
                    xhrObj.setRequestHeader("Accept","application/json");
                },
                headers: {
                        'Authorization': 'Bearer ' + token,
                        'X-HTTP-Method-Override': 'PATCH'
                },                
                type: "POST",
                url: url,       
                data: JSON.stringify(data),               
                dataType: "json",
                success: function(response) {
                   //utils.trace("updateResource", response);
                   utils.trace("updateResource success", response ? response.status + ' ' + response.statusText : 'N/A');
                   cat.refresh();
                },
                error: function (error) {
                    //utils.trace("updateResource error", error);
                    utils.trace("updateResource error", error.status + ' ' + error.statusText);
                    cat.refresh();
                }                  
                }).done(function(done) {
                    utils.trace("updateResource done", done);   
                });            
        },        
        deleteResource: function(url, cat) {
            var token = utils.getAuthorizationToken(cat);
            $.ajax({
                type: 'DELETE',
                url: url,
                async: false,
                headers: {
                        'Authorization': 'Bearer ' + token
                },
                success: function (response) {
                    //utils.trace("deleteResource response", response);
                    utils.trace("deleteResource success", response.status + ' ' + response.statusText);
                    cat.refresh();
                },
                error: function (error) {
                    utils.trace("deleteResource error", error);
                }
            });            
        },
        getAuthorizationToken: function(cat) {
            var tokenurl = location.origin + '/ic/home/token';
            utils.trace("getAuthorizationToken tokenurl", tokenurl);
            var result = cat.serverCommunicationHandler().fetchData('/ic/home/token');
            utils.trace("getAuthorizationToken token", result);
            var token = result.jwt;     
            return token;
        },
        getRandomInteger: function(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },   
        hasValue: function(obj, key, value) {
            return obj.hasOwnProperty(key) && obj[key] === value;
        },       
        isValidString: function(text) {
            return (typeof text === 'string' && text.length > 0);
        },
        queryResource: function(url, cat) {
            var token = utils.getAuthorizationToken(cat);
            $.ajax({
                type: 'GET',
                url: url,
                async: false,
                headers: {
                        'Authorization': 'Bearer ' + token
                },
                success: function (response) {
                    //utils.trace("deleteResource response", response);
                    utils.trace("queryResource success", response.status + ' ' + response.statusText);
                },
                error: function (error) {
                    utils.trace("queryResource error", error);
                }
            });            
        }, 
        trace: function(x, y, level) {
            if (TRACE) {
                utils.trace(x, y);
            }
        }
    };
    return utils;
});
//# sourceURL=utils.js
