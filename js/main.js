(function ($) {

    var $window = $(window),
        $body = $('body'),
        $sidebar = $('#sidebar');

    // Breakpoints.
    breakpoints({
        xlarge: ['1281px', '1680px'],
        large: ['981px', '1280px'],
        medium: ['737px', '980px'],
        small: ['481px', '736px'],
        xsmall: [null, '480px']
    });

    // Hack: Enable IE flexbox workarounds.
    if (browser.name == 'ie')
        $body.addClass('is-ie');

    // Play initial animations on page load.
    $window.on('load', function () {
        window.setTimeout(function () {
            $body.removeClass('is-preload');
        }, 100);
    });

    // Forms.

    // Hack: Activate non-input submits.
    $('form').on('click', '.submit', function (event) {

        // Stop propagation, default.
        event.stopPropagation();
        event.preventDefault();

        // Submit form.
        $(this).parents('form').submit();

    });

    // Sidebar.
    if ($sidebar.length > 0) {

        var $sidebar_a = $sidebar.find('a');

        $sidebar_a
            .addClass('scrolly')
            .on('click', function () {

                var $this = $(this);


                // External link? Bail.
                if ($this.attr('href').charAt(0) != '#')
                    return;

                // Deactivate all links.
                if ($('.siderbar-active').hasClass('menu-btn-active')) {
                    $('.menu-btn-active').removeClass('siderbar-active');
                } else {
                    $('.menu-btn-active').addClass('siderbar-active');
                }
                $sidebar_a.removeClass('active');


                // Activate link *and* lock it (so Scrollex doesn't try to activate other links as we're scrolling to this one's section).

                $this
                    .addClass('active')
                    .addClass('active-locked');

            })
            .each(function () {

                var $this = $(this),
                    id = $this.attr('href'),
                    $section = $(id);

                // No section for this link? Bail.
                if ($section.length < 1)
                    return;

                // Scrollex.
                $section.scrollex({
                    mode: 'middle',
                    top: '-20vh',
                    bottom: '-20vh',
                    initialize: function () {

                        // Deactivate section.
                        $section.addClass('inactive');

                    },
                    enter: function () {

                        // Activate section.
                        $section.removeClass('inactive');

                        // No locked links? Deactivate all links and activate this section's one.
                        if ($sidebar_a.filter('.active-locked').length == 0) {

                            $sidebar_a.removeClass('active');
                            $this.addClass('active');

                        }

                        // Otherwise, if this section's link is the one that's locked, unlock it.
                        else if ($this.hasClass('active-locked'))
                            $this.removeClass('active-locked');

                    }
                });

            });

    }

    // Scrolly.
    $('.scrolly').scrolly({
        speed: 1000,
        offset: function () {

            // If <=large, >small, and sidebar is present, use its height as the offset.
            if (breakpoints.active('<=large') &&
                !breakpoints.active('<=small') &&
                $sidebar.length > 0)
                return $sidebar.height();

            return 0;

        }
    });

    // Spotlights.
    $('.spotlights > section')
        .scrollex({
            mode: 'middle',
            top: '-10vh',
            bottom: '-10vh',
            initialize: function () {

                // Deactivate section.
                $(this).addClass('inactive');

            },
            enter: function () {

                // Activate section.
                $(this).removeClass('inactive');

            }
        })
        .each(function () {

            var $this = $(this),
                $image = $this.find('.image'),
                $img = $image.find('img'),
                x;

            // Assign image.
            $image.css('background-image', 'url(' + $img.attr('src') + ')');

            // Set background position.
            if (x = $img.data('position'))
                $image.css('background-position', x);

            // Hide <img>.
            $img.hide();

        });

    // Features.
    $('.features')
        .scrollex({
            mode: 'middle',
            top: '-20vh',
            bottom: '-20vh',
            initialize: function () {

                // Deactivate section.
                $(this).addClass('inactive');

            },
            enter: function () {

                // Activate section.
                $(this).removeClass('inactive');

            }
        });



    $('.closebtn').on('click', function () {
        $(this).closest('.popup-form-show').fadeOut(100);
    });







    jQuery(document).ready(function ($) {
        var $slider = $(".slideshow .slider"),
            maxItems = $(".item", $slider).length,
            dragging = false,
            tracking,
            rightTracking;

        $sliderRight = $(".slideshow")
            .clone()
            .addClass("slideshow-right")
            .appendTo($(".split-slideshow"));

        rightItems = $(".item", $sliderRight).toArray();
        reverseItems = rightItems.reverse();
        $(".slider", $sliderRight).html("");
        for (i = 0; i < maxItems; i++) {
            $(reverseItems[i]).appendTo($(".slider", $sliderRight));
        }

        $slider.addClass("slideshow-left");
        $(".slideshow-left")
            .slick({
                vertical: true,
                verticalSwiping: true,
                arrows: false,
                infinite: true,
                dots: true,
                speed: 1000,
                cssEase: "cubic-bezier(0.7, 0, 0.3, 1)"
            })
            .on("beforeChange", function (event, slick, currentSlide, nextSlide) {
                if (
                    currentSlide > nextSlide &&
                    nextSlide == 0 &&
                    currentSlide == maxItems - 1
                ) {
                    $(".slideshow-right .slider").slick("slickGoTo", -1);
                    $(".slideshow-text").slick("slickGoTo", maxItems);
                } else if (
                    currentSlide < nextSlide &&
                    currentSlide == 0 &&
                    nextSlide == maxItems - 1
                ) {
                    $(".slideshow-right .slider").slick("slickGoTo", maxItems);
                    $(".slideshow-text").slick("slickGoTo", -1);
                } else {
                    $(".slideshow-right .slider").slick(
                        "slickGoTo",
                        maxItems - 1 - nextSlide
                    );
                    $(".slideshow-text").slick("slickGoTo", nextSlide);
                }
            })
            .on("mousewheel", function (event) {
                event.preventDefault();
                if (event.deltaX > 0 || event.deltaY < 0) {
                    $(this).slick("slickNext");
                } else if (event.deltaX < 0 || event.deltaY > 0) {
                    $(this).slick("slickPrev");
                }
            })
            .on("mousedown touchstart", function () {
                dragging = true;
                tracking = $(".slick-track", $slider).css("transform");
                tracking = parseInt(tracking.split(",")[5]);
                rightTracking = $(".slideshow-right .slick-track").css("transform");
                rightTracking = parseInt(rightTracking.split(",")[5]);
            })
            .on("mousemove touchmove", function () {
                if (dragging) {
                    newTracking = $(".slideshow-left .slick-track").css("transform");
                    newTracking = parseInt(newTracking.split(",")[5]);
                    diffTracking = newTracking - tracking;
                    $(".slideshow-right .slick-track").css({
                        transform: "matrix(1, 0, 0, 1, 0, " + (rightTracking - diffTracking) + ")"
                    });
                }
            })
            .on("mouseleave touchend mouseup", function () {
                dragging = false;
            });

        $(".slideshow-right .slider").slick({
            swipe: false,
            vertical: true,
            arrows: false,
            infinite: true,
            speed: 950,
            cssEase: "cubic-bezier(0.7, 0, 0.3, 1)",
            initialSlide: maxItems - 1
        });
        $(".slideshow-text").slick({
            swipe: false,
            vertical: true,
            arrows: false,
            infinite: true,
            speed: 900,
            cssEase: "cubic-bezier(0.7, 0, 0.3, 1)"
        });
    });

})(jQuery);
