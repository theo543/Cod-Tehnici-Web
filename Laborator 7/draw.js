let container = document.getElementById("container");
let table = document.createElement("table");
container.append(table);
function saveColors() {
    let colors = {};
    for(let i = 0;i<table.rows.length;i++) {
        colors[i] = {};
        for(let j = 0;j<table.rows[i].cells.length;j++) {
            colors[i][j] = table.rows[i].cells[j].style.backgroundColor;
        }
    }
    return colors;
}
function loadColors(colors) {
    for(let i = 0;i<table.rows.length;i++) {
        for(let j = 0;j<table.rows[i].cells.length;j++) {
            if (colors[i] && colors[i][j]) drawPixel(i, j, colors[i][j]);
        }
    }
}
function drawTable(nrows, ncols) {
    let backup = table ? saveColors() : {};
    if(table) table.remove();
    table = document.createElement("table");
    container.append(table);
    table.id = "table";
    let row = null;
    for(let i = 0;i<nrows;i++) {
        row = document.createElement("tr");
        table.append(row);
        for(let j = 0;j<ncols;j++) {
            let cell = document.createElement("td");
            cell.classList.add(`r${i}`);
            cell.classList.add(`c${j}`);
            row.append(cell);
        }
    }
    loadColors(backup);
}

function colorCol(column, color) {
    let cells = table.getElementsByClassName(`c${column}`);
    for(let i = 0;i<cells.length;i++) {
        cells[i].style.backgroundColor = color;
    }
}

function colorRow(row, color) {
    let cells = table.getElementsByClassName(`r${row}`);
    for(let i = 0;i<cells.length;i++) {
        cells[i].style.backgroundColor = color;
    }
}

function rainbow(target) {
    console.assert(target === 'c' || target === 'r', "Invalid target");
    let table = document.getElementById("table");
    let len = target === 'r' ? table.rows.length : table.rows[0].cells.length;
    for (let i = 0; i < len; i++) {
        let color = `hsl(${i * 360 / len}, 100%, 50%)`;
        if (target === 'c') {
            colorCol(i, color);
        } else {
            colorRow(i, color);
        }
    }
}

function getNthChild(element, n) {
    return element.children[n];
};

function drawPixel(row, col, color) {
    let row_ = getNthChild(table, row);
    let cell = getNthChild(row_, col);
    cell.style.backgroundColor = color;
}

function drawLine(r1, c1, r2, c2, color) {
    if(r1 === r2){
        if(c1 > c2) [c1, c2] = [c2, c1];
        for(let i = c1;i<=c2;i++) drawPixel(r1, i, color);
    }
    if(c1 === c2) {
        if(r1 > r2) [r1, r2] = [r2, r1];
        for(let i = r1;i<=r2;i++) drawPixel(i, c1, color);
    }
}

function drawRect(r1, c1, r2, c2, color) {
    drawLine(r1, c1, r2, c1, color);
    drawLine(r1, c1, r1, c2, color);
    drawLine(r2, c1, r2, c2, color);
    drawLine(r1, c2, r2, c2, color);
}

function drawPixelExt(row, col, color) {
    try {
        drawPixel(row, col, color);
    } catch {
        drawTable(Math.max(row+1, table.rows.length), Math.max(col+1, table.rows[0].cells.length));
        drawPixel(row, col, color);
    }
}
function colorMixer(colorA, colorB, amount){
    let cA = colorA * (1 - amount);
    let cB = colorB * (amount);
    return parseInt(cA + cB);
}

/// from https://stackoverflow.com/a/19366389/
let memoize = function(factory, ctx) {
    var cache = {};
    return function(key) {
        if (!(key in cache)) {
            cache[key] = factory.call(ctx, key);
        }
        return cache[key];
    };
};
let colorToRGBA = (function() {
    var canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    var ctx = canvas.getContext('2d', { willReadFrequently: true });

    return memoize(function(col) {
        ctx.clearRect(0, 0, 1, 1);
        // In order to detect invalid values,
        // we can't rely on col being in the same format as what fillStyle is computed as,
        // but we can ask it to implicitly compute a normalized value twice and compare.
        ctx.fillStyle = '#000';
        ctx.fillStyle = col;
        var computed = ctx.fillStyle;
        ctx.fillStyle = '#fff';
        ctx.fillStyle = col;
        if (computed !== ctx.fillStyle) {
            return null; // invalid color
        }
        ctx.fillRect(0, 0, 1, 1);
        return [ ... ctx.getImageData(0, 0, 1, 1).data ];
    });
})();
function drawPixelAmount(row, col, color, amount) {
    let row_ = getNthChild(table, row);
    let cell = getNthChild(row_, col);
    let rgb_orig = colorToRGBA(cell.style.backgroundColor) ?? [255, 255, 255, 255];
    let rgb_new = colorToRGBA(color);
    let r = colorMixer(rgb_orig[0], rgb_new[0], amount);
    let g = colorMixer(rgb_orig[1], rgb_new[1], amount);
    let b = colorMixer(rgb_orig[2], rgb_new[2], amount);
    let a = colorMixer(rgb_orig[3], rgb_new[3], amount);
    cell.style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${a})`;
}

function delRow(row) {
    table.rows[row].remove();
}

function delCol(col) {
    for(let i = 0;i<table.rows.length;i++) table.rows[i].cells[col].remove(col);
}

function shiftRow(row, pos) {
    let row_ = getNthChild(table, row);
    while(pos) {
        row_.lastChild.before(row_.firstChild);
        pos--;
    }
}

function jumble() {
    for(let i = 0;i<table.rows.length;i++) {
        shiftRow(i, Math.floor(Math.random() * table.rows[i].cells.length));
    }
}
function swap(el1, el2) {
    let temp = document.createComment('');
    el2.replaceWith(temp);
    el1.replaceWith(el2);
    temp.replaceWith(el1);
}
function transpose() {
    for(let row = 0;row<table.rows.length;row++) {
        for(let col = row;col<Math.min(table.rows.length, table.rows[row].cells.length);col++) {
            swap(getNthChild(table, row).children[col], getNthChild(table, col).children[row]);
        }
    }
}

function flip(element) {
    let order = [];
    for(let i = 0;i<element.children.length;i++) {
        order.push(element.children[i]);
    }
    order.reverse();
    for(let i = 0;i<order.length;i++) {
        element.appendChild(order[i]);
    }
}

function mirror() {
    let color = saveColors();
    let rows = table.rows.length;
    let cols = table.rows[0].cells.length;
    let mid = Math.floor(cols / 2);
    for(let row = 0;row<rows;row++) {
        for(let col = mid + 1;col<cols;col++) {
            color[row][col] = color[row][cols - col - 1];
        }
    }
    loadColors(color);
}

function smear(row, col, amount) {
    let color = getNthChild(getNthChild(table, row), col).style.backgroundColor;
    for(let pos = col + 1;pos < table.rows[row].cells.length;pos++) {
        drawPixelAmount(row, pos, color, amount);
        amount /= 2;
    }
}

drawTable(40, 80);
rainbow('c');
drawRect(0, 0, 5, 2, 'black');
drawLine(10, 5, 0, 5, 'gray');
drawLine(10, 5, 10, 0, 'gray');
smear(10, 5, 0.75);
