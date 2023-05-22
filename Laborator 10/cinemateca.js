function toTitleCase(string) {
  return string[0].toUpperCase() + string.substr(1).toLowerCase();
}

(async () => {
  const file = "cinemateca.xml";
  let contents = await fetch(file).then(response => response.text())
  let parser = new DOMParser();
  let xml = parser.parseFromString(contents, "text/xml");
  console.assert(xml instanceof XMLDocument);
  let movies_list = document.createElement("div");
  document.body.appendChild(movies_list);
  for(let movie of xml.activeElement.children) {
    let movie_box = document.createElement("fieldset");
    let movie_legend = document.createElement("legend");
    let movie_list = document.createElement("ul");
    movies_list.appendChild(movie_box);
    movie_box.appendChild(movie_legend);
    movie_box.appendChild(movie_list);
    for(let property of movie.children) {
      if(property.localName === "title") {
        movie_legend.textContent = property.textContent;
        continue;
      }
      let item = document.createElement("li");
      movie_list.appendChild(item);
      item.textContent = toTitleCase(property.localName) + ": " + property.textContent;
    }
  }
})();
