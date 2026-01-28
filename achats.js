// ----------------------------
// 🔹 رابط Web App من Google Apps Script
// ضع الرابط الذي حصلت عليه بعد النشر هنا
// ----------------------------
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbw0Dyq_CCQKIe51g38nhOqnADg65iZ8y-Z7fNfwtXn9j-2sphElaWt9pjjHfux0QnbPmg/exec";

// ----------------------------
// 🔹 مصفوفة لتخزين المنتجات مؤقتًا
// ----------------------------
let achats = [];

// ----------------------------
// 🔹 إضافة منتج للجدول
// ----------------------------
function addToTable(){

  const produit = {
    date: document.getElementById("dateAchat").value,
    nom: document.getElementById("nomProduit").value,
    achat: document.getElementById("prixAchat").value,
    vente: document.getElementById("prixVente").value,
    qte: document.getElementById("quantite").value,
    exp: document.getElementById("dateExp").value,
    cat: document.getElementById("categorie").value
  };

  if(!produit.nom || !produit.cat){
    alert("❌ أدخل اسم المنتج والمجموعة");
    return;
  }

  achats.push(produit);
  renderTable();
  clearForm();
}

// ----------------------------
// 🔹 رسم الجدول مع التعديل المباشر والحذف
// ----------------------------
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

// ----------------------------
// 🔹 تحديث أي حقل في الجدول مباشرة
// ----------------------------
function update(index,key,value){
  achats[index][key] = value;
}

// ----------------------------
// 🔹 حذف صف من الجدول
// ----------------------------
function removeRow(index){
  if(confirm("هل تريد حذف المنتج؟")){
    achats.splice(index,1);
    renderTable();
  }
}

// ----------------------------
// 🔹 حفظ جميع المنتجات في Google Sheet
// ----------------------------
function saveToStock(){

  if(achats.length === 0){
    alert("⚠️ لا توجد منتجات");
    return;
  }

  // نرسل البيانات باستخدام FormData لتجاوز CORS
  const formData = new FormData();
  formData.append("data", JSON.stringify({
    action: "addStock",
    data: achats
  }));

  fetch(WEB_APP_URL,{
    method:"POST",
    body: formData
  })
  .then(() => {
    alert("✅ تم حفظ المنتجات في المخزون");
    achats = [];
    renderTable();
  })
  .catch(err => {
    alert("❌ فشل الاتصال بـ Google Sheet");
    console.error(err);
  });
}

// ----------------------------
// 🔹 تفريغ الفورم بعد الإضافة
// ----------------------------
function clearForm(){
  document.getElementById("nomProduit").value = "";
  document.getElementById("prixAchat").value = "";
  document.getElementById("prixVente").value = "";
  document.getElementById("quantite").value = "";
  document.getElementById("dateAchat").value = "";
  document.getElementById("dateExp").value = "";
  document.getElementById("categorie").value = "";
}
