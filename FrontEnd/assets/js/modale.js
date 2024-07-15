// Variables globales pour les éléments du DOM***//
const containerModal = document.getElementById("containerModal");
const modalPhoto = document.querySelector(".modalPhoto");
const modalAddWorks = document.querySelector(".modalAddWorks");
const modalGalleryDisplay = document.querySelector(".modalGallery");
const btnAddModal = document.querySelector(".modalGallery button");
const closeModalWorks = document.getElementById("closeModalWorks");
const arrowLeft = document.querySelector(".fa-arrow-left");
const closeModal = document.getElementById("closeModal");
const modifModalSpan = document.querySelector(".modifModal");
const inputCategory = document.querySelector("#categoryInput");
const inputFile = document.querySelector("#file");
const previewImage = document.getElementById("previewImage");
const formAddWorks = document.getElementById("formAddWorks");

//****Fonction pour récupérer les travaux depuis l'API*****//
async function getWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  return await response.json();
}

//***Fonction pour supprimer un travail****//
async function deleteWork(workId) {
  const userToken = window.sessionStorage.getItem("token");
  const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  });

  if (response.ok) {
    return true;
  } else {
    console.error("Erreur lors de la suppression du travail");
    return false;
  }
}

//***Fonction pour afficher tous les travaux dans la modal****//
async function displayAllWorksInModal() {
  const allWorks = await getWorks();
  modalPhoto.innerHTML = "";

  allWorks.forEach((work) => {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const figcaption = document.createElement("figcaption");
    const deleteIcon = document.createElement("i");

    img.src = work.imageUrl;
    figure.classList.add("modalPhoto-figure");
    deleteIcon.className = "fa-solid fa-trash-can delete-icon";
    figure.setAttribute("data-work-id", work.id);
    deleteIcon.addEventListener("click", async (e) => {
      e.stopPropagation();
      const workId = work.id;
      const success = await deleteWork(workId);

      if (success) {
        const figureToRemove = document.querySelector(
          `[data-work-id="${workId}"]`
        );
        if (figureToRemove) {
          figureToRemove.remove();
        }
      }
    });

    figure.appendChild(deleteIcon);
    figure.appendChild(img);
    figure.appendChild(deleteIcon);

    modalPhoto.appendChild(figure);
  });
}

//****Écouteur d'événement pour ouvrir la modal et afficher tous les travaux****//
document.addEventListener("DOMContentLoaded", () => {
  modifModalSpan.addEventListener("click", () => {
    containerModal.style.display = "flex";
    modalGalleryDisplay.style.display = "flex";
    modalAddWorks.style.display = "none";

    //****Appel de la fonction pour afficher tous les travaux dans la modal***//
    displayAllWorksInModal();
  });

  //***Fermeture de la modal quand on clique sur la croix*****//
  closeModal.addEventListener("click", function () {
    containerModal.style.display = "none";
  });

  //****Fermeture de la modal quand on clique en dehors de celle-ci****//
  containerModal.addEventListener("click", function (e) {
    if (e.target === containerModal) {
      containerModal.style.display = "none";
    }
  });

  //****Fermeture de la modal AddWorks en cliquant en dehors****//
  modalAddWorks.addEventListener("click", (e) => {
    if (e.target === modalAddWorks) {
      modalAddWorks.style.display = "none";
    }
  });

  //****Changement d'affichage entre la modal Gallery et AddWorks****//
  btnAddModal.addEventListener("click", () => {
    modalGalleryDisplay.style.display = "none";
    modalAddWorks.style.display = "flex";
  });

  //***Fermeture de la modal AddWorks****//
  closeModalWorks.addEventListener("click", () => {
    modalAddWorks.style.display = "none";

    resetAddWorksModal();
  });

  //***Retour à la modal Gallery depuis AddWorks***//
  arrowLeft.addEventListener("click", () => {
    modalAddWorks.style.display = "none";
    modalGalleryDisplay.style.display = "flex";
    resetAddWorksModal();
  });

  //****Événement de changement de fichier pour l'aperçu de l'image***//
  inputFile.addEventListener("change", () => {
    const file = inputFile.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        previewImage.src = e.target.result;
        previewImage.style.display = "block";
      };
      reader.readAsDataURL(file);
    } else {
      previewImage.src = "#";
      previewImage.style.display = "none";
    }
  });

  //****Gestion du formulaire d'ajout de travail****//
  //déclenchée lorsque l'utilisateur soumet le formulaire pour ajouter un nouveau travail à la galerie.
  formAddWorks.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(formAddWorks);
    const newWork = await addWork(formData);

    if (newWork) {
      //****Ajouter le nouveau travail à la galerie principale****//
      const figure = document.createElement("figure");
      const img = document.createElement("img");
      const figcaption = document.createElement("figcaption");

      img.src = newWork.imageUrl;
      figcaption.textContent = newWork.title;
      figure.appendChild(img);
      figure.appendChild(figcaption);
      gallery.appendChild(figure);

      //***Ajouter le nouveau travail à la modal gallery****//
      const modalFigure = document.createElement("figure");
      const modalImg = document.createElement("img");
      const modalFigcaption = document.createElement("figcaption");
      const deleteIcon = document.createElement("i");

      modalImg.src = newWork.imageUrl;
      modalFigure.classList.add("modalPhoto-figure");
      deleteIcon.className = "fa-solid fa-trash-can delete-icon";
      modalFigure.setAttribute("data-work-id", newWork.id);
      deleteIcon.addEventListener("click", async (e) => {
        e.stopPropagation();
        const workId = newWork.id;
        const success = await deleteWork(workId);

        if (success) {
          const figureToRemove = document.querySelector(
            `[data-work-id="${workId}"]`
          );
          if (figureToRemove) {
            figureToRemove.remove();
          }
        }
      });

      modalFigure.appendChild(deleteIcon);
      modalFigure.appendChild(modalImg);
      modalFigure.appendChild(deleteIcon);

      modalPhoto.appendChild(modalFigure);

      //****Réinitialiser le formulaire****//
      resetAddWorksModal();
      modalAddWorks.style.display = "none";
      modalGalleryDisplay.style.display = "flex";
    }
  });

  // ****Appel de la fonction pour charger les catégories au chargement du DOM***//
  loadCategoriesIntoSelect();
});

