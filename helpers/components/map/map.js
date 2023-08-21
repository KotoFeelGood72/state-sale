function map() {
	ymaps.ready(function () {
		var myMap = new ymaps.Map('map', {
						center: [60.144095, 29.930985],
						zoom: 16,
						scroll: false,
				}, {
						searchControlProvider: 'yandex#search'
				}),
	
				myPlacemark = new ymaps.Placemark(myMap.getCenter(), {
						balloonContent: 'ул. Петровская, 53 Санкт-Петербург, Россия'
				}, {
						iconLayout: 'default#image',
						iconImageHref: '/i/logo.jpg',
						iconImageSize: [26, 35],
						iconImageOffset: [-5, -38]
				});
	
		myMap.geoObjects
				.add(myPlacemark)
	});
}