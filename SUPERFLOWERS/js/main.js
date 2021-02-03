/// SWIPER ///

new Swiper(".swiper-container", {
	// Стрелки //
	// navigation: {
	// 	nextEl: '.swiper-button-next',
	// 	prevEl: '.swiper-button-prev'
	// },
	slidesPerView: 1,
	grabCursor: true,
	pagination: {
		el: '.swiper-pagination',
		type: 'bullets',
	},
	autoplay: {
		delay: 3000,
		disableOnInteraction: false,
	},
	loop: true,
	speed: 1000,
	// breakpoints: {
	// 	320: {
	// 		slidesPerView: 1,
	// 	},
	// 	380: {
	// 		slidesPerView: 2,
	// 	},
	// 	570: {
	// 		slidesPerView: 3,
	// 	},
	// 	730: {
	// 		slidesPerView: 4,
	// 	},
	// 	950: {
	// 		slidesPerView: 5,
	// 	},
	// 	1050: {
	// 		slidesPerView: 6,
	// 	},
	// }
});

/// ТАБЫ ///

var jsTriggers = document.querySelectorAll('.js-tab-trigger'),
	jsContents = document.querySelectorAll('.js-tab-content');

jsTriggers.forEach(function (trigger) {
	trigger.addEventListener('click', function () {
		var id = this.getAttribute('data-tab'),
			content = document.querySelector('.js-tab-content[data-tab="' + id + '"]'),
			activeTrigger = document.querySelector('.js-tab-trigger.active'),
			activeContent = document.querySelector('.js-tab-content.active');

		activeTrigger.classList.remove('active'); // 1
		trigger.classList.add('active'); // 2

		activeContent.classList.remove('active'); // 3
		content.classList.add('active'); // 4
	});
});


/// ДЕЙСТВИЕ ПРИ КЛИКЕ ///

$(function () {
	$(".listing__bottom-btn").click(function () {
		$(".listing__bottom-text-hidden").slideToggle();
		$(".listing__bottom-text").toggleClass('active')
		// if ($(".listing__bottom-text").hasClass("active")) {
		// 	$(".listing__bottom-text").removeClass("active");
		// 	$(".listing__bottom-btn").text('читать полностью')
		// } else {
		// 	$(".listing__bottom-text").addClass("active");
		// 	$(".listing__bottom-btn").text('скрыть')
		// }
	})
});

/// БУРГЕР ///
$('.header__burger').on('click', function () {
	if (!$(this).hasClass('active')) {
		$('.header__burger, .header__menu, .header__menu-list').toggleClass('active');
		$('body').toggleClass('lock');
	} else {
		$('.header__burger, .header__menu, .header__menu-list').removeClass('active');
		$('body').removeClass('lock');
	}
});
