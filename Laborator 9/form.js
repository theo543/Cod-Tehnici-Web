
let form = document.getElementById("input");
let submit = document.getElementById("input-submit");
let checkbox_group = "input-visit-purpose";
let checkbox_query = `[name="${checkbox_group}"]`;
let color_picker = document.getElementById("input-color");
function color_picker_update(transition = true) {
  if(transition)
    document.body.style.transition = "background-color 1s ease-in-out";
  document.body.style.backgroundColor = color_picker.value;
  localStorage.setItem("backgroundColor", color_picker.value);
}
color_picker.addEventListener("change", () => color_picker_update(true));
let prev_color = localStorage.getItem("backgroundColor");
if(prev_color) {
  color_picker.value = prev_color;
} else color_picker.value = "#201B3C";
color_picker_update(false);
let credit = document.getElementById("input-credit");
let credit_display = document.getElementById("input-credit-display");
credit.addEventListener("input", _ => {
  credit_display.innerText = credit.value;
});
credit.dispatchEvent(new Event("input"));
function check_at_least_one_checkbox() {
  let checkboxes = document.querySelectorAll(checkbox_query);
  let valid = false;
  checkboxes.forEach(elem => {valid |= elem.checked;});
  return valid;
}
form.addEventListener("submit", event => {
  try {
    if (!check_at_least_one_checkbox()) {
      let first_checkbox = form.querySelector(checkbox_query);
      first_checkbox.setCustomValidity("Please select at least one visit purpose!");
      first_checkbox.reportValidity();
      first_checkbox.setCustomValidity("");
    } else {
      window.fetch(form.action, {
        body: new FormData(form),
        method: 'post'
      })
        .then(res => {
          if(res.status === 200)
            result.innerText = "Trimis!";
          else result.innerText = "Eroare " + res.status;
        })
        .catch(err => {
          result.innerText = "Eroare:" +  err;
        });
      let result = document.createElement("p");
      result.innerText = "Procesare...";
      result.style.textAlign = "center";
      form.replaceWith(result);
    }
  } catch(err) {
    alert(err);
  } finally {
    event.preventDefault();
    event.stopPropagation();
  }
  return false;
});
