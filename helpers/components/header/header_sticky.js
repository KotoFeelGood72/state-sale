$(window).on("scroll", function () {
	var scrolled = $(this).scrollTop();
	if( scrolled > 107 ) {
			$('.header').addClass('fixed');
	}   
	if( scrolled <= 107 ) {     
			$('.header').removeClass('fixed');
	}
});
