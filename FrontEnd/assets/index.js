//********Variables******//
const gallery = document.querySelector(".gallery");

//*****Récupération des travaux******//

async function getWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  return await response.json();
}
getWorks();

//*****Afficher les travaux dans le Dom****//
async function displayWorks() {
  const arrayWorks = await getWorks();
  arrayWorks.forEach((element) => {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const figcaption = document.createElement("figcaption");
    img.src = element.imageUrl;
    figcaption.textContent = element.title;
    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  });
}
displayWorks();

// Fonction: masque les figures non demandés (filtre) en activant le "display:none"
function filterWorksToGallery(category) {
  const figures = document.querySelectorAll(".gallery figure");
  for (i = 0; i < figures.length; i++) {
    if (figures[i].className.includes(category)) {
      figures[i].classList.remove("figureHidden");
    } else {
      figures[i].classList.add("figureHidden");
    }
  }
}

// Barre de filtres, lorsque on clique sur le bouton de filtre => appeler la fonction qui va gerer les figures + CSS des boutons
const filterButtons = document.querySelectorAll(".filterGallery-btn");
filterButtons[0].classList.add("btn-active");
filterButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();

    filterButtons.forEach((btn) => btn.classList.remove("btn-active"));

    switch (button.className) {
      case "filterGallery-btn filterAll":
        filterWorksToGallery("");
        break;
      case "filterGallery-btn filterObjects":
        filterWorksToGallery("categoryId1");
        break;
      case "filterGallery-btn fitlerApartments":
        filterWorksToGallery("categoryId2");
        break;
      case "filterGallery-btn filterHotelsRestaurants":
        filterWorksToGallery("categoryId3");
        break;
      default:
        console.error("Ce bouton ne correspond à aucun case (switch).");
    }
    button.classList.add("btn-active");
  });
});
