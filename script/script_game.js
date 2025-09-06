const settings = JSON.parse(sessionStorage.getItem("settings"));
const players_amount = settings.players;

class Game {
    constructor(players_amount) {
        this.players_amount = players_amount;
        this.players = [];
        for(let i = 0; i < players_amount; i++) {
            let player = new Player(`Гравець ${i+1}`, this);
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

    get_players() {
        return this.players;
    }
}
class Player {
    constructor(name, gameInstance) {
        this.player_name = name;
        this.player_card = [];
        this.players = gameInstance.get_players();
    }

    static get_card(index = null) {
    if (index === null) {
        // Беремо шаблон
        const template = document.getElementById("card_template");
        return template.content.cloneNode(true);
    } else {
        return document.querySelector(`.card[data-player_index='${index}']`);
    }
}

    render_card(containerId, player_index) {
        const clone = Player.get_card();
        const container = document.getElementById(containerId);
        const name_tag = clone.querySelector("#name");
        name_tag.textContent = this.player_name;
        clone.querySelector('.card').dataset.player_index = player_index;
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

take_turn() {
    let barrel_num = Game.random(1, 90);
    const barrel_block = document.querySelector('#num_from_barrel');
    const barrel_msg = document.querySelector('#message');
    barrel_block.textContent = barrel_num;

    let lucky_players = [];

    this.players.forEach((player, index) => {
        if (player.player_card.some(col => col.includes(barrel_num))) {
            lucky_players.push(index + 1);
        }
    });

    if (lucky_players.length > 0) {
        barrel_msg.textContent = `Гравцям пощастило: ${lucky_players.join(', ')}`;
        
    } else {
        barrel_msg.textContent = "На жаль, не пощастило";
    }
}



}

let game = new Game(players_amount);
game.generate_cards();
game.fill_card_by_nums();


function Play(game) {
    let turn = 0;
    let players = game.get_players();
        const take_barrel_btn = document.querySelector("#barrel");
        take_barrel_btn.addEventListener('click', function() {
            players[turn].take_turn();
            const prev_index = (turn > 0) ? turn - 1 : players_amount - 1;
            const prev_clone = Player.get_card(prev_index);
            const curr_clone = Player.get_card(turn);

            let cur_table = curr_clone.querySelector('table');
            let cur_td = curr_clone.querySelectorAll('td');
            let cur_name_tag = curr_clone.querySelector('#name');
            let prev_table = prev_clone.querySelector('table');
            let prev_td = prev_clone.querySelectorAll('td');
            let prev_name_tag = prev_clone.querySelector('#name');

            cur_table.style.borderColor = 'rgb(209, 209, 90)';
            cur_td.forEach(element => {
                element.style.borderColor = 'rgb(209, 209, 90)';
            })
            cur_name_tag.style.color = 'rgb(209, 209, 90)';
            prev_table.style.borderColor = 'rgb(240, 248, 255)';
            prev_td.forEach(element => {
                element.style.borderColor = 'rgb(240, 248, 255)';
            })
            prev_name_tag.style.color = 'rgb(240, 248, 255)';

            turn++;
            if(turn == players_amount) turn = 0;
        } )
    }
Play(game);