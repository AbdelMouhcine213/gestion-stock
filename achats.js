const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbw0Dyq_CCQKIe51g38nhOqnADg65iZ8y-Z7fNfwtXn9j-2sphElaWt9pjjHfux0QnbPmg/exec";

let imageBase64 = "";
let imageUrl = "";

/* ===============================
   تحميل الصورة + تحليل تلقائي
================================ */
document.getElementById("imageInput").addEventListener("change", e => {
  const file = e.target.files[0];
  if(!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const base64 = reader.result.split(",")[1];
    imageBase64 = base64;
    document.getElementById("preview").src = reader.result;
    analyzeFacture();
  };
  reader.readAsDataURL(file);
});

/* ===============================
   OCR تلقائي
================================ */
function analyzeFacture(){
  document.getElementById("status").innerText = "⏳ تحليل الفاتورة...";

  fetch(WEB_APP_URL, {
    method:"POST",
    body: JSON.stringify({
      action:"OCR_FACTURE",
      imageBase64:imageBase64
    })
  })
  .then(r=>r.json())
  .then(res=>{
    imageUrl = res.imageUrl || "";
    const d = res.extracted || {};

    document.getElementById("nom").value   = d.nom || "";
    document.getElementById("achat").value = d.achat || "";
    document.getElementById("qte").value   = d.qte || "";
    document.getElementById("total").value = d.total || "";
    document.getElementById("date").value  = d.date || "";

    document.getElementById("status").innerText = "✅ تم التحليل";
  })
  .catch(()=>{
    document.getElementById("status").innerText = "❌ خطأ في التحليل";
  });
}

/* ===============================
   تأكيد و حفظ
================================ */
function confirmFacture(){

  const item = {
    nom: document.getElementById("nom").value,
    achat: document.getElementById("achat").value,
    qte: document.getElementById("qte").value,
    total: document.getElementById("total").value
  };

  fetch(WEB_APP_URL,{
    method:"POST",
    body: JSON.stringify({
      action:"CONFIRM_FACTURE",
      date: document.getElementById("date").value,
      imageUrl:imageUrl,
      items:[item]
    })
  })
  .then(r=>r.json())
  .then(()=>{
    alert("✅ تم حفظ الفاتورة و الإضافة للمخزون");
    location.reload();
  })
  .catch(()=>{
    alert("❌ فشل الحفظ");
  });
}
