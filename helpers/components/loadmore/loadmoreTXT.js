function loadVisibleContent() {
  let seoBlocks = document.querySelectorAll("Тут твой селектор");

  Array.from(seoBlocks).forEach((seoBlock) => {
    let loadMoreButton = seoBlock.querySelector("Тут твой селектор");
    let smallBlock = seoBlock.querySelector("Тут твой селектор");
    smallBlock.classList.remove("visible");

    loadMoreButton.addEventListener("click", function () {
      if (smallBlock.classList.contains("visible")) {
        smallBlock.classList.remove("visible");
        loadMoreButton.querySelector("button").innerHTML = "Показать еще";
      } else {
        smallBlock.classList.add("visible");
        loadMoreButton.querySelector("button").innerHTML = "Скрыть";
      }
    });
  });
}