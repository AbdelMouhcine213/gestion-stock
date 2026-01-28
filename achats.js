const webAppUrl = "https://script.google.com/macros/s/AKfycbw0Dyq_CCQKIe51g38nhOqnADg65iZ8y-Z7fNfwtXn9j-2sphElaWt9pjjHfux0QnbPmg/exec";

const subGroups = {
  Femme: ["Deodorant","Parfum","Stick","Shampoing","Gel Douche","Autres"],
  Homme: ["Deodorant","Parfum","Stick","Shampoing","Gel Douche","Autres"]
};

function loadSubGroups(){
  const g = document.getElementById("group").value;
  const s = document.getElementById("subGroup");
  s.innerHTML = "<option value=''>المجموعة الفرعية</option>";
  if(subGroups[g]){
    subGroups[g].forEach(v=>{
      const o=document.createElement("option");
      o.textContent=v;
      s.appendChild(o);
    });
  }
}

function saveToStock(){
  const img = document.getElementById("imageInput").files[0];
  if(img){
    const reader = new FileReader();
    reader.onload = ()=> sendData(reader.result);
    reader.readAsDataURL(img);
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
    image
  };

  fetch(webAppUrl,{
    method:"POST",
    body:JSON.stringify(data),
    headers:{"Content-Type":"application/json"}
  })
  .then(r=>r.json())
  .then(()=>{
    alert("✅ تم الحفظ في المشتريات و المخزون");
    document.querySelectorAll("input,select").forEach(e=>e.value="");
  })
  .catch(()=>alert("❌ خطأ في الاتصال"));
}

// المجموعات الفرعية حسب الجنس
const subGroups = {
    Femme: ["Deodorant","Parfum","Stick","Shampoing","Gel Douche","Autres"],
    Homme: ["Deodorant","Parfum","Stick","Shampoing","Gel Douche","Autres"]
};

// عرض المجموعات الفرعية عند اختيار Femme أو Homme
mainGroup.addEventListener("change", () => {
    const group = mainGroup.value;
    if(subGroups[group]){
        subGroup.style.display = "block";
        subGroup.innerHTML = '<option value="">اختر المجموعة الفرعية</option>';
        subGroups[group].forEach(item => {
            const opt = document.createElement("option");
            opt.value = item;
            opt.textContent = item;
            subGroup.appendChild(opt);
        });
    } else {
        subGroup.style.display = "none";
    }
});

// إضافة منتج جديد
purchaseForm.addEventListener("submit", e => {
    e.preventDefault();
    const reader = new FileReader();
    const file = document.getElementById("productImage").files[0];
    reader.onload = function(){
        const newPurchase = {
            date: document.getElementById("achatsDate").value,
            name: document.getElementById("productName").value,
            buyPrice: parseFloat(document.getElementById("buyPrice").value),
            sellPrice: parseFloat(document.getElementById("sellPrice").value),
            quantity: parseInt(document.getElementById("quantity").value),
            expiry: document.getElementById("expiryDate").value,
            group: mainGroup.value,
            subGroup: subGroup.value || "",
            image: reader.result || ""
        };
        purchases.push(newPurchase);
        localStorage.setItem("purchases", JSON.stringify(purchases));
        addPurchaseToSheet(newPurchase);
        renderTable();
        purchaseForm.reset();
        subGroup.style.display = "none";
    };
    if(file) reader.readAsDataURL(file); else reader.onload();
});

// ============================================
// دوال الربط مع Google Sheet
function addPurchaseToSheet(purchase){
    fetch(webAppUrl + "?action=addachats", {
        method: "POST",
        body: JSON.stringify(purchase)
    }).then(res => res.json()).then(console.log).catch(console.error);
}

function addStockToSheet(purchase){
    fetch(webAppUrl + "?action=addStock", {
        method: "POST",
        body: JSON.stringify(purchase)
    }).then(res => res.json()).then(console.log).catch(console.error);
}

// ============================================
// عرض الجدول + أزرار
function renderTable(){
    tableBody.innerHTML = "";
    let total = 0;
    purchases.forEach((p,index)=>{
        const tr = document.createElement("tr");
        tr.innerHTML = `
        <td>${p.date}</td>
        <td>${p.name}</td>
        <td>${p.buyPrice}</td>
        <td>${p.sellPrice}</td>
        <td>${p.quantity}</td>
        <td>${p.expiry}</td>
        <td>${p.group}</td>
        <td>${p.subGroup}</td>
        <td>${p.image? `<img src="${p.image}" class="product-img">` : ""}</td>
        <td>
            <button style="background:#0f0;color:#000;" onclick="confirmPurchase(${index})">✔️ تأكيد</button>
            <button style="background:#ff0;color:#000;" onclick="saveToStock(${index})">📦 حفظ في المخزون</button>
        </td>
        `;
        tableBody.appendChild(tr);
        total += p.sellPrice * p.quantity;
    });
    totalLabel.textContent = `إجمالي سعر المجموعات: ${total}`;
}

// أزرار تأكيد وحفظ المخزون
function confirmPurchase(index){
    alert("تم تأكيد المنتج: "+achats[index].name);
}

function saveToStock(index){
    addStockToSheet(achats[index]);
    alert("تم حفظ المنتج في المخزون ✅");
}

// ============================================
// البحث في الجدول
searchInput.addEventListener("input", ()=>{
    const query = searchInput.value.toLowerCase();
    const filtered = purchases.filter(p=>
        p.name.toLowerCase().includes(query) ||
        p.date.includes(query) ||
        p.sellPrice.toString().includes(query)
    );
    renderFilteredTable(filtered);
});

function renderFilteredTable(data){
    tableBody.innerHTML = "";
    let total = 0;
    data.forEach((p,index)=>{
        const tr = document.createElement("tr");
        tr.innerHTML = `
        <td>${p.date}</td>
        <td>${p.name}</td>
        <td>${p.buyPrice}</td>
        <td>${p.sellPrice}</td>
        <td>${p.quantity}</td>
        <td>${p.expiry}</td>
        <td>${p.group}</td>
        <td>${p.subGroup}</td>
        <td>${p.image? `<img src="${p.image}" class="product-img">` : ""}</td>
        <td>
            <button style="background:#0f0;color:#000;" onclick="confirmPurchase(${index})">✔️ تأكيد</button>
            <button style="background:#ff0;color:#000;" onclick="saveToStock(${index})">📦 حفظ في المخزون</button>
        </td>
        `;
        tableBody.appendChild(tr);
        total += p.sellPrice * p.quantity;
    });
    totalLabel.textContent = `إجمالي سعر المجموعات: ${total}`;
}

// تحميل البيانات عند فتح الصفحة
renderTable();
function saveToStock(product) {
  fetch(webAppUrl, {
    method: "POST",
    body: JSON.stringify(product),
    headers: { "Content-Type": "application/json" }
  })
  .then(res => res.json())
  .then(() => alert("✅ تم الحفظ في المخزون بنجاح"));
}

const webAppUrl = "https://script.google.com/macros/s/AKfycbw0Dyq_CCQKIe51g38nhOqnADg65iZ8y-Z7fNfwtXn9j-2sphElaWt9pjjHfux0QnbPmg/exec";

function saveToStock(){
  alert("✅ الدالة تعمل");
}
