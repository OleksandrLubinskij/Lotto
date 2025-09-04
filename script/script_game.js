const settings = JSON.parse(sessionStorage.getItem("settings"));
const players_amount = settings.players;

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

    static fill_arr() {
        return new Array(3).fill(0);
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

    static generate_card_col(card_col, min_cell_num, max_cell_num, num_in_col) {
        let banned_nums = [];
        card_col = Game.fill_arr();

        let k = 0;
        while (k < num_in_col) {
            let cell_num = Game.random(min_cell_num, max_cell_num);
            if (!banned_nums.includes(cell_num)) {
                card_col[k] = cell_num;
                banned_nums.push(cell_num);
                k++;
            }
        }

        return card_col;
    }


    static amount_of_num_in_col(max_amount_in_card) {
        let amounts = [];
        for (let i = 0; i < 9; i++) {
            let nums_in_col = Game.random(1, 2);
            amounts.push(nums_in_col);
        }

        let sum_amount = amounts.reduce((a, b) => a + b, 0);

        if (sum_amount > max_amount_in_card) {

            for (let i = 0; sum_amount > max_amount_in_card && i < amounts.length; i++) {
                if (amounts[i] === 2) {
                    amounts[i]--;
                    sum_amount--;
                }
            }
        } 
        else if (sum_amount < max_amount_in_card) {
            for (let i = 0; sum_amount < max_amount_in_card && i < amounts.length; i++) {
                if (amounts[i] === 1) {
                    amounts[i]++;
                    sum_amount++;
                }
            }
        }
        return amounts;
    }


    generate_cards() {
    let max_amount_in_card = 15;
    for(let i = 0; i < this.players_amount; i++) { 
        let min_cell_num = 1;
        let max_cell_num = 9;

        let amounts = Game.amount_of_num_in_col(max_amount_in_card);

        for(let j = 0; j < 9; j++) {
            let card_col = [];
            card_col = Game.generate_card_col(card_col, min_cell_num, max_cell_num, amounts[j]);
            card_col = Game.fix_card_col(card_col);
            this.players[i].player_card.push(card_col);
            min_cell_num += 10;
            max_cell_num += 10;
        }
    }
    }

    fill_card_by_nums() {
        this.players.forEach((player, index) => {
            player.render_card("main_container", index);
        })
    }


}
class Player {
    constructor(name) {
        this.player_name = name;
        this.player_card = [];
    }

    render_card(containerId, player_index) {
        const template = document.getElementById("card_template");
        const container = document.getElementById(containerId);

        // Клонуємо шаблон
        const clone = template.content.cloneNode(true);
        clone.querySelector('.card').dataset.player_index = player_index;
        // Заповнюємо клітинки
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 9; col++) {
                let value = this.player_card[col][row];
                if (value !== 0) {
                    clone.querySelector(`.r${row}c${col}`).textContent = value;
                }
            }
        }

        container.appendChild(clone);
    }
}

let game = new Game(players_amount);
game.generate_cards();
game.fill_card_by_nums();