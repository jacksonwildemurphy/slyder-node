jQuery(document).ready(function () {

    /*
	    Top menu
    */

    // Makes the navbar visible once the site loads. Ideally, the navbar would just be static, but
    // this bootstrap theme originally had a hide/show navbar feature. I chose to use this work-around
    // so that the theme's navigation scrolling can still be used as-is. 
    $('nav').slideDown();


    // navigation
    $('nav a').on('click', function (e) {
        e.preventDefault();
        var element_class = $(this).attr('class');
        var scroll_to = 0;
        var nav_height = $('nav').height();
        if (element_class == 'menu-top') {
            scroll_to = $(".coming-soon").offset().top;
        } else if (element_class == 'menu-subscribe') {
            scroll_to = $(".subscribe").offset().top - nav_height - 60;
        } else if (element_class == 'menu-project') {
            scroll_to = $(".about").offset().top - nav_height - 60;
        } else if (element_class == 'menu-testimonials') {
            scroll_to = $(".testimonials").offset().top - nav_height - 60;
        } else if (element_class == 'menu-about-us') {
            scroll_to = $(".whos-behind").offset().top - nav_height - 60;
        } else if (element_class == 'menu-contact') {
            scroll_to = $(".contact").offset().top - nav_height - 60;
        }

        if ($(window).scrollTop() != scroll_to && element_class !== undefined) {
            $('html, body').animate({
                scrollTop: scroll_to
            }, 1000);
        }
    });

    /*
        Background slideshow

    $('.coming-soon').backstretch([
      "assets/img/backgrounds/1.jpg"
    , "assets/img/backgrounds/2.jpg"
    , "assets/img/backgrounds/3.jpg"
    ], {
        duration: 3000,
        fade: 750
    });
    */

    /*
        Static background
    */
    //$('.coming-soon').backstretch("assets/img/backgrounds/slc-splash.png");

    $('.about-container').backstretch("assets/img/backgrounds/steel-gray.jpg");

    $('.whos-behind-container').backstretch("assets/img/backgrounds/light_blue.jpg");


    // Countdown timer code went here...

    /*
        Testimonials
    */
    $('.testimonial-active').html('<p>' + $('.testimonial-single:first p').html() + '</p>');
    $('.testimonial-single:first .testimonial-single-image img').css('opacity', '1');

    $('.testimonial-single-image img').on('click', function () {
        $('.testimonial-single-image img').css('opacity', '0.5');
        $(this).css('opacity', '1');
        var new_testimonial_text = $(this).parent('.testimonial-single-image').siblings('p').html();
        $('.testimonial-active p').fadeOut(300, function () {
            $(this).html(new_testimonial_text);
            $(this).fadeIn(400);
        });
    });

    /*
	    Show latest tweets
	*/

    /* Omit the tweet feature for now... 

    */

    /*
	    Google maps
	*/
    var position = new google.maps.LatLng(40.767451, -111.882151);
    $('.contact-address .map').gmap({
        'center': position,
        'zoom': 13,
        'disableDefaultUI': true,
        'callback': function () {
            var self = this;
            self.addMarker({
                'position': this.get('map').getCenter()
            });
        }
    });

    /*
        Subscription form
    */
    $('.success-message').hide();
    $('.error-message').hide();

    $('.subscribe form').submit(function (e) {
        e.preventDefault();
        var postdata = $('.subscribe form').serialize();
        $.ajax({
            type: 'POST',
            url: 'assets/subscribe.php',
            data: postdata,
            dataType: 'json',
            success: function (json) {
                if (json.valid == 0) {
                    $('.success-message').hide();
                    $('.error-message').hide();
                    $('.error-message').html(json.message);
                    $('.error-message').fadeIn();
                } else {
                    $('.error-message').hide();
                    $('.success-message').hide();
                    $('.subscribe form').hide();
                    $('.success-message').html(json.message);
                    $('.success-message').fadeIn();
                }
            }
        });
    });

    /*
	    Contact form
	*/
    $('.contact-form form input[type="text"], .contact-form form textarea').on('focus', function () {
        $('.contact-form form input[type="text"], .contact-form form textarea').removeClass('contact-error');
    });
    $('.contact-form form').submit(function (e) {
        e.preventDefault();
        $('.contact-form form input[type="text"], .contact-form form textarea').removeClass('contact-error');
        var postdata = $('.contact-form form').serialize();
        $.ajax({
            type: 'POST',
            url: 'assets/contact.php',
            data: postdata,
            dataType: 'json',
            success: function (json) {
                if (json.emailMessage != '') {
                    $('.contact-form form .contact-email').addClass('contact-error');
                }
                if (json.subjectMessage != '') {
                    $('.contact-form form .contact-subject').addClass('contact-error');
                }
                if (json.messageMessage != '') {
                    $('.contact-form form textarea').addClass('contact-error');
                }
                if (json.emailMessage == '' && json.subjectMessage == '' && json.messageMessage == '') {
                    $('.contact-form form').fadeOut('fast', function () {
                        $('.contact-form').append('<p>Thanks for contacting us! We will get back to you very soon.</p>');
                    });
                }
            }
        });
    });


});