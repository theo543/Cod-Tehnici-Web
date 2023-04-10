"use strict";
(() => {
    let name = prompt("Hai să jucăm X și 0. Cum te cheamă?");
    let user = prompt(`Bună, ${name}. Cu ce vrei să joci? X sau 0? X începe primul.`);
    let enemy = user === "X" ? "0" : "X";
    let player = "X";
    let game = [];
    for (let i = 0; i < 3; i += 1) {
        game.push(["?", "?", "?"]);
    }

    function printt() {
        let ret = "";
        for (let i = 0; i < 3; i += 1) {
            ret += "|";
            for (let j = 0; j < 3; j += 1) {
                ret += ` ${game[i][j] === "?" ? i * 3 + j + 1 : game[i][j]} |`;
            }
            ret += "\n";
        }
        return ret;
    }

    function toPos(pos) {
        return [Math.floor((pos - 1) / 3), (pos - 1) % 3];
    }

    function valid(pos) {
        if (typeof pos !== "number") return false;
        if (isNaN(pos)) return false;
        if (pos < 1 || pos > 9) return false;
        //alert(toPos(pos));
        if (game[toPos(pos)[0]][toPos(pos)[1]] !== "?") return false;
        return true;
    }

    function computer_move() {
        let ret = Math.floor(Math.random() * 9) + 1;
        if (valid(ret)) return ret;
        return computer_move();
    }

    function win(game, player) {
        if (game.some(row => row.every(x => x === player))) return true;
        for (let i = 0; i < 3; i += 1) {
            if (game.every(row => row[i] === player)) return true;
        }
        if (game[0][0] === player && game[1][1] === player && game[2][2] === player) return true;
        if (game[0][2] === player && game[1][1] === player && game[2][0] === player) return true;
        return false;
    }

    function draw() {
        return game.every(row => row.every(x => x !== "?")) && !win(game, "X") && !win(game, "0");
    }

    while (true) {
        let nextPos = null;
        if(player === user) {
            while(nextPos === null) {
                nextPos = prompt("Unde vrei să pui următorul semn?");
                nextPos = parseInt(nextPos);
                if (!valid(nextPos)) {
                    alert("Poziție invalidă!");
                    nextPos = null;
                }
            }
        } else nextPos = computer_move();
        game[toPos(nextPos)[0]][toPos(nextPos)[1]] = player;
        player = player === "X" ? "0" : "X";
        alert(printt());
        if (win(game, user)) {
            alert(`Bravo, ${name}, ai câștigat!`)
            return;
        }
        if (win(game, enemy)) {
            alert("Ai pierdut!");
            return;
        }
        if (draw()) {
            alert("Remiză!");
            return;
        }
    }
})();
