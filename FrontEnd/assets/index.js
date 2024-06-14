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

//masque les figures non demandés (filtres) en activant le "display:none"
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
