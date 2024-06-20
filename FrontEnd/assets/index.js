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

//*****Initialisation des boutons et affichage initial des travaux****//

// Fonction pour créer les boutons et initialiser l'affichage
async function initializeButtons() {
  const allWorks = await getWorks();
  const categories = await fetchCategory();

  // Création du bouton "Tous" et des autres boutons par catégorie
  const btnAll = document.createElement("button");
  btnAll.textContent = "Tous";
  btnAll.classList.add("buttons-filtres", "active");
  btnAll.id = 0;
  containerFiltres.appendChild(btnAll);

  categories.forEach((category, index) => {
    const btn = document.createElement("button");
    btn.classList.add("buttons-filtres");
    btn.textContent = category.name;
    btn.id = category.id;
    containerFiltres.appendChild(btn);
  });

  // Affichage initial de tous les travaux
  displayWorks(allWorks);

  // Gestion des clics sur les boutons de filtres
  containerFiltres.addEventListener("click", async (e) => {
    if (!e.target.matches("button")) return;

    const btnId = e.target.id;
    gallery.innerHTML = "";

    // Supprimer la classe active de tous les boutons
    const buttons = containerFiltres.querySelectorAll("button");
    buttons.forEach((btn) => {
      btn.classList.remove("active");
    });

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

    // Ajouter la classe active au bouton cliqué
    e.target.classList.add("active");
  });
}

// Initialisation de l'affichage et de la gestion des boutons
initializeButtons();

//******Page Log In Connexion*****//
const form = document.querySelector("form");
const email = document.getElementById("email");
const password = document.getElementById("password");
