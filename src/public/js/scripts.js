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
            mixpanel.track("navbar subscribe");
            scroll_to = $(".subscribe").offset().top - nav_height - 60;
        } else if (element_class == 'menu-project') {
            mixpanel.track("navbar product");
            scroll_to = $(".about").offset().top - nav_height - 60;
        } else if (element_class == 'menu-testimonials') {
            mixpanel.track("navbar testimonials");
            scroll_to = $(".testimonials").offset().top - nav_height - 60;
        } else if (element_class == 'menu-about-us') {
            mixpanel.track("navbar about-us");
            scroll_to = $(".whos-behind").offset().top - nav_height - 60;
        } else if (element_class == 'menu-contact') {
            mixpanel.track("navbar contact");
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
      "img/backgrounds/1.jpg"
    , "img/backgrounds/2.jpg"
    , "img/backgrounds/3.jpg"
    ], {
        duration: 3000,
        fade: 750
    });
    */

    /*
        Static background
    */
    //$('.coming-soon').backstretch("img/backgrounds/slc-splash.png");

    $('.youTube').backstretch("img/backgrounds/steel-gray.jpg");
    
    $('.about-container').backstretch("img/backgrounds/light_blue.jpg");
    
    $('.whos-behind-container').backstretch("img/backgrounds/light_blue.jpg");


    // Countdown timer code went here...

    
    /*
        Video Player
    */
    
    // Tracking video plays with Mixpanel
    /**var hasPlayed = false;
    $(.embed-responsive-item).click(function(){
        if (hasPlayed === false){
            mixpanel.track("youTube video play");
            hasPlayed = true;
        }
    });
    **/
                                    
    /***  For now, we'll use the YouTube video player instead of the custom player
       
    var videoPlayer = $('#videoPlayer');
    $('.btnPlay').click(function () { 
        if (videoPlayer[0].paused) {
            mixpanel.track("Video play");
            videoPlayer[0].play();
            $('.glyphicon-play').attr('class', 'glyphicon glyphicon-pause');
        } else {
            videoPlayer[0].pause();
            $('.glyphicon-pause').attr('class', 'glyphicon glyphicon-play');
        }
        return false;
    });

    videoPlayer.on('timeupdate', function () {
        $('.current').text(Math.round(videoPlayer[0].currentTime));
    });

    videoPlayer.on('loadedmetadata', function () {
        $('.duration').text(Math.round(videoPlayer[0].duration));
    });

    $('.btnMute').click(function () {
        if (videoPlayer[0].muted === false) {
            videoPlayer[0].muted = true;
            $('.glyphicon-volume-up').attr('class', 'glyphicon glyphicon-volume-off');
        } else {
            videoPlayer[0].muted = false;
            $('.glyphicon-volume-off').attr('class', 'glyphicon glyphicon-volume-up');
        }
        return false;
    });

    $('.btnFullscreen').on('click', function() {
        mixpanel.track("Full screen video");
        videoPlayer[0].webkitEnterFullscreen();
        videoPlayer[0].mozRequestFullScreen();
        return false;
        });

***/
    
    
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

    /* 
        Omit the tweet feature for now...  
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
    //$('select').removeClass(
    
    
    $('#multiple-selection').multiselect({
            nonSelectedText: 'I am a...',
            buttonWidth: '140px',
            //buttonContainer: '<div class="multiselect-container" />'
        });
    
        $('#multiple-selection2').multiselect({
            nonSelectedText: 'I am a...',
            buttonWidth: '140px',
            //buttonContainer: '<div class="multiselect-container" />'
        });
    
    
    $('.success-message').hide();
    $('.error-message').hide();

    $('.subscribe form').submit(function (e) {
        e.preventDefault();
        var postdata = $('.subscribe form').serialize();
        $.ajax({
            type: 'POST',
            url: '/process-subscription',
            data: postdata,
            dataType: 'json',
            success: function (data) {
                if (data.success == 0) {
                    $('.success-message').hide();
                    $('.error-message').hide();
                    $('.error-message').html('Oops! There was a problem... Please enter a valid email.');
                    $('.error-message').fadeIn();
                } else {
                    $('.error-message').hide();
                    $('.success-message').hide();
                    $('.subscribe form').hide();
                    $('.success-message').html('Thank you!');
                    $('.success-message').fadeIn();
                    mixpanel.track("new subscriber");
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
            url: '/process-contact',
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