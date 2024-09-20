/*
$(document).ready(function(){

    //banner owl carousel
    $("#banner-area.owl-carousel").owlCarousel({
        dots:true,
        items:1
    });
    //  Top-Sale owl carousel
    $("#Top-Sale.owl-carousel").owlCarousel({
        loop:true,
        nav:true,
        dots:false,
        responsive:{
            0:{
                items:1
            },
            600:{
                items:3
            },

            1000:{
                items:5
            }
        }
    })

    //isotope filter

    var $grid= $("grid").isotope({
        itemSelector:'grid-item',
        layoutMode:'FitRows',
    });

    //filter items on button click

    $("button-group").on('click','button',function(){
        var filterValue = $(this).attr('data-filter');
        $grid.isotope({filter:filterValue})
    })

    //new phone owl carousel

    $("#new-phones.owl-carousel").owlCarousel({
        loop:true,
        nav:false,
        dots:true,
        responsive:{
            0:{
                items:1
            },
            600:{
                items:3
            },

            1000:{
                items:5
            }
        }
    })

    //Blogs owl carousel

    $("#blogs owl-carousel").owlCarousel({
        loop:true,
        nav:false,
        dots:true,
        responsive:{
            0:{
                items:1
            },
            600:{
                items:3
            },

            
        }
    })

    //product qty section
    let $qty_up = $(".qty.qty-up");
    let $qty_down = $(".qty.qty-down");
    let $input = $(".qty.qty_input");
    
    //qty on click
    $qty_up.click(function(e){
        if($input.val()>=1 && $input.val()<=9){
            $input.val(function(i,oldval){
                return ++oldval;
            })
        }
    });


    $qty_down.click(function(e){
        if($input.val()>1 && $input.val()<=10){
            $input.val(function(i,oldval){
                return --oldval;
            })
        }
    });

});
*/






$(document).ready(function(){
    // Banner area owl carousel
    $("#banner-area .owl-carousel").owlCarousel({
        dots: true,
        items: 1
    });

    // Top-Sale owl carousel
    $("#Top-Sale .owl-carousel").owlCarousel({
        loop: true,
        nav: true,
        dots: false,
        responsive: {
            0: {
                items: 1
            },

            600: {
                items: 3
            },
            
            1000: {
                items: 5
            }
        }
    });

    // Isotope filter
    var $grid = $(".grid").isotope({
        itemSelector: '.grid-item',
        layoutMode: 'fitRows',
    });

    // Filter items on button click
    $(".button-group").on('click', 'button', function(){
        var filterValue = $(this).attr('data-filter');
        $grid.isotope({ filter: filterValue });
    });

    // New phones owl carousel
    $("#new-phones .owl-carousel").owlCarousel({
        loop: true,
        nav: false,
        dots: true,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 3
            },
            1000: {
                items: 5
            }
        }
    });

    // Blogs owl carousel
    $("#blogs .owl-carousel").owlCarousel({
        loop: true,
        nav: false,
        dots: true,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 3
            }
        }
    });

    // Product quantity section
    let $qty_up = $(".qty .qty-up");
    let $qty_down = $(".qty .qty-down");
    let $input = $(".qty .qty_input");

    // qty-up button click event
    $qty_up.click(function(e){
        let currentVal = parseInt($input.val());
        if(currentVal >= 1 && currentVal <= 9){
            $input.val(currentVal + 1);
        }
    });

    // qty-down button click event
    $qty_down.click(function(e){
        let currentVal = parseInt($input.val());
        if(currentVal > 1 && currentVal <= 10){
            $input.val(currentVal - 1);
        }
    });
});























/*

$(document).ready(function(){
    // Banner owl carousel
    $("#banner-area").owlCarousel({
        dots: true,
        items: 1
    });

    // Top-Sale owl carousel
    $("#Top-Sale").owlCarousel({
        loop: true,
        nav: true,
        dots: false,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 3
            },
            1000: {
                items: 5
            }
        }
    });

    // Isotope filter
    var $grid = $(".grid").isotope({
        itemSelector: '.grid-item',
        layoutMode: 'fitRows'
    });

    // Filter items on button click
    $(".button-group").on('click', 'button', function(){
        var filterValue = $(this).attr('data-filter');
        $grid.isotope({ filter: filterValue });
    });

    // New phone owl carousel
    $("#new-phones").owlCarousel({
        loop: true,
        nav: false,
        dots: true,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 3
            },
            1000: {
                items: 5
            }
        }
    });

    // Blogs owl carousel
    $("#blogs .owl-carousel").owlCarousel({
        loop: true,
        nav: false,
        dots: true,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 3
            }
        }
    });

    // Product quantity section
    let $qty_up = $(".qty .qty-up");
    let $qty_down = $(".qty .qty-down");
    let $input = $(".qty .qty_input");

    // Quantity increase button
    $qty_up.click(function(e){
        if($input.val() >= 1 && $input.val() <= 9){
            $input.val(function(i, oldval){
                return ++oldval;
            });
        }
    });

    // Quantity decrease button
    $qty_down.click(function(e){
        if($input.val() > 1 && $input.val() <= 10){
            $input.val(function(i, oldval){
                return --oldval;
            });
        }
    });
});

*/