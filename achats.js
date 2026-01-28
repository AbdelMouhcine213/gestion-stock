const webAppUrl = "https://script.google.com/macros/s/AKfycbw0Dyq_CCQKIe51g38nhOqnADg65iZ8y-Z7fNfwtXn9j-2sphElaWt9pjjHfux0QnbPmg/exec";

/* =======================
   المجموعات الفرعية
======================= */
let subGroups = {
  Femme: ["Deodorant","Parfum","Stick","Shampoing","Gel Douche","Autres"],
  Homme: ["Deodorant","Parfum","Stick","Shampoing","Gel Douche","Autres"]
};

if(localStorage.getItem("subGroups")){
  subGroups = JSON.parse(localStorage.getItem("subGroups"));
}

function loadSubGroups(){
  const g = document.getElementById("group").value;
  const s = document.getElementById("subGroup");
  s.innerHTML = "<option value=''>المجموعة الفرعية</option>";

  if(subGroups[g]){
    subGroups[g].forEach(v=>{
      const o = document.createElement("option");
      o.value = v;
      o.textContent = v;
      s.appendChild(o);
    });
  }
}

function addSubGroup(){
  const g = group.value;
  const v = newSub.value.trim();
  if(!g || !v) return alert("اختر مجموعة وأدخل اسم");

  if(!subGroups[g]) subGroups[g] = [];

  if(!subGroups[g].includes(v)){
    subGroups[g].push(v);
    localStorage.setItem("subGroups", JSON.stringify(subGroups));
    loadSubGroups();
    newSub.value="";
  }
}

function removeSubGroup(){
  const g = group.value;
  const v = subGroup.value;
  if(!g || !v) return;

  subGroups[g] = subGroups[g].filter(x=>x!==v);
  localStorage.setItem("subGroups", JSON.stringify(subGroups));
  loadSubGroups();
}

/* =======================
   حفظ في المخزون
======================= */
function saveToStock(){
  const imgFile = imageInput.files[0];

  if(imgFile){
    const reader = new FileReader();
    reader.onload = () => sendData(reader.result);
    reader.readAsDataURL(imgFile);
  }else{
    sendData("");
  }
}

function sendData(image){
  const data = {
    date: purchaseDate.value,
    name: productName.value,
    buyPrice: buyPrice.value,
    sellPrice: sellPrice.value,
    qty: quantity.value,
    expiry: expiryDate.value,
    group: group.value,
    subGroup: subGroup.value,
    image: image
  };

  fetch(webAppUrl,{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify(data)
  })
  .then(r=>r.json())
  .then(()=>{
    alert("✅ تم حفظ المنتج في المشتريات والمخزون");
    document.querySelectorAll("input,select").forEach(e=>e.value="");
  })
  .catch(err=>{
    console.error(err);
    alert("❌ خطأ في الحفظ");
  });
}
