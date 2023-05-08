let container = document.getElementById("container");
let vizor = container.querySelector("#vizor");
let image = vizor.querySelector("img");
let gallery = document.getElementById("gallery");
let im_x = 0, im_y = 0, im_s = 1;
let dx = 10;
let dy = 10;
let ds = 0.001;
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
function snapshot() {
    let copy = vizor.cloneNode(true);
    return copy;
}
let anim_active = false;
function animate(elem) {
    if(anim_active) return;
    elem.style.animation = "flash 0.5s";
    anim_active = true;
    elem.addEventListener("animationend", function () {
        anim_active = false;
        elem.style.animation = "";
        elem.removeEventListener("animationend", this);
    });
}
function photo() {
    if(anim_active) return;
    let copy = snapshot();
    gallery.appendChild(copy);
    animate(container);
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
            photo();
            break;
        case "t":
            setTimeout(function () {
                photo();
            }, 500);
            break;
        case "b":
 //           let count = 4;
//            container.addEventListener("animationend", function () {
    }
    updateImage();
});