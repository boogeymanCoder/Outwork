function setupTextArea() {
  const tx = document.getElementsByClassName("dynamic-textarea");
  for (let i = 0; i < tx.length; i++) {
    tx[i].setAttribute(
      "style",
      "height:" + tx[i].scrollHeight + "px;overflow-y:hidden;"
    );
    tx[i].addEventListener("input", OnInput, false);
  }
}

function OnInput() {
  this.classList.remove("h-auto");
  this.rows = this.value.split(/\r\n|\r|\n/).length;
  this.style.height = "auto";
  this.style.height = this.scrollHeight + "px";
}

setupTextArea();
