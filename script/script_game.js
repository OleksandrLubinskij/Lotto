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

    static generate_card_col(card_col, min_cell_num, max_cell_num, num_in_col) {
        let banned_nums = [];
        card_col = Game.fill_arr(card_col);
                for(let k = 0; k < num_in_col; k++) {//цикл який де додаються цифри
                    let cell_num = Game.random(min_cell_num, max_cell_num);
                    if(!banned_nums.includes(cell_num))
                        {card_col[k] = cell_num;
                        banned_nums.push(cell_num);
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
            let differ = sum_amount - max_amount_in_card;

            for (let i = 0; differ >= 0 && i < amounts.length; i++) {
                if (amounts[i] === 2) {
                    console.log(`amount before ${amounts[i]}`);
                    amounts[i]--;
                    console.log(`amount after ${amounts[i]}`);

                    differ--;
                }
            }
        } 
        else if (sum_amount < max_amount_in_card) {
            let differ = max_amount_in_card - sum_amount;

            for (let i = 0; differ >= 0 && i < amounts.length; i++) {
                if (amounts[i] === 1) {
                    console.log(`amount before ${amounts[i]}`);
                    amounts[i]++;
                    console.log(`amount after ${amounts[i]}`);
                    differ--;
                }
            }
        }
        return amounts;
    }


    generate_cards() {
    let max_amount_in_card = 15;
    for(let i = 0; i < this.players_amount; i++) { // цикл по гравцях
        let min_cell_num = 1;
        let max_cell_num = 9;

        // 🔹 Генеруємо розподіл один раз для всієї карти
        let amounts = Game.amount_of_num_in_col(max_amount_in_card);

        for(let j = 0; j < 9; j++) { // цикл по стовпцях
            let card_col = [];
            card_col = Game.generate_card_col(card_col, min_cell_num, max_cell_num, amounts[j]);
            card_col = Game.fix_card_col(card_col);
            console.log(card_col);
            this.players[i].player_card.push(card_col);
            min_cell_num += 10;
            max_cell_num += 10;
        }
        console.log(this.players[i].player_card);
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