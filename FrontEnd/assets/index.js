//********Variables******//
const gallery = document.querySelector(".gallery");
const containerFiltres = document.querySelector(".container-filtres");

//*****Récupération des travaux et récupération catégories******//

async function getWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  return await response.json();
}
getWorks();

async function fetchCategory() {
  const requete = await fetch("http://localhost:5678/api/categories");
  return requete.json();
}

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

/*****Création des bouton dynamiquement******/

const btnAll = document.createElement("button"); //premier bouton sans catégorie
btnAll.textContent = "TOUS";
btnAll.classList.add("buttons-filtres", "active");
btnAll.id = 0;
containerFiltres.appendChild(btnAll);
/*Boucle for pour creer les bouton par catégorie*/
function creationButtons() {
  fetchCategory().then((data) => {
    console.log(data);
    data.forEach((category) => {
      const btn = document.createElement("button");
      btn.classList.add("buttons-filtres");
      btn.textContent = category.name;
      btn.id = category.id;
      containerFiltres.appendChild(btn);
      console.log(category.id);
      console.log(category.name);
    });
  });
}
creationButtons();
