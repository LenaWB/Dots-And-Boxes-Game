import R from "./common/ramda.js";
import DotsAndBoxes from "../common/DotsAndBoxes.js";

const dot_rows = 3;
const dot_columns = 3;
const grid_rows = (2*dot_rows) - 1;
const grid_columns = (2*dot_columns) - 1;

let board_array = DotsAndBoxes.starting_board(dot_columns, dot_rows);

document.documentElement.style.setProperty("--grid-rows", grid_rows);
document.documentElement.style.setProperty("--grid-columns", grid_columns);

const grid = document.getElementById("grid");
const coordinates = document.getElementById("coordinates");
const player1 = document.getElementById("player 1");
const player2 = document.getElementById("player 2");
const boxes_left = document.getElementById("boxes left");
const max_boxes = document.getElementById("total boxes");
const winner = document.getElementById("winning player");
const player_ply = document.getElementById("player no");
const footer = document.getElementById("footer");
const result_dialog = document.getElementById("result_dialog");
const result = document.getElementById("result_winner");
const restart_button1 = document.getElementById("restart1");
const restart_button2 = document.getElementById("restart2");
const instructions_button = document.getElementById("instructions button");
const instructions = document.getElementById("instructions");
const exit_button1 = document.getElementById("exit1");
const exit_button2 = document.getElementById("exit2");

const board = R.range(0, grid_rows).map(function (row_index) {
    const row = document.createElement("div");
    row.className = "row";

    const rows = R.range(0, grid_columns).map(function (column_index) {
        const cell = document.createElement("div");
        cell.className = "cell";

        row.append(cell);
        return cell;
    });
    grid.append(row);
    return rows;
});

const draw_board = function (board_array, board) {
    board.forEach(function (row, row_index) {
        row.forEach(function (cell, column_index) {

            const array_element = board_array[row_index][column_index];
            cell.removeAttribute("class");
            cell.classList.add("cell");

            if (array_element === ".") {
                cell.classList.add("dot");
            }
            if (array_element === "X") {
                cell.classList.add("box");
            }
            if (array_element === 1) {
                cell.classList.add("player1");
            }
            if (array_element === 2) {
                cell.classList.add("player2");
            }
            if (array_element === 0) {
                cell.classList.add("line");
            }
            if (array_element === "/") {
                cell.classList.add("line");
                cell.classList.add("on");
            }
        });
    });
};

const play = function () {
    let click_count = 0;
    let current_player = 1;
    board.forEach(function (row, row_index) {
        row.forEach(function (cell, column_index) {
            cell.onclick = function () {
                if (click_count % 2 === 0) {
                    current_player = 1;
                } else {
                    current_player = 2;
                }
                click_count = click_count + 1;
                coordinates.textContent = `(${row_index}, ${column_index})`;
                // board_array = DotsAndBoxes.play_for_player(player, row_index, column_index, board_array);
                board_array = DotsAndBoxes.place_line(row_index, column_index, board_array);
                if (DotsAndBoxes.is_new_box_created_on_board(board_array) === true) {
                    click_count = click_count - 1;
                }
                board_array = DotsAndBoxes.close_box(current_player,DotsAndBoxes.new_boxes_created(board_array), board_array);
                draw_board(board_array, board);
                const p1_count = DotsAndBoxes.how_many_char_in_board (1, board_array);
                const p2_count = DotsAndBoxes.how_many_char_in_board (2, board_array);
                player1.textContent = p1_count;
                player2.textContent = p2_count;
                boxes_left.textContent = DotsAndBoxes.boxes_left(board_array);
                winner.textContent = DotsAndBoxes.who_is_winning(p1_count, p2_count);
                if (DotsAndBoxes.is_ended(board_array)) {
                    if (DotsAndBoxes.who_is_winning(p1_count, p2_count)=== 1){
                        result.textContent = "PLAYER 1 WINS!!";
                    } else if (DotsAndBoxes.who_is_winning(p1_count, p2_count)=== 2) {
                        result.textContent = "PLAYER 2 WINS!!";
                    } else {
                        result.textContent = "DRAW";
                    }
                    result_dialog.showModal();
                    restart_button2.onclick = function () {
                        result_dialog.close();
                        restart();
                    };
                    exit_button2.onclick = function () {
                        result_dialog.close();
                    };
                }
                footer.removeAttribute("class");
                if (click_count % 2 === 0) {
                    footer.classList.add("player1");
                    player_ply.textContent = 1;
                } else {
                    footer.classList.add("player2");
                    player_ply.textContent = 2;
                }
            };
        });
    });
};

const restart = function () {
    board_array = DotsAndBoxes.starting_board(dot_columns, dot_rows);
    max_boxes.textContent = DotsAndBoxes.max_boxes(board_array);
    boxes_left.textContent = DotsAndBoxes.boxes_left(board_array);
    draw_board(board_array, board);
    const p1_count = DotsAndBoxes.how_many_char_in_board (1, board_array);
    const p2_count = DotsAndBoxes.how_many_char_in_board (2, board_array);
    player1.textContent = p1_count;
    player2.textContent = p2_count;
    boxes_left.textContent = DotsAndBoxes.boxes_left(board_array);
    winner.textContent = DotsAndBoxes.who_is_winning(p1_count, p2_count);
    play();
};

restart();
restart_button1.onclick = function () {
    restart();
};
instructions_button.onclick = function () {
    instructions.showModal();
    exit_button1.onclick = function () {
        instructions.close();
    };
};



