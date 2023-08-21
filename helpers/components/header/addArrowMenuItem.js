function checkSubmenu() {
	const menuList = document.querySelectorAll('.nav_list');

	Array.from(menuList).map((menuParentItem) => {
		let menuItem = menuParentItem.querySelectorAll('li')
	
		Array.from(menuItem).map((el) => {
			let checkItems = el.children
			Array.from(checkItems).map((items) =>{
				if(items.classList.contains('sub-menu')) {
					el.classList.add('parent_element_item')
				}
			})
		})
	})
}