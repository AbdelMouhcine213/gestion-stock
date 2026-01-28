console.log("achats.js loaded");
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbw0Dyq_CCQKIe51g38nhOqnADg65iZ8y-Z7fNfwtXn9j-2sphElaWt9pjjHfux0QnbPmg/exec";
let achats = [];

/* إضافة */
function addToTable(){

  const produit = {
    date: dateAchat.value,
    nom: nomProduit.value,
    achat: prixAchat.value,
    vente: prixVente.value,
    qte: quantite.value,
    exp: dateExp.value,
    cat: categorie.value
  };

  if(!produit.nom || !produit.cat){
    alert("❌ أدخل اسم المنتج والمجموعة");
    return;
  }

  achats.push(produit);
  renderTable();
  clearForm();
}

/* رسم الجدول */
function renderTable(){
  const tbody = document.querySelector("#tableAchats tbody");
  tbody.innerHTML = "";

  achats.forEach((p,i)=>{
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td><input value="${p.date}" onchange="update(${i},'date',this.value)"></td>
      <td><input value="${p.nom}" onchange="update(${i},'nom',this.value)"></td>
      <td><input value="${p.achat}" onchange="update(${i},'achat',this.value)"></td>
      <td><input value="${p.vente}" onchange="update(${i},'vente',this.value)"></td>
      <td><input value="${p.qte}" onchange="update(${i},'qte',this.value)"></td>
      <td><input value="${p.exp}" onchange="update(${i},'exp',this.value)"></td>
      <td><input value="${p.cat}" onchange="update(${i},'cat',this.value)"></td>
      <td class="actions">
        <button class="delete" onclick="removeRow(${i})">🗑</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

/* تعديل مباشر */
function update(index,key,value){
  achats[index][key] = value;
}

/* حذف */
function removeRow(index){
  if(confirm("هل تريد حذف المنتج؟")){
    achats.splice(index,1);
    renderTable();
  }
}

/* حفظ في المخزون */
function saveToStock(){

  if(achats.length === 0){
    alert("⚠️ لا توجد منتجات");
    return;
  }

  fetch(WEB_APP_URL,{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({
      action:"addStock",
      data: achats
    })
  })
  .then(r=>r.text())
  .then(()=>{
    alert("✅ تم حفظ المنتجات في المخزون");
    achats=[];
    renderTable();
  })
  .catch(()=>{
    alert("❌ خطأ في الاتصال");
  });
}

/* تنظيف الفورم */
function clearForm(){
  nomProduit.value="";
  prixAchat.value="";
  prixVente.value="";
  quantite.value="";
}
