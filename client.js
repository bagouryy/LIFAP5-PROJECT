/* 
- on minimise le code impératif. L'affectation sur les éléments HTML (e.g. `onclick`, `innerHTML`) et sur les champs de l'objet état est autorisée. 
Le reste du code doit être dans le style fonctionnel (utilisez des `const` et interdisez-vous au maximum de changer le contenu d'un tableau par affectation, utilisez map, filter, etc)
- PAS de variable globale: si vous avez envie d'une information globale, il faut la placer dans l'état
- faire des fonctions *courtes*: pas plus de 20 lignes, sinon, il faut les redécouper en fonctions plus petites
- commentez vos fonctions, avant d'écrire le corps de la fonction
- tester toutes les fonctions de calcul (e.g. une fonction de filtre doit être testée). Vérifiez régulièrement dans le navigateur l'aspect du rendu pour les fonctions qui génère le HTML et qu'on ne peut pas facilment tester autrement.*/
/* ******************************************************************
 * Constantes de configuration
 */
const apiKey = "5f3e25f3-48fe-4a68-900d-2ccbe3e1d7a1";
const serverUrl = "http://lifap5.univ-lyon1.fr/";

/* ******************************************************************
 * Gestion des tabs "Voter" et "Toutes les citations"
 ******************************************************************** */

/**
 * Affiche/masque les divs "div-duel", "div-tout", "div-add"
 * selon le tab indiqué dans l'état courant.
 *
 * @param {Etat} etatCourant l'état courant
 */
function majTab(etatCourant) {
    console.log("CALL majTab");
    const dDuel = document.getElementById("div-duel");
    const dTout = document.getElementById("div-tout");
    const tDuel = document.getElementById("tab-duel");
    const tTout = document.getElementById("tab-tout");
    const tAdd = document.getElementById("tab-add");
    const dAdd = document.getElementById("div-add");

    if (etatCourant.tab === "duel") {
        dDuel.style.display = "flex";
        tDuel.classList.add("is-active");
        dTout.style.display = "none";
        tTout.classList.remove("is-active");
        tAdd.classList.remove("is-active");

    } else {
        dTout.style.display = "flex";
        tTout.classList.add("is-active");
        dDuel.style.display = "none";
        tDuel.classList.remove("is-active");
        tAdd.classList.remove("is-active");
    }
    document.getElementById("tab-add").onclick = () =>
        majAddTab();
}

/**
 * Mets au besoin à jour l'état courant lors d'un click sur un tab.
 * En cas de mise à jour, déclenche une mise à jour de la page.
 *
 * @param {String} tab le nom du tab qui a été cliqué
 * @param {Etat} etatCourant l'état courant
 */
function clickTab(tab, etatCourant) {
    console.log(`CALL clickTab(${tab},...)`);
    if (etatCourant.tab !== tab) {
        etatCourant.tab = tab;
        majPage(etatCourant);
    }
}

/**
 * Enregistre les fonctions à utiliser lorsque l'on clique
 * sur un des tabs.
 *
 * @param {Etat} etatCourant l'état courant
 */
function registerTabClick(etatCourant) {
    console.log("CALL registerTabClick");
    document.getElementById("tab-duel").onclick = () =>
        clickTab("duel", etatCourant);
    document.getElementById("tab-tout").onclick = () =>
        clickTab("tout", etatCourant);
}

/* ******************************************************************
 * Gestion de la boîte de dialogue (a.k.a. modal) d'affichage de
 * l'utilisateur.
 * ****************************************************************** */

/**
 * Fait une requête GET authentifiée sur /whoami
 * @returns une promesse du login utilisateur ou du message d'erreur
 */
function fetchWhoami() {
    return fetch(serverUrl + "whoami", { headers: { "x-api-key": apiKey } })
        .then((response) => response.json())
}

/**
 * Gère l'affichage du tab Détails de citation
 */

function majAddTab() {

    const dAdd = document.getElementById("div-add");
    const tAdd = document.getElementById("tab-add");
    const dDuel = document.getElementById("div-duel");
    const dTout = document.getElementById("div-tout");
    const tDuel = document.getElementById("tab-duel");
    const tTout = document.getElementById("tab-tout");

    dAdd.style.display = "flex";
    tAdd.classList.add("is-active");
    dTout.style.display = "none";
    tTout.classList.remove("is-active");
    dDuel.style.display = "none";
    tDuel.classList.remove("is-active");

}
/**
 * Affiche ou masque la fenêtre modale de login en fonction de l'état courant.
 *
 * @param {Etat} etatCourant l'état courant
 */
function majModalLogin(etatCourant) {
    const modalClasses = document.getElementById("mdl-login").classList;
    if (etatCourant.loginModal) {
        modalClasses.add("is-active");
        //lanceWhoamiEtInsereLogin();
    } else {
        modalClasses.remove("is-active");
    }
}

/**
 * Déclenche l'affichage de la boîte de dialogue du nom de l'utilisateur.
 * @param {Etat} etatCourant
 */
function clickFermeModalLogin(etatCourant) {
    etatCourant.loginModal = false;
    majPage(etatCourant);
}

/**
 * Déclenche la fermeture de la boîte de dialogue du nom de l'utilisateur.
 * @param {Etat} etatCourant
 */
function clickOuvreModalLogin(etatCourant) {
    etatCourant.loginModal = true;
    majPage(etatCourant);
}

/**
 * Enregistre les actions à effectuer lors d'un click sur les boutons
 * d'ouverture/fermeture de la boîte de dialogue affichant l'utilisateur.
 * @param {Etat} etatCourant
 */
function registerLoginModalClick(etatCourant) {
    document.getElementById("btn-close-login-modal1").onclick = () =>
        clickFermeModalLogin(etatCourant);
    document.getElementById("btn-close-login-modal2").onclick = () =>
        clickFermeModalLogin(etatCourant);
    document.getElementById("btn-open-login-modal").onclick = () =>
        clickOuvreModalLogin(etatCourant);
}

/* ******************************************************************
 * Initialisation de la page et fonction de mise à jour
 * globale de la page.
 * ****************************************************************** */

/**
 * Mets à jour la page (contenu et événements) en fonction d'un nouvel état.
 *
 * @param {Etat} etatCourant l'état courant
 */
function majPage(etatCourant) {
    console.log("CALL majPage");
    majTab(etatCourant);
    majModalLogin(etatCourant);
    registerTabClick(etatCourant);
    registerLoginModalClick(etatCourant);
}

/**
 * Appelé après le chargement de la page.
 * Met en place la mécanique de gestion des événements
 * en lançant la mise à jour de la page à partir d'un état initial.
 */
function initClientCitations() {
    console.log("CALL initClientCitations");
    const etatInitial = {
        tab: "duel",
        loginModal: false,
    };
    majPage(etatInitial);
}

// Appel de la fonction init_client_duels au après chargement de la page
document.addEventListener("DOMContentLoaded", () => {
    console.log("Exécution du code après chargement de la page");
    initClientCitations();
    insertCitations();
    afficheDuels();
});


/**
 * Récupere toutes les citations du serveur 
 * en utilisant fetch et les formattent avec JSON
 * @returns la complèteliste complète des citations.
 */
function fetchCitations() {

    return fetch(serverUrl + "citations", {
            method: 'GET',
            headers: { "x-api-key": apiKey }
        })
        .then((response) => response.json())
}

/**
 * Crée le tableau HTML.
 * @param data promesse retourné par fetchCitations().
 * @returns la liste complète des citations.
 */
function fillTable(data) {

    var tabBody = ``;
    var classement = 0;

    if (data.length > 0) {
        data.forEach((u) => {
            tabBody += `<tr>`;
            tabBody += `<td>` + ++classement + `</td>`;
            tabBody += `<td>` + u.character + `</td>`;
            tabBody += `<td id=${u._id} onclick=\"afficheDetails(this.id)\">`;
            tabBody += u.quote + `</td></tr>`;
        })
        document.getElementById("data").innerHTML = tabBody;
    }
}

/**
 * Utilise fetchCitations() pour récuperer les citations
 * puis les insère dans le tableau avec fillTable().
 */
function insertCitations() {

    console.log("CALL insertCitations");
    fetchCitations().then(data => fillTable(data));

}

/**
 * Met en place le duel à gauche en insérent dans l'HTML.
 * @param data promesse retourné par fetchCitations().
 */
