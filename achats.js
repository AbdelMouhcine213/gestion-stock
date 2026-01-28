const webAppUrl = "https://script.google.com/macros/s/AKfycbw0Dyq_CCQKIe51g38nhOqnADg65iZ8y-Z7fNfwtXn9j-2sphElaWt9pjjHfux0QnbPmg/exec";
let achats = [];

/* إضافة منتج للجدول */
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

  const tbody = document.querySelector("#tableAchats tbody");
  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${produit.date}</td>
    <td>${produit.nom}</td>
    <td>${produit.achat}</td>
    <td>${produit.vente}</td>
    <td>${produit.qte}</td>
    <td>${produit.exp}</td>
    <td>${produit.cat}</td>
  `;

  tbody.appendChild(tr);

  // تفريغ الحقول
  document.getElementById("nomProduit").value = "";
  document.getElementById("prixAchat").value = "";
  document.getElementById("prixVente").value = "";
  document.getElementById("quantite").value = "";
}

/* حفظ في المخزون */
function saveToStock(){

  if(achats.length === 0){
    alert("⚠️ لا توجد منتجات للحفظ");
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
  .then(res => res.text())
  .then(()=>{
    alert("✅ تم حفظ المنتجات في المخزون");
    achats = [];
    document.querySelector("#tableAchats tbody").innerHTML = "";
  })
  .catch(err=>{
    alert("❌ فشل الاتصال بـ Google Sheet");
    console.error(err);
  });
}
