const webAppUrl = "https://script.google.com/macros/s/AKfycbw0Dyq_CCQKIe51g38nhOqnADg65iZ8y-Z7fNfwtXn9j-2sphElaWt9pjjHfux0QnbPmg/exec";
let achats = [];

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
  document.querySelector("#tableAchats tbody").appendChild(tr);
}

function saveToStock(){
  if(achats.length === 0){
    alert("⚠️ لا توجد منتجات");
    return;
  }

  fetch(WEB_APP_URL,{
    method:"POST",
    body:JSON.stringify({action:"addStock",data:achats})
  })
  .then(r=>r.text())
  .then(()=>{
    alert("✅ تم الحفظ في المخزون");
    achats=[];
    document.querySelector("#tableAchats tbody").innerHTML="";
  })
  .catch(()=>{
    alert("❌ خطأ في الاتصال");
  });
}
