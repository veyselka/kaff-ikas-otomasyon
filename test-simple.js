// BASIT TEST CONTENT SCRIPT
console.log("=================================");
console.log("🔥 TEST SCRIPT YÜKLENDI!");
console.log("URL:", window.location.href);
console.log("Zaman:", new Date().toLocaleTimeString());
console.log("=================================");

// Modül kontrolü
setTimeout(() => {
    console.log("ReactHelper var mı?", typeof window.ReactHelper);
    console.log("DOMFinder var mı?", typeof window.DOMFinder);
}, 1000);
