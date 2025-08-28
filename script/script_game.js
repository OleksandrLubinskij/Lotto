const card = document.getElementById("card_template");
const main_container = document.getElementById("main_container");
for(let i = 0; i < 4; i++) {
    let clone = card.content.cloneNode(true);
    main_container.appendChild(clone);
}