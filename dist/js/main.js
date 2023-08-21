


let $body,
	windowHeight,
	windowWidth,
	degree = 0.0174532925,
	mediaPoint1 = 1024,
	mediaPoint2 = 768,
	mediaPoint3 = 480,
	mediaPoint4 = 320
	const win = document.body

$(document).ready(function ($) {
	$body = $('body');
	modal();
	randomAlert();
	if($('.reviews_slider')) {
		loadVisibleContent();
	}

	if($('.header')) {
		headerMenu();
	}
});

$(window).on('load', function () {

});


function updateSizes() {
	windowWidth = window.innerWidth;
	windowHeight = window.innerHeight;
}

function succes(success) {
	$(success).toggleClass('active');
		setTimeout(function() {
			$(success).removeClass('active')
		}, 3000)
}

function failed(failed) {
	$(failed).toggleClass('active');
		setTimeout(function() {
			$(failed).removeClass('active')
		}, 3000)
}

function modal() {
	let popup = document.querySelectorAll('.popup')
	let btnArray = document.querySelectorAll('.trigger')
	
	btnArray.forEach((el) => {
		el.addEventListener('click', function(e) {
			e.preventDefault();
			let path = e.currentTarget.dataset.target
			popup.forEach((el) => {
				if(el.dataset.id == path) {
					isOpen(el)
				}
			})
			
		})
	})
	

	popup.forEach((pop) => {
		let remove = pop.querySelectorAll('.remove')
		remove.forEach(el => {
			el.addEventListener('click', (e) => {
				isRemove(pop);
			})
		});
	})
}



function isOpen(popup) {
	document.body.classList.add('fixed')
	popup.classList.add('active')
}

function isRemove(popup) {
	popup.classList.remove('active')
	document.body.classList.remove('fixed')
}

function randomAlert() {
	let inputSubmit = document.querySelectorAll('input[type="submit"]')
	if(inputSubmit) {
	
		inputSubmit.forEach(item => {
			let popup = document.querySelectorAll('.popup')
			item.addEventListener('click', (e) => {
				e.preventDefault();
		
				// Случайно выбираем между success и failed
				const randomValue = Math.random();
		
				if (randomValue < 0.5) {
					succes('.success');
				} else {
					failed('.failed');
				}
			});
		});
	}
}


const exampleSlider = new Swiper('.example-slider', {
	navigation: {
		prevEl: '.ex-prev',
		nextEl: '.ex-next',
	},
	pagination: {
		el: '.example-pag'
	},
	breakpoints: {
		320: {
			slidesPerView: 1,
			spaceBetween: 30,
		},
		768: {
			slidesPerView: 2,			
			spaceBetween: 30,
		},
		1380: {
			slidesPerView: 2,
			spaceBetween: 30,
		},
		1620: {
			slidesPerView: 3,
			spaceBetween: 30,
		},
	}
})


const reviewsSlider = new Swiper('.reviews_slider', {
	navigation: {
		prevEl: '.rev-prev',
		nextEl: '.rev-next',
	},
	pagination: {
		el: '.reviews-pag'
	},
	breakpoints: {
		320: {
			slidesPerView: 1,
			spaceBetween: 30,
		},
		768: {
			slidesPerView: 2,			
			spaceBetween: 30,
		},
		1380: {
			slidesPerView: 2,
			spaceBetween: 30,
		},
		1620: {
			slidesPerView: 2,
			spaceBetween: 30,
		},
	}
})

function loadVisibleContent() {
  let seoBlocks = document.querySelectorAll(".reviews-slide");

  Array.from(seoBlocks).forEach((seoBlock) => {
    let loadMoreButton = seoBlock.querySelector(".reviews_slide--more");
    let smallBlock = seoBlock.querySelector(".reviews_slide--content");
    smallBlock.classList.remove("visible");
		if(smallBlock.textContent.length > 400) {
			if(loadMoreButton) {
				loadMoreButton.addEventListener("click", function () {
					if (smallBlock.classList.contains("visible")) {
						smallBlock.classList.remove("visible");
						loadMoreButton.querySelector("button").innerHTML = "Показать еще";
					} else {
						smallBlock.classList.add("visible");
						loadMoreButton.querySelector("button").innerHTML = "Скрыть";
					}
				});
			}
		} else {
			loadMoreButton.style.display = 'none'
		}

  });
}



function headerMenu() {
	let itemNav = document.querySelectorAll('nav > ul > li > a')

	itemNav.forEach(el => {
			el.addEventListener('click', (e) => {
					let activeItem = document.querySelector('nav > ul > li > a.active');
					if (activeItem) {
							activeItem.classList.remove('active');
					}
					el.classList.add('active');
			})
	});
}

window.onscroll = function showHeader() {
	var header = document.querySelector('.header');
	if(window.pageYOffset > 100){
			header.classList.add('fixed');
	} else{
			header.classList.remove('fixed');
	}
}





