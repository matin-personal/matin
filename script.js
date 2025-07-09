function switchLang() {
  const currentPath = window.location.pathname;
  if (currentPath.startsWith("/fa")) {
    window.location.href = currentPath.replace("/fa", "/en");
  } else if (currentPath.startsWith("/en")) {
    window.location.href = currentPath.replace("/en", "/fa");
  } else {
    window.location.href = "/en/";
  }
}
function loadHeader() {
  fetch("/header.html")
    .then(res => res.text())
    .then(data => {
      const header = document.createElement("div");
      header.innerHTML = data;
      document.body.insertBefore(header, document.body.firstChild);
    });
}
document.addEventListener("DOMContentLoaded", () => {
  loadHeader();

  const flag = document.getElementById("lang-flag");
  if (flag) {
    const path = window.location.pathname;
    if (path.startsWith("/fa")) {
      flag.src = "/images/flag-usa.png";
      flag.alt = "EN";
    } else {
      flag.src = "/images/flag-iran.png";
      flag.alt = "FA";
    }
  }
});
