// ============================================
// ضع هنا رابط Web App الخاص بك من Google Apps Script
// مثال: 
// const webAppUrl = "https://script.google.com/macros/s/AKfycbx1234567890abcdefgHIJKLmnopQRST/exec";
const webAppUrl = "PUT_YOUR_WEB_APP_URL_HERE";

let purchases = JSON.parse(localStorage.getItem("purchases")) || [];

const purchaseForm = document.getElementById("purchaseForm");
const mainGroup = document.getElementById("mainGroup");
const subGroup = document.getElementById("subGroup");
const tableBody = document.querySelector("#purchaseTable tbody");
const totalLabel = document.getElementById("totalLabel");
const searchInput = document.getElementById("searchInput");

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
            date: document.getElementById("purchaseDate").value,
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
    fetch(webAppUrl + "?action=addPurchase", {
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
    alert("تم تأكيد المنتج: "+purchases[index].name);
}

function saveToStock(index){
    addStockToSheet(purchases[index]);
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