//****Réinitialisation du formulaire AddWorks****//
function resetAddWorksModal() {
  formAddWorks.reset(); // Réinitialiser le formulaire
  previewImage.src = "#"; // Réinitialiser l'aperçu de l'image
  previewImage.style.display = "none"; // Cacher l'aperçu de l'image
}

// Fonction pour ajouter un travail
async function addWork(formData) {
  const userToken = window.sessionStorage.getItem("token");

  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
      body: formData,
    });

    if (response.ok) {
      const newWork = await response.json();
      return newWork;
    } else {
      console.error(
        "Erreur lors de l'ajout du travail :",
        response.status,
        response.statusText
      );
      return null;
    }
  } catch (error) {
    console.error("Erreur lors de l'ajout du travail :", error);
    return null;
  }
}

// Chargement des catégories depuis l'API et remplissage du select
async function loadCategoriesIntoSelect() {
  try {
    const categories = await fetchCategory();

    // Option par défaut vide
    const defaultOption = document.createElement("option");
    defaultOption.value = ""; // Valeur vide
    defaultOption.textContent = ""; // Texte par défaut
    inputCategory.appendChild(defaultOption);

    // Remplissage des autres options de catégorie
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.id; // Utilise l'ID ou un autre identifiant unique de la catégorie
      option.textContent = category.name; // Affiche le nom de la catégorie
      inputCategory.appendChild(option);
    });
  } catch (error) {
    console.error("Erreur lors du chargement des catégories :", error);
  }
}

// Fonction pour récupérer les catégories depuis l'API
async function fetchCategory() {
  const requete = await fetch("http://localhost:5678/api/categories");
  return requete.json();
}

// Vérification de la connexion utilisateur et gestion de l'affichage
document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const modifModalSpan = document.getElementById("modifModalSpan");

  // Vérification de l'état de connexion de l'utilisateur
  const userToken = window.sessionStorage.getItem("token");

  if (userToken) {
    loginBtn.style.display = "none";
    logoutBtn.style.display = "block";
    modifModalSpan.style.display = "inline";
  } else {
    loginBtn.style.display = "block";
    logoutBtn.style.display = "none";
    modifModalSpan.style.display = "none";
  }

  //****Déconnexion de l'utilisateur******//
  logoutBtn.addEventListener("click", () => {
    window.sessionStorage.removeItem("token");
    window.sessionStorage.removeItem("userId");
    window.location.href = "login.html";
  });

  // Affichage du mode édition si l'utilisateur est connecté
  const token = window.sessionStorage.getItem("token");
  if (token) {
    const banner = document.createElement("div");
    banner.classList.add("banner");
    banner.textContent = " Mode édition";
    document.body.appendChild(banner);
  }
});
