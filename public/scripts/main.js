import DT from "./data__table.js"
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.9/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.9/firebase-analytics.js";

$(window).on('load', () => {
  const firebaseConfig = {
    apiKey: "AIzaSyD1cRNA0Zq-K2FxaHeFqQol2aPH_8q8iTQ",
    authDomain: "rok-starfang-inventory.firebaseapp.com",
    databaseURL: "https://rok-starfang-inventory-default-rtdb.firebaseio.com",
    projectId: "rok-starfang-inventory",
    storageBucket: "rok-starfang-inventory.appspot.com",
    messagingSenderId: "435973148047",
    appId: "1:435973148047:web:e109b1e75762d4f849cffa",
    measurementId: "G-BRWYZL0EFX"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);

  $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
  });
  const dt = new DT('tab-table1', 'dt1');
  dt.initDT();
});