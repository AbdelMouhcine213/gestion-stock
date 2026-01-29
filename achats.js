const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyRwtWs0nvXZrpQvdEgESCQDE7xT836fY9B3GXv5bJVMOp1mnoWDIVou6rNEzYI6sKdKw/exec"; 
const subGroups = ["Parfum","Deodorant","Shampoing","Gel Douche","Stick","Creme","Autres"];

// إظهار/إخفاء المجموعة الفرعية
function showSubGroup(){
  const g = document.getElementById("inputGroup").value;
  const sub = document.getElementById("inputSub");
  if(g=="Femme" || g=="Homme") sub.style.display = ""; 
  else { sub.style.display = "none"; sub.value = ""; }
}

// إضافة صف من الإدخال اليدوي
function addRowFromInput(){
  const date = document.getElementById("inputDate").value;
  const nom = document.getElementById("inputNom").value;
  const achat = document.getElementById("inputAchat").value;
  const vente = document.getElementById("inputVente").value;
  const group = document.getElementById("inputGroup").value;
  const sub = document.getElementById("inputSub").value;
  const qte = document.getElementById("inputQte").value;
  const imgFile = document.getElementById("inputImg").files[0];

  if(!nom || !achat || !vente || !group || !qte){
    alert("يرجى ملء جميع الحقول المطلوبة");
    return;
  }

  if(imgFile){
    const reader = new FileReader();
    reader.onload = function(e){
      addRow({date,nom,achat,vente,group,sub,qte,img:e.target.result});
    };
    reader.readAsDataURL(imgFile);
  } else {
    addRow({date,nom,achat,vente,group,sub,qte,img:null});
  }
}

// إضافة صف في الجدول
function addRow(data){
  const tbody = document.querySelector("#productTable tbody");
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td contenteditable="true">${data.date}</td>
    <td contenteditable="true">${data.nom}</td>
    <td contenteditable="true">${data.achat}</td>
    <td contenteditable="true">${data.vente}</td>
    <td>
      <select onchange="updateSubGroup(this)">
        <option value="">--اختر--</option>
        <option value="Chocolat">Chocolat</option>
        <option value="Boisson">Boisson</option>
        <option value="Gateaux">Gateaux</option>
        <option value="Autres">Autres</option>
        <option value="Femme">Femme</option>
        <option value="Homme">Homme</option>
      </select>
    </td>
    <td>
      <select class="subGroup" style="display:none;">
        ${subGroups.map(s=>`<option value="${s}">${s}</option>`).join('')}
      </select>
    </td>
    <td contenteditable="true">${data.qte}</td>
    <td contenteditable="false">${data.qte}</td>
    <td>${data.img ? `<img class="product-img" src="${data.img}">` : ''}</td>
    <td><button onclick="this.parentElement.parentElement.remove()">🗑</button></td>
  `;
  tbody.appendChild(tr);
  tr.children[4].firstChild.value = data.group;
  if(data.group=="Femme"||data.group=="Homme"){
    tr.children[5].firstChild.style.display = "";
    tr.children[5].firstChild.value = data.sub;
  }
}

// تحديث المجموعة الفرعية داخل الجدول
function updateSubGroup(select){
  const tr = select.parentElement.parentElement;
  const sub = tr.querySelector(".subGroup");
  if(select.value=="Femme"||select.value=="Homme") sub.style.display = "";
  else { sub.style.display = "none"; sub.value=""; }
}

// حفظ البيانات في المخزون مع تجاوز CORS
function saveToStock(){
  const rows = [...document.querySelectorAll("#productTable tbody tr")];
  if(!rows.length){ alert("لا توجد منتجات"); return; }

  const items = rows.map(r=>({
    date: r.children[0].innerText,
    nom: r.children[1].innerText,
    achat: r.children[2].innerText,
    vente: r.children[3].innerText,
    group: r.children[4].firstChild.value,
    sub: r.children[5].firstChild.value,
    qteOriginal: r.children[6].innerText,
    qteRest: r.children[7].innerText,
    img: r.children[8].querySelector("img") ? r.children[8].querySelector("img").src : null
  }));

  console.log("إرسال البيانات:", items);

  fetch(WEB_APP_URL,{
    method:"POST",
    mode:"no-cors", // ⚡ لتجاوز مشكلة CORS
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({action:"SAVE_PURCHASES", data:items})
  });

  alert("✅ تم إرسال المنتجات للمخزون (لا يمكن تأكيد الاستجابة بسبب CORS)");
}
