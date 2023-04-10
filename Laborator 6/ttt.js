"use strict";
function toPos(pos) {
    return [Math.floor((pos - 1) / 3), (pos - 1) % 3];
}
class Game {
    constructor() {
        this.name = prompt("Hai să jucăm X și 0. Cum te cheamă?");
        this.user = prompt(`Bună, ${name}. Cu ce vrei să joci? X sau 0? X începe primul.`);
        this.enemy = this.user === "X" ? "0" : "X";
        this.player = "X";
        this.game = [];
        for (let i = 0; i < 3; i += 1) {
            this.game.push(["?", "?", "?"]);
        }
    }
    printt() {
        let ret = "";
        for (let i = 0; i < 3; i += 1) {
            ret += "|";
            for (let j = 0; j < 3; j += 1) {
                ret += ` ${this.game[i][j] === "?" ? i * 3 + j + 1 : this.game[i][j]} |`;
            }
            ret += "\n";
        }
        return ret;
    }

    valid(pos) {
        if (typeof pos !== "number") return false;
        if (isNaN(pos)) return false;
        if (pos < 1 || pos > 9) return false;
        //alert(toPos(pos));
        return this.game[toPos(pos)[0]][toPos(pos)[1]] === "?";

    }
    computer_move() {
        let ret = Math.floor(Math.random() * 9) + 1;
        if (this.valid(ret)) return ret;
        return this.computer_move();
    }

    win(player) {
        if (this.game.some(row => row.every(x => x === player))) return true;
        for (let i = 0; i < 3; i += 1) {
            if (this.game.every(row => row[i] === player)) return true;
        }
        if (this.game[0][0] === player && this.game[1][1] === player && this.game[2][2] === player) return true;
        return this.game[0][2] === player && this.game[1][1] === player && this.game[2][0] === player;

    }
    draw() {
        return this.game.every(row => row.every(x => x !== "?")) && !this.win("X") && !this.win("0");
    }
    tick() {
        let nextPos = null;
        if(this.player === this.user) {
            while(nextPos === null) {
                nextPos = prompt("Unde vrei să pui următorul semn?");
                nextPos = parseInt(nextPos);
                if (!this.valid(nextPos)) {
                    alert("Poziție invalidă!");
                    nextPos = null;
                }
            }
        } else nextPos = this.computer_move();
        this.game[toPos(nextPos)[0]][toPos(nextPos)[1]] = this.player;
        this.player = this.player === "X" ? "0" : "X";
        alert(this.printt());
        if (this.win(this.user)) {
            alert(`Bravo, ${this.name}, ai câștigat!`);
            return true;
        }
        if (this.win(this.enemy)) {
            alert("Ai pierdut!");
            return true;
        }
        if (this.draw()) {
            alert("Remiză!");
            return true;
        }
    }
}
(() => {
    let games = {};
    while(true) {
        alert(`Sunt ${Object.keys(games).length} jocuri în desfășurare.\n` +
        "Jocurile în desfășurare sunt:\n" +
        Object.keys(games).join(", ") + "\n");
        let game = prompt("Dorești să începi un joc nou? Da/Nu");
        if (game === "Da") {
            let id = prompt("Cu ce id vrei să îl salvezi?");
            games[id] = new Game();
        } else if (game === "Nu") {
            let id = prompt("Ce joc vrei să continui?");
            if (games[id] === undefined) {
                alert("Nu există un joc cu acest id!");
                let exit = prompt("Dorești să ieși din program? Da/Nu");
                if (exit === "Da") break;
                continue;
            }
            let time = prompt("Câte runde vrei să joci?");
            for (let i = 0; i < time; i += 1) {
                if (games[id].tick()) {
                    delete games[id];
                    break;
                }
            }
        }
    }
})();
