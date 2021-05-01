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
 * Affiche/masque les divs "div-duel" et "div-tout" 
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
    if (etatCourant.tab === "duel") {
        dDuel.style.display = "flex";
        tDuel.classList.add("is-active");
        dTout.style.display = "none";
        tTout.classList.remove("is-active");
    } else {
        dTout.style.display = "flex";
        tTout.classList.add("is-active");
        dDuel.style.display = "none";
        tDuel.classList.remove("is-active");
    }
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
        .then((data) => console.log(data))
        .then((jsonData) => {
            if (jsonData.status && Number(jsonData.status) != 200) {
                return { err: jsonData.message };
            }
            return jsonData;
        })
        .catch((erreur) => ({ err: erreur }));
}

/**
 * Fait une requête sur le serveur et insère le login dans
 * la modale d'affichage de l'utilisateur.
 * @returns Une promesse de mise à jour

function lanceWhoamiEtInsereLogin() {
    return fetchWhoami().then((data) => {
        const elt = document.getElementById("elt-affichage-login");
        const ok = data.err === undefined;
        if (!ok) {
            elt.innerHTML = `<span class="is-error">${data.err}</span>`;
        } else {
            elt.innerHTML = `Bonjour ${data.login}.`;
        }
        return ok;
    });
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
        lanceWhoamiEtInsereLogin();
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
});


// Récupère la liste de toutes les citations sur le serveur en utilisant fetch
/* il faudra générer dynamiquement le tableau HTML.
 Par exemple avec un `.map` qui va transformer chaque citation en string contenant la ligne du tableau HTML, 
 puis en utilisant `join("")` pour assembler toutes les chaînes en une seule */

fetch("https://lifap5.univ-lyon1.fr/citations", { method: 'GET', headers: { "x-api-key": apiKey } })
    .then((response) => response.json())
    .then(data => {

        console.log(data)
        if (data.length > 0) {

            var temp = "";
            var classement = 0;

            data.forEach((u) => {

                temp += "<tr>";
                temp += "<td>" + ++classement + "</td>";
                temp += "<td>" + u.character + "</td>";
                temp += "<td id=\"test\"> " + u._id + " </td>";
                temp += "<td id=\"baba\" onclick=\"afficheDetails()\">" + u.quote + "</td></tr>";




            })

            document.getElementById("data").innerHTML = temp;



        }
    })
    .catch((erreur) => ({ err: erreur }));


// Affichage d’un duel aléatoire sur le tab Voter

fetch("https://lifap5.univ-lyon1.fr/citations", {
        method: 'GET',
        headers: { "x-api-key": apiKey }
    })
    .then((response) => response.json())
    .then(data => {

        console.log(data)
        if (data.length > 0) {

            var x = Math.floor(Math.random() * data.length);
            var y = Math.floor(Math.random() * data.length);

            var pic1 = document.getElementById("pic1");
            var pic2 = document.getElementById("pic2");



            document.getElementById("quote1").innerHTML = data[x].quote;
            document.getElementById("quote2").innerHTML = data[y].quote;
            document.getElementById("author1").innerHTML = data[x].character + "dans" + data[x].origin;
            document.getElementById("author2").innerHTML = data[y].character + "dans" + data[y].origin;

            pic1.setAttribute("src", data[x].image);
            if (data[x].characterDirection == "Right") {

                pic1.setAttribute("style", "transform: scaleX(-1)");
            }
            pic2.setAttribute("src", data[y].image);
            if (data[y].characterDirection == "Left") {

                pic2.setAttribute("style", "transform: scaleX(-1)");
            }


        }
    })
    .catch((erreur) => ({ err: erreur }));



/*
    return fetchWhoami()
        .then((response) => {



            }


        } 

    function test() {


    } 
*/

function verifyLogin() {

    const key = document.getElementById("KEY").value;
    const buttonConn = document.getElementById("connexion");
    const navButton = document.getElementById("btn-open-login-modal");

    return fetch("https://lifap5.univ-lyon1.fr/whoami", { method: 'GET', headers: { "x-api-key": key } })
        .then((response) => response.json())
        .then(data => {

            console.log(data)
            document.getElementById("btn-open-login-modal").innerHTML = data.login;
            document.getElementById("elt-affichage-login").innerHTML = "User: " + data.login;
            document.getElementById("connexion").innerHTML = "Deconnexion";
            buttonConn.setAttribute("class", "button is-danger");
            document.getElementById("KEY").remove();
            modalClose("mdl-login");
            navButton.setAttribute("class", "button is-primary is-rounded");


        })
        .catch(err => (console.log(err)));

}

function disconnButton() {

    // onclick disconnect on "Deconnexion"





}



/* 
fetch("https://lifap5.univ-lyon1.fr/citations/duels", { method: 'POST', headers: { "x-api-key": apiKey } })
    .then((response) => response.json())
    .then(data => {

        console.log(data)
        console.log("hi")
    }); */




// Affiche details de chaque citations sur un modal avec Hover

function afficheDetails() {


    // find how to get citationID with every hover = onmouseover
    console.log("im here");
    const citationID = document.getElementById("test").innerText;
    console.log(citationID);



    return fetch("https://lifap5.univ-lyon1.fr/citations/" + citationID, { method: 'GET', headers: { "x-api-key": apiKey } })
        .then(response => response.json())
        .then(data => {


            // affiche all except ID and Scores

            console.log(data);
            const imageC = document.getElementById("imageC");

            document.getElementById("quoteC").innerHTML = data.quote;
            document.getElementById("characterC").innerHTML = data.character;
            imageC.setAttribute("src", data.image);
            document.getElementById("originC").innerHTML = data.origin;
            document.getElementById().innerHTML = data.characterDirection;
            document.getElementById().innerHTML = data.addedBy;
        })



}

// tri du tableau

function sortTab() {



}


function modalOpen(element) {

    console.log("modalOpen: " + element);
    document.getElementById(element).classList.add('is-active');


}

function modalClose(element) {

    console.log("modalClose: " + element);
    document.getElementById(element).classList.remove('is-active');


}