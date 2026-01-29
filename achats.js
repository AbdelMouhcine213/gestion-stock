let invoices = [];
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbw0Dyq_CCQKIe51g38nhOqnADg65iZ8y-Z7fNfwtXn9j-2sphElaWt9pjjHfux0QnbPmg/exec";

/* تحليل عدة صور */
function scanInvoices(){
  const files = document.getElementById("invoiceFiles").files;
  if(!files.length){ alert("اختر فواتير"); return; }

  [...files].forEach(file=>{
    Tesseract.recognize(file,'ara+fra+eng')
    .then(({data:{text}})=>{
      parseInvoice(text,file);
    });
  });
}

/* تحليل ذكي للفواتير */
function parseInvoice(text,file){

  // استخراج تاريخ (dd/mm/yyyy أو yyyy-mm-dd)
  const date =
    (text.match(/\d{2}\/\d{2}\/\d{4}/) ||
     text.match(/\d{4}-\d{2}-\d{2}/) ||
     [""])[0];

  // تقسيم الأسطر (عدة منتجات)
  const lines = text.split("\n").filter(l=>l.match(/\d/));

  lines.forEach(l=>{
    const nums = l.match(/\d+(\.\d+)?/g);
    if(!nums || nums.length < 2) return;

    const item = {
      name: l.replace(/[0-9\.\-]/g,"").trim(),
      price: nums[0],
      qty: nums[1] || 1,
      total: nums[nums.length-1],
      date: date,
      image: file
    };
    invoices.push(item);
    renderRow(item);
  });
}

/* رسم الجدول */
function renderRow(p){
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td><input value="${p.name}"></td>
    <td><input value="${p.price}"></td>
    <td><input value="${p.qty}"></td>
    <td><input value="${p.total}"></td>
    <td><input value="${p.date}"></td>
    <td>📷</td>
    <td><button onclick="this.parentElement.parentElement.remove()">🗑</button></td>
  `;
  document.querySelector("#resultTable tbody").appendChild(tr);
}

/* حفظ في المخزون + حفظ الصورة */
function saveToStock(){

  const rows = [...document.querySelectorAll("#resultTable tbody tr")];
  if(!rows.length){ alert("لا توجد بيانات"); return; }

  const data = rows.map(r=>({
    name:r.children[0].firstChild.value,
    achat:r.children[1].firstChild.value,
    qty:r.children[2].firstChild.value,
    total:r.children[3].firstChild.value,
    date:r.children[4].firstChild.value
  }));

  const form = new FormData();
  form.append("data",JSON.stringify(data));

  fetch(WEB_APP_URL,{method:"POST",body:form})
  .then(()=>alert("✅ تم الحفظ في المخزون"));
}
