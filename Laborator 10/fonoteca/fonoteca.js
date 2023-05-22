function toTitleCase(string) {
  return string[0].toUpperCase() + string.substr(1).toLowerCase();
}
(async () => {
  let albums = await fetch("albums.json").then(response => response.json());
  let gallery = document.getElementById("gallery");
  let info = document.getElementById("info");
  /**
   * @type HTMLElement
   */
  let activeSelect = null;
  let lastReqId = 0;
  let receive = (reqId, json) => {
    if(reqId !== lastReqId) return; // only the latest gets to update the info!
    info.innerHTML = "<div id='info-img-div'><img id='info-img' src='' alt=''></div>";
    let img = document.getElementById("info-img");
    for(let key in json) {
      if(Array.isArray(json[key])) {

      } else if(key === 'image') {
        img.alt = json[key];
        img.src = `images/${json[key]}`;
      } else {
        let desc_elem = document.createElement("p");
        desc_elem.textContent = toTitleCase(key) + ": " + json[key];
        info.appendChild(desc_elem);
        if(key === 'name') desc_elem.classList.add("name");
      }
    }
  };
  /**
   * @param album {HTMLElement}
   */
  let startLoad = album => {
    if(activeSelect)
      activeSelect.classList.remove("selected");
    activeSelect = album;
    album.classList.add("selected");
    lastReqId++;
    let copy = lastReqId;
    fetch(`albums/${album.getAttribute("data-json-order")}.json`)
      .then(data => data.json()).then(data => receive(copy, data));
  };
  let order = 0;
  for(let album of albums) {
    console.log(album);
    let div = document.createElement("a");
    div.classList.add("album-cover");
    div.setAttribute("tabindex", '0');
    div.setAttribute("data-json-order", order.toString());
    order++;
    gallery.appendChild(div);
    let text = document.createElement("p");
    text.classList.add("title");
    div.appendChild(text);
    let title = document.createElement("span");
    text.appendChild(title);
    title.classList.add("name");
    title.innerText = album.name;
    let by = document.createElement("span");
    by.classList.add("by");
    text.appendChild(by);
    by.innerText = " by " + album.artist;
    let cover = document.createElement("img");
    cover.setAttribute("src", "images/" + album.image);
    div.appendChild(cover);
    div.addEventListener("click", e => startLoad(e.currentTarget));
    div.addEventListener("keypress", e => {
      if(e.key === "Enter") {
        startLoad(e.currentTarget);
      }
    });
  }
})();
