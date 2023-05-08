let container = document.getElementById("container");
let vizor = container.querySelector("#vizor");
let image = vizor.querySelector("img");
let gallery = document.getElementById("gallery");
let im_x = 0, im_y = 0, im_s = 1;
let dx = 10;
let dy = 10;
let ds = 0.001;
function start_timer(time_len, time_cb) {
    let time_span_parent = document.getElementById("time");
    let time_span = document.createElement("span");
    time_span_parent.appendChild(time_span);
    let timer_start = (new Date()).getTime();
    let ev;
    let val = NaN;
    if(time_len < 0) {
        ev = (ev) => {
            val = parseInt(ev.key);
        }
        document.body.addEventListener("keydown", ev);
    }
    function update_timer() {
        if(time_len < 0) {
            if(isNaN(val)) {
                time_span.innerText = "Type a number";
                requestAnimationFrame(update_timer);
                return;
            }
            time_len = val * 1000;
            timer_start = (new Date()).getTime();
            document.body.removeEventListener("keydown", ev);
        }
        let c = (new Date()).getTime();
        if (c - timer_start > time_len) {
            if (time_cb()) {
                timer_start = (new Date()).getTime();
                update_timer();
                return;
            }
            time_span.innerText = "";
            timer_start = null;
            time_cb = () => {
            };
        } else {
            time_span.innerText = String(time_len - (c - timer_start));
            requestAnimationFrame(update_timer);
        }
    }
    update_timer();
}
function updateMargin(elem, marginx, marginy) {
    elem.style.marginLeft = marginx  + "px";
    elem.style.marginTop = marginy  + "px";
}
function updateScale(elem, scale) {
    elem.style.scale = scale;
}
function updateImage() {
    im_x = Math.max(Math.min(im_x, 0), -image.width + vizor.clientWidth);
    im_y = Math.max(Math.min(im_y, 0), -image.height + vizor.clientHeight);
    updateMargin(image, im_x, im_y);
    updateScale(image, im_s);
    console.log(im_x, im_y, im_s);
}
function animate(elem) {
    elem.animate([
        {filter: "brightness(100%)", offset: 0},
        {filter: "brightness(1000%)", offset: 0.5},
        {filter: "brightness(100%)", offset: 1},
    ], {
        duration: 1000 / 2,
        iterations: 1,
        easing: "ease-in-out",
    });
}
function snapshot(){
    gallery.appendChild(vizor.cloneNode(true));
}
document.body.addEventListener("keydown", function (event) {
    console.log(event.key);
    switch (event.key) {
        case "ArrowUp":
            im_y -= dy;
            break;
        case "ArrowDown":
            im_y += dy;
            break;
        case "ArrowLeft":
            im_x -= dx;
            break;
        case "ArrowRight":
            im_x += dx;
            break;
        case "+":
            im_s += ds;
            break;
        case "-":
            im_s -= ds;
            break;
        case "s":
            animate(container);
            snapshot();
            break;
        case "t":
            start_timer(-1, () => {
                animate(container);
                snapshot();
            });
            break;
        case "b":
            let count = 4;
            start_timer(500, () => {
                animate(container);
                snapshot();
                count--;
                return count > 0;
            });
    }
    updateImage();
});
document.addEventListener("wheel", function (event) {
    im_s += event.deltaY * ds;
    updateImage();
});
let drag = false;
let lastX = 0, lastY = 0;
document.addEventListener('mousedown', (e) => {
    drag = true;
    lastX = e.clientX;
    lastY = e.clientY;
});
document.addEventListener('mousemove', (e) => {
    if (drag) {
        if(!(e.buttons & 1)) {
            drag = false;
            return;
        }
        im_x += e.clientX - lastX;
        im_y += e.clientY - lastY;
        lastX = e.clientX;
        lastY = e.clientY;
        updateImage();
    }
});
document.addEventListener('mouseup', () => drag = false);
