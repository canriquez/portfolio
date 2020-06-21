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
//= require jquery.validate
//= require jquery.validate.additional-methods

document.addEventListener("turbolinks:load", function () {
    $("#projects-carousel").owlCarousel({
        loop: false,
        autoplayHoverPause: true,
        margin: 10,
        items: 1,
        autoplay: false,
        smartSpeed: 700,
        autoplayTimeout: 20000
    });

    /*=========================================================
     Form validation process
     ==========================================================*/
    $.validator.setDefaults({    //Seting defaults for styles on error
        errorClass: 'form-error',
        highlight: function (element) {
            $(element)
                .closest('.form-group')
                .addClass('has-error');
        },
        unhighlight: function (element) {
            $(element)
                .closest('.form-group')
                .removeClass('has-error');
        },
        errorPlacement: function (error, element) {
            if (element.prop('type') === 'checkbox') {
                error.insertAfter(element.parent());
            } else {
                error.insertAfter(element);
            }
        }
    });

    $("#contact-form").validate({
        ignore: ".ignore",  // Added for recaptcha validation with jquery validation plugin as indicated in https://stackoverflow.com/questions/29563822/new-recaptcha-with-jquery-validation-plugin
        rules: {
            'email': {
                required: true,
                email: true
            },
            'name': {
                required: true,
                minlength: 2
            },
            'subject': {
                required: true,
                minlength: 5
            },
            'message': {
                required: true,
                minlength: 5
            },
            'hiddenRecaptcha': {   // Added for recaptcha validation with jquery validation plugin as indicated in https://stackoverflow.com/questions/29563822/new-recaptcha-with-jquery-validation-plugin
                required: function () {
                    if (grecaptcha.getResponse() == '') {
                        return true;
                    } else {
                        return false;
                    }
                }
            }

        },
        messages: {
            'email': {
                required: "Please include email address.",
                email: "Please use a <em>valid</em> email address."
            },
            'name': {
                required: 'Please include your name.',
                minlength: 'Please include <em>at least</em> 2 characters.'
            },
            'subject': {
                required: "Please include message's subject.",
                minlength: 'Please include <em>at least</em> 2 characters.'
            },
            'message': {
                required: 'Please include a message',
                minlength: 'Please include <em>at least</em> 5 characters.'
            },
            'hiddenRecaptcha': {
                required: 'I have to test you are not a robot ;)'
            }
        },

        submitHandler: function (form, event) { //Warning: Form and event should go here. event, will help to stop form from submitting when using jQuary validation
            // Check this to learn how to configure form handling with jq validation here :https://stackoverflow.com/questions/10798717/preventing-a-form-from-submitting-in-jquery-validate-plugins-submithandler-func

            //$('form input[type=submit]').attr('disabled', 'disabled'); //attempt to disable submitt button to aboid double submissions.
            $('#submit-btn').attr('disabled', 'disabled'); //attempt to disable submitt button to aboid double submissions.
            event.preventDefault();
            //$(".loading").show();
            console.log('Contact Form: Executing Submitt after validation form');
            var jData = $('#contact-form'); // Store in Jdata variable the complete form
            console.log(jData.serialize());
            var form_data = $('#contact-form').serializeArray().reduce(function (obj, item) {
                obj[item.name] = item.value;
                return obj;
            }, {});
            Rails.ajax({
                url: '/contact',
                type: "POST",
                data: jData.serialize(),
                success: function (data) {
                    console.log(data);
                    console.log('email: Contact form processed. Finally we are at this stage!');
                    $('#contact-form')[0].reset(); // attempt to reset the complete form. (it worked)
                    console.log('contacto-form process: Worked just fine');
                    $("#submit-btn").removeAttr("disabled");
                    $(".card-title").html('<h5> Dear ' + form_data['name'] + ', thanks for your message!. </h5>');
                    $("#modals").show();
                    grecaptcha.reset();
                }
            });
        }
    });

    $("body").click(function () {
        if ($("#modals").is(":visible")) {
            $("#modals").hide();
        }
    });

    /*=========================================================
     Form validation process
     ==========================================================*/
    showHideNavbar();

    $(window).on("load", function () {
        $(window).scroll(function () {
            showHideNavbar();
            console.log($(window).scrollTop())
        });
    });


    function showHideNavbar() {
        if ($(window).scrollTop() > 50) {
            // shows black nav 
            $("nav").addClass("nav-top");
            // shows back up button
            $("#backup-button").fadeIn();
        } else {

            //hides black nav
            $("nav").removeClass("nav-top");

            // shows back up button
            $("#backup-button").fadeOut();

        }
    }

    $("a.smooth-scroll").click(function (event) {
        event.preventDefault();
        //get section id
        var section_id = $(this).attr("href");
        $("html, body").animate({
            scrollTop: $(section_id).offset().top - 80
        }, 900);

    });

    $('.header-burger').click(function () {
        if ($('.mobile-burger-options').css('visibility') == 'hidden') {
            $('.mobile-burger-options').css('visibility', 'visible');
            $('.header-burger').addClass('animate-burger');
            $('.header-burger span').css('display', 'none');
        }
        else {
            $('.mobile-burger-options').css('visibility', ''); /* Note */
            $('.header-burger').removeClass('animate-burger');
            $('.header-burger span').css('display', ''); /* Note */
        }
    })

});


document.addEventListener("turbolinks:before-cache", function () {
    $('#projects-carousel').owlCarousel('destroy');
});