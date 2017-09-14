"use strict";
define(['jquery', 'promise', 'util/ServiceModel'], function ($, Promise, model) {
    var headers = {
        'Authorization': 'Basic ' + btoa('weblogic' + ':' + 'welcome2')
    };
    return {
        get: function (url) {
            return new Promise(function (resolve, reject) {
                $.ajax({
                    url: url,
                    type: 'GET',
                    dataType: "json",
                    beforeSend: function () {
                        model.beforeSend();
                    },
                    success: function (data, status, xhr) {
                        resolve({data: data, status: status, xhr: xhr});
                    },
                    error: function (xhr, status, error) {
                        reject({xhr: xhr, status: status, error: error});
                    },
                    headers: headers
                }).always(function () {
                    model.afterSend();
                });
            });
        },
        post: function (url, data) {
            var promise = new Promise(function (resolve, reject) {
                $.ajax({
                    url: url,
                    type: 'POST',
                    contentType: 'application/json',
                    beforeSend: function () {
                        model.beforeSend();
                    },
                    success: function (data, status, xhr) {
                        resolve({data: data, status: status, xhr: xhr});
                    },
                    error: function (xhr, status, error) {
                        reject({xhr: xhr, status: status, error: error});
                    },
                    headers: headers,
                    data: JSON.stringify(data)
                }).always(function () {
                    model.afterSend();
                });
            });

            return promise;
        },
        put: function (url, data) {
            var h = $.extend(true, {}, headers);
            h['Content-Type'] = 'application/json';
            delete h['accept'];
            var promise = new Promise(function (resolve, reject) {
                $.ajax({
                    url: url,
                    type: 'PUT',
                    dataType: "json",
                    beforeSend: function () {
                        model.beforeSend();
                    },
                    success: function (data, status, xhr) {
                        resolve({data: data, status: status, xhr: xhr});
                    },
                    error: function (xhr, status, error) {
                        reject({xhr: xhr, status: status, error: error});
                    },
                    headers: h,
                    data: JSON.stringify(data)
                }).always(function () {
                    model.afterSend();
                });
            });

            return promise;
        },
        delete: function (url) {
            var promise = new Promise(function (resolve, reject) {
                $.ajax({
                    url: url,
                    type: 'DELETE',
                    dataType: "text",
                    beforeSend: function () {
                        model.beforeSend();
                    },
                    success: function (data, status, xhr) {
                        resolve({data: data, status: status, xhr: xhr});
                    },
                    error: function (xhr, status, error) {
                        reject({xhr: xhr, status: status, error: error});
                    },
                    headers: headers
                }).always(function () {
                    model.afterSend();
                });
            });

            return promise;
        },
        headers: headers
    }
});
