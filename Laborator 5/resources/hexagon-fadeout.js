"use strict";
(() => {
    let c = document.getElementsByClassName("container")[0];
    c.addEventListener("mouseover", (e) => {
        let hexagon = e.target;
        if (!hexagon || !c.contains(hexagon) || c === hexagon)
            return;
        hexagon.style.filter = "";
        hexagon.classList.add("animation-on");
    });
    c.addEventListener("mouseout", (e) => {
        let hexagon = e.target;
        if (!hexagon || !c.contains(hexagon) || c === hexagon)
            return;
        let fl = getComputedStyle(hexagon).filter;
        hexagon.classList.remove("animation-on");
        hexagon.style.filter = fl;
    });
})();
