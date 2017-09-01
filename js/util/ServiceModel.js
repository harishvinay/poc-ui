"use strict";
define(["jquery"], function ($) {
    return {
        beforeSend: function () {
            if ($("#loadingbar").length === 0) {
                $("body").append("<div id='loadingbar'></div>")
                $("#loadingbar").addClass("waiting").append($("<dt/><dd/>"));
                $("#loadingbar").width((50 + Math.random() * 30) + "%");
            }
        },
        afterSend: function () {
            $("#loadingbar").width("101%").delay(200).fadeOut(400, function () {
                $(this).remove();
            });
        }
    }
});