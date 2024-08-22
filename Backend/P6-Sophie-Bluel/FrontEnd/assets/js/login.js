//****Variables*/
const form = document.querySelector("form");
const email = document.getElementById("email");
const password = document.getElementById("password");

//*****reprise via inputs email et mots de passe*****//

form.addEventListener("submit", (e) => {
  e.preventDefault(); //Empêche l'envoi traditionnel du formulaire
  // Reste du code de gestion de la soumission du formulaire...
  const userEmail = email.value;
  const userPassword = password.value;
  const login = {
    email: userEmail,
    password: userPassword,
  };
  const user = JSON.stringify(login);

  //****requête****//
  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    mode: "cors",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: user,
  })
    //****Réponse BD****//
    .then((response) => {
      if (!response.ok) {
        email.style.border = "2px solid #FF0000";
        password.style.border = "2px solid #FF0000";
        const errorLogin = document.querySelector("p");
        errorLogin.textContent = "E.mail ou Mot de passe incorrect";
        throw new Error("E.mail ou Mot de passe incorrect");
      }
      return response.json();
    })
    .then((data) => {
      //Récupération des données de la réponse (comme le token et l'ID de l'utilisateur)
      const userId = data.userId;
      const userToken = data.token;
      window.sessionStorage.setItem("token", userToken);
      window.sessionStorage.setItem("userId", userId);
      window.location.href = "index.html";
    })
    .catch((error) => {
      console.error("Une erreur est survenue : ", error);
    });
});
