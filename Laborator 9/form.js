
let form = document.getElementById("input");
let submit = document.getElementById("input-submit");
let checkbox_group = "input-visit-purpose";
let checkbox_query = `[name="${checkbox_group}"]`;
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
      alert("Form valid!");
    }
  } catch(err) {
    alert(err);
  } finally {
    event.preventDefault();
    event.stopPropagation();
  }
  return false;
});
