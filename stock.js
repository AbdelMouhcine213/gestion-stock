const webAppUrl = "PUT_YOUR_WEB_APP_URL_HERE";

window.onload = loadStock;

function loadStock(){
  fetch(webAppUrl + "?action=stock")
    .then(r=>r.json())
    .then(showStock);
}

function showStock(data){
  const tbody = document.querySelector("#stockTable tbody");
  tbody.innerHTML = "";

  data.forEach(p=>{
    const tr = document.createElement("tr");

    if(p.qty <= 5) tr.classList.add("low");

    if(p.expiry){
      const days = (new Date(p.expiry)-new Date())/86400000;
      if(days <= 7) tr.classList.add("expire");
    }

    tr.innerHTML = `
      <td>${p.image ? `<img src="${p.image}">` : ""}</td>
      <td>${p.name}</td>
      <td>${p.buyPrice}</td>
      <td>${p.sellPrice}</td>
      <td>${p.qty}</td>
      <td>${p.expiry||""}</td>
      <td>${p.group}</td>
      <td>${p.subGroup}</td>
    `;
    tbody.appendChild(tr);
  });
}

function filterTable(){
  const v = search.value.toLowerCase();
  document.querySelectorAll("#stockTable tbody tr").forEach(r=>{
    r.style.display = r.innerText.toLowerCase().includes(v) ? "" : "none";
  });
}