function setDuelLeft(data) {

    const pic1 = document.getElementById("pic1");
    const quote1 = document.getElementById("quote1");
    const char1 = document.getElementById("author1");
    const x = Math.floor(Math.random() * data.length);

    quote1.innerHTML = data[x].quote;
    char1.innerHTML = data[x].character + " dans " + data[x].origin;
    pic1.setAttribute("src", data[x].image);
    if (data[x].characterDirection == "Right") {
        pic1.setAttribute("style", "transform: scaleX(-1)");
    }
}

/**
 * Met en place le duel à droite en insérent dans l'HTML.
 * @param data promesse retourné par fetchCitations().
 */
function setDuelRight(data) {

    const pic1 = document.getElementById("pic2");
    const quote1 = document.getElementById("quote2");
    const char1 = document.getElementById("author2");
    const x = Math.floor(Math.random() * data.length);

    quote1.innerHTML = data[x].quote;
    char1.innerHTML = data[x].character + " dans " + data[x].origin;
    pic1.setAttribute("src", data[x].image);
    if (data[x].characterDirection == "Left") {
        pic1.setAttribute("style", "transform: scaleX(-1)");
    }
}
/**
 * Affiche les duels créent par setDuelRight() et setDuelLeft
 * @param data promesse retourné par fetchCitations().
 */
function afficheDuels() {

    console.log("CALL afficheDuels");
    fetchCitations().then(data => {

            if (data.length > 0) {
                setDuelLeft(data);
                setDuelRight(data);
            }
        })
        .catch((erreur) => ({ err: erreur }));
}

/**
 * Fait une requête GET authentifiée sur /whoami avec la apiKey saisie.
 * Change l'affichage du bouton Utilisateur pour afficher le numéro étudiant.
 * Ajoute un bouton Déconnexion.
 */
function verifyLogin() {

    console.log("CALL verifyLogin");
    const key = document.getElementById("KEY");
    const buttonConn = document.getElementById("connexion");
    const navButton = document.getElementById("btn-open-login-modal");
    const loginModalBody = document.getElementById("elt-affichage-login");

    fetchWhoami().then(data => {

            navButton.innerHTML = data.login;
            loginModalBody.innerHTML = "User: " + data.login;
            buttonConn.innerHTML = "Deconnexion";
            buttonConn.setAttribute("class", "button is-danger");
            buttonConn.setAttribute("id", "disconnect");
            key.remove();
            modalClose("mdl-login");
            navButton.setAttribute("class", "button is-primary is-rounded");
            console.log("Logged in as " + data.login);
        })
        .catch(err => (console.log(err)));
}


/**
 * Récupére les details de chaque citation cliqué dans un modal
 * en utilisant la route /citation/{citation_id} 
 * @param cId Id de la citation.
 */
function fetchCId(cId) {

    console.log("CALL fetchCId");
    const citationID = document.getElementById(cId).id;

    return fetch(serverUrl + "citations/" + citationID, {
            method: 'GET',
            headers: { "x-api-key": apiKey }
        })
        .then(response => response.json())
}
/**
 * Affiche les details de chaque citation cliqué dans un modal
 * en utilisant la route /citation/{citation_id} 
 * fourni par fetchCId().
 * @param cId Id de la citation.
 */
function afficheDetails(cId) {

    console.log("CALL afficheDetails");
    fetchCId(cId).then(data => {

        console.log(data + "here");
        const imageC = document.getElementById("imageC");
        document.getElementById("quoteC").innerHTML = data.quote;
        document.getElementById("characterC").innerHTML = data.character;
        imageC.setAttribute("src", data.image);
        document.getElementById("originC").innerHTML = data.origin;
        console.log("INSERTED SUCESSFULLY")

    })
}

/** 
 * Ouvre le modal passé en paramètre.
 * @param element ID du modal
 */

function modalOpen(element) {

    console.log("modalOpen: " + element);
    document.getElementById(element).classList.add('is-active');

}

/** 
 * Ferme le modal passé en paramètre.
 * @param element ID du modal
 */

function modalClose(element) {

    console.log("modalClose: " + element);
    document.getElementById(element).classList.remove('is-active');

}