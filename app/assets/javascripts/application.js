// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require rails-ujs
//= require activestorage
//= require turbolinks
/*
 *= require_tree .
 *= require_self
 */

//= require jquery
//= require bootstrap-sprockets
//= require owl.carousel

document.addEventListener("turbolinks:load", function () {
    $("#projects-carousel").owlCarousel({
        loop: true,
        autoplayHoverPause: true,
        margin: 10,
        items: 1,
        autoplay: true,
        smartSpeed: 700,
        autoplayTimeout: 5000
    });
    $("#pub-caroucel").owlCarousel({
        loop: false,
        margin: 10,
        items: 1,
        smartSpeed: 700,
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 3
            },
            1000: {
                items: 5,
                nav: true
            }
        }
    });
    console.log("test");
});

document.addEventListener("turbolinks:before-cache", function () {
    $('#projects-carousel').owlCarousel('destroy');
    $('#pub-caroucel').owlCarousel('destroy');
});