//********Variables******//
const gallery = document.querySelector(".gallery");
const containerFiltres = document.querySelector(".container-filtres");

//*****Récupération des travaux et récupération catégories******//
async function getWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  return await response.json();
}

async function fetchCategory() {
  const requete = await fetch("http://localhost:5678/api/categories");
  return requete.json();
}

//*****Afficher les travaux dans le Dom****//
async function displayWorks(works) {
  gallery.innerHTML = ""; // Vider la galerie avant d'afficher les travaux
  works.forEach((element) => {
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

// Initialiser l'affichage de tous les travaux
getWorks().then(displayWorks);

//*****Création des boutons dynamiquement******//
const btnAll = document.createElement("button");
btnAll.textContent = "Tous";
btnAll.classList.add("buttons-filtres", "active");
btnAll.id = 0;
containerFiltres.appendChild(btnAll);

//*********Boucle for pour créer les boutons par catégorie******//
function creationButtons() {
  fetchCategory().then((data) => {
    data.forEach((category) => {
      const btn = document.createElement("button");
      btn.classList.add("buttons-filtres");
      btn.textContent = category.name;
      btn.id = category.id;
      containerFiltres.appendChild(btn);
    });
  });
}
creationButtons();

//*****Filtrer au click sur le bouton par catégorie******/
async function filterCategory() {
  const allWorks = await getWorks();
  const buttons = document.querySelectorAll(".container-filtres button");

  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const btnId = e.target.id;
      gallery.innerHTML = "";

      if (btnId === "0") {
        // Afficher tous les travaux
        displayWorks(allWorks);
      } else {
        // Filtrer et afficher les travaux par catégorie
        const galleryTriCategory = allWorks.filter(
          (choice) => choice.categoryId == btnId
        );
        displayWorks(galleryTriCategory);
      }
    });
  });
}
filterCategory();
