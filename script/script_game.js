const card = document.getElementById("card_template");
const main_container = document.getElementById("main_container");
const settings = JSON.parse(sessionStorage.getItem("settings"));
const players_amount = settings.players;
for(let i = 0; i < players_amount; i++) {
    let clone = card.content.cloneNode(true);
    main_container.appendChild(clone);
}