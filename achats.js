const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbw0Dyq_CCQKIe51g38nhOqnADg65iZ8y-Z7fNfwtXn9j-2sphElaWt9pjjHfux0QnbPmg/exec";
const subGroups = ["Parfum","Deodorant","Shampoing","Gel Douche","Stick","Creme","Autres"];

function addRow(data = {}){
  const tbody = document.querySelector("#productTable tbody");
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td><input type="date" value="${data.date || ''}"></td>
    <td><input type="text" value="${data.nom || ''}"></td>
    <td><input type="number" step="0.01" value="${data.achat || ''}"></td>
    <td><input type="number" step="0.01" value="${data.vente || ''}"></td>
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
    <td><input type="number" value="${data.qte || ''}"></td>
    <td><button onclick="this.parentElement.parentElement.remove()">🗑</button></td>
  `;
  tbody.appendChild(tr);
  // تعيين القيمة إذا موجودة
  if(data.group) tr.children[4].firstChild.value = data.group;
  if(data.sub) { 
    tr.children[5].firstChild.style.display = (data.group=="Femme" || data.group=="Homme") ? "" : "none";
    tr.children[5].firstChild.value = data.sub || '';
  }
}

// إظهار/إخفاء المجموعة الفرعية
function updateSubGroup(select){
  const tr = select.parentElement.parentElement;
  const sub = tr.querySelector(".subGroup");
  if(select.value=="Femme" || select.value=="Homme"){
    sub.style.display = "";
  }else{
    sub.style.display = "none";
    sub.value = "";
  }
}

// حفظ كل البيانات في المخزون
function saveToStock(){
  const rows = [...document.querySelectorAll("#productTable tbody tr")];
  if(!rows.length){ alert("لا توجد منتجات"); return; }

  const items = rows.map(r=>({
    date: r.children[0].firstChild.value,
    nom: r.children[1].firstChild.value,
    achat: r.children[2].firstChild.value,
    vente: r.children[3].firstChild.value,
    group: r.children[4].firstChild.value,
    sub: r.children[5].firstChild.value,
    qte: r.children[6].firstChild.value
  }));

  fetch(WEB_APP_URL,{
    method:"POST",
    body: JSON.stringify({action:"SAVE_PURCHASES", data:items})
  })
  .then(r=>r.json())
  .then(res=>{
    if(res.success) alert("✅ تم حفظ المنتجات في المخزون بنجاح");
    else alert("❌ فشل الحفظ");
  })
  .catch(()=>alert("❌ خطأ أثناء الحفظ"));
}
