const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyRwtWs0nvXZrpQvdEgESCQDE7xT836fY9B3GXv5bJVMOp1mnoWDIVou6rNEzYI6sKdKw/exec"; 

async function loadStock(){
  try{
    const res = await fetch(WEB_APP_URL);
    const data = await res.json(); // البيانات من Google Sheet
    const tbody = document.querySelector("#stockTable tbody");
    tbody.innerHTML = "";

    data.forEach(row=>{
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${row[0]}</td>
        <td>${row[1]}</td>
        <td>${row[2]}</td>
        <td>${row[3]}</td>
        <td>${row[4]}</td>
        <td>${row[5]}</td>
        <td>${row[6]}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch(err){
    console.error("Failed to load stock:", err);
  }
}

window.onload = loadStock;
