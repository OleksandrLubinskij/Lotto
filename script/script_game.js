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

    static fill_arr(arr) {
        for(let i = 0; i < 3; i++) {
            arr.push(0);
        }
        return arr;
    }

    static shuffle_arr(arr) {
        if (arr.length <= 1) return arr;
        let new_position = this.random(1, 2);
        [arr[1], arr[new_position]] = [arr[new_position], arr[1]];
        return arr;
    }
    
    static arrange_col(arr) {
        if(arr.length == 1 || arr[0] < arr[1]) return arr;
        else {
            let flag = arr[0];
            arr[0] = arr[1];
            arr[1] = flag;
            return arr;
        }
    }

    static fix_card_col(arr) {
        let arranged_arr = Game.arrange_col(arr);
        return Game.shuffle_arr(arranged_arr);
    }

    static generate_card_col(card_col, num_in_col, min_cell_num, max_cell_num) {
        let banned_nums = [];
        card_col = Game.fill_arr(card_col);
                for(let k = 0; k < num_in_col; k++) {//цикл який де додаються цифри
                    let cell_num = Game.random(min_cell_num, max_cell_num);
                    if(!(cell_num in banned_nums))
                        {card_col[k] = cell_num;
                        banned_nums.push(cell_num);
                    }
                }
        return card_col;
    }

    generate_cards() {
        let max_amount_in_card = 15;
        for(let i = 0; i < this.players_amount; i++) {//цикл який перебирає гравців
            let min_cell_num = 1;
            let max_cell_num = 9;
            for(let j = 0; j < 9; j++) {//цикл який перебирає стовпці у карті
                let num_in_col = Game.random(1, 2);
                let card_col = [];
                card_col = Game.generate_card_col(card_col, num_in_col, min_cell_num, max_cell_num);
                card_col = Game.fix_card_col(card_col);
                console.log(card_col);
                this.players[i].player_card = this.players[i].player_card.concat(card_col);
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