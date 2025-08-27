const amounts = document.querySelectorAll(".amount");
let players_amount = 0;
const settings = '';
amounts.forEach(a => {
    a.addEventListener('click', event => {
        event.preventDefault();
        players_amount = a.innerText;
        settings = {gamemode:'Friends',
                    players: players_amount
                };
        sessionStorage.clear();
        sessionStorage.setItem("settings", JSON.stringify(settings));
    })
})