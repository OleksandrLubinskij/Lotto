const card = document.getElementById("card_template");
const main_container = document.getElementById("main_container");
const settings = JSON.parse(sessionStorage.getItem("settings"));
const players_amount = settings.players;
for(let i = 0; i < players_amount; i++) {
    let clone = card.content.cloneNode(true);
    main_container.appendChild(clone);
}

class Game {
    constructor(players_amount) {
        this.players_amount = players_amount;
        this.players = [];
        for(let i = 0; i < players_amount; i++) {
            let player = new Player(`Гравець ${i+1}`);
            this.players.push(player)
        }
    }

    static random(min_num, max_num) {
        return Math.floor(Math.random() * (max_num - min_num + 1)) + min_num;
    }
    static shuffle_arr(arr) {
        if (arr.length <= 1) return arr;
        let new_position = this.random(1, 2);
        [arr[1], arr[new_position]] = [arr[new_position], arr[1]];
        return arr;
    }
    static fill_arr(arr) {
        for(let i = 0; i < 3; i++) {
            arr.push(0);
        }
        return arr;
    }

    generate_cards() {
        let p_card = [];
        let max_amount_in_card = 15;
        
        for(let i = 0; i < this.players_amount; i++) {
            let min_cell_num = 1;
            let max_cell_num = 9;
            for(let j = 0; j < 9; j++) {
                let num_in_col = Game.random(1, 2);
                let card_col = [];
                card_col = Game.fill_arr(card_col);
                for(let k = 0; k < num_in_col; k++) {
                    let cell_num = Game.random(min_cell_num, max_cell_num);
                    console.log(`Cell_num - ${cell_num}`)
                    card_col[k] = cell_num;
                }
                card_col = Game.shuffle_arr(card_col);
                p_card = this.players[i].player_card;
                p_card.push(card_col);
                console.log(`${min_cell_num} - ${max_cell_num}`);
                min_cell_num += 10;
                max_cell_num += 10;
            }
        }
    }
}

class Player {
    constructor(name) {
        this.player_name = name;
        this.player_card = [];
    }
}

let game = new Game(players_amount);

game.generate_cards();
console.log(game.players);