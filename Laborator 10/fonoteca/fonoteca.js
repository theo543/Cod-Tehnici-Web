(async () => {
  let albums = await fetch("albums.json").then(response => response.json());
  let gallery = document.getElementById("gallery");
  for(let album of albums) {
    console.log(album);
    let div = document.createElement("a");
    div.classList.add("album-cover");
    div.setAttribute("tabindex", '0');
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
    function startLoad(album) {
      alert(album.innerHTML);
    }
    div.addEventListener("click", e => startLoad(e.currentTarget));
    div.addEventListener("keypress", e => {
      if(e.key === "Enter") {
        startLoad(e.currentTarget);
      }
    });
  }
})();
