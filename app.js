/* ===========================================================
   NAPOLI POCKET BRIEF — app logic
   Everything below is inline data. No fetch(), no API calls,
   nothing that can break because a stone wall in Spaccanapoli
   ate your wifi signal.
=========================================================== */

// ---------------- TAB NAVIGATION ----------------
const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");
function goTo(id){
  tabs.forEach(t => t.classList.toggle("active", t.dataset.target === id));
  panels.forEach(p => p.classList.toggle("active", p.id === id));
  window.scrollTo({top:0, behavior:"instant"});
  history.replaceState(null, "", "#"+id);
}
tabs.forEach(t => t.addEventListener("click", () => goTo(t.dataset.target)));
document.querySelectorAll("[data-target]").forEach(el=>{
  if(!el.classList.contains("tab")){
    el.addEventListener("click", ()=> goTo(el.dataset.target));
  }
});
if(location.hash){ const id = location.hash.slice(1); if(document.getElementById(id)) goTo(id); }

// ---------------- OFFLINE STATUS PILL ----------------
const pill = document.getElementById("offline-pill");
function updateStatus(){
  if(navigator.onLine){
    pill.textContent = "● online — content still works offline";
    pill.className = "offline-pill online";
  } else {
    pill.textContent = "● offline — app running fine";
    pill.className = "offline-pill offline";
  }
}
window.addEventListener("online", updateStatus);
window.addEventListener("offline", updateStatus);
updateStatus();

// ---------------- SERVICE WORKER ----------------
if("serviceWorker" in navigator){
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(err => console.warn("SW failed", err));
  });
}

/* ===========================================================
   ITINERARY DATA
=========================================================== */
const itinerary = [
  {
    num:1, date:"Fri Aug 14", focus:"Arrival + easy first night",
    badges:[],
    body:`
      <p>Land 3:00pm, private transfer into town (~20–30 min). Once checked in: an easy wander through Spaccanapoli and Via San Biagio dei Librai — flat, scenic, no transport needed.</p>
      <ul>
        <li>Anyone who wants the sea: walk down to Via Toledo / Lungomare (~15–20 min)</li>
        <li>Gelato + relaxed dinner nearby. Keep expectations low — everyone's jet-lagged.</li>
        <li><strong>First sfogliatella move:</strong> Scaturchio, Piazza San Domenico Maggiore — 2 min from where you're staying, the real deal.</li>
      </ul>`
  },
  {
    num:2, date:"Sat Aug 15", focus:"Naples walk + pizza class",
    badges:[{c:"holiday", t:"Ferragosto"}],
    body:`
      <p>Morning: Santa Chiara cloister (majolica tiles) → Duomo di Napoli.</p>
      <p>Midday loop toward the sea: Spanish Quarter murals → Toledo metro (mosaic-domed "art station") → Galleria Umberto I → Palazzo Reale → Palazzo Mannajuolo spiral staircase.</p>
      <p>Evening: pizza-making class.</p>
      <ul>
        <li><strong>It's Ferragosto</strong> — Italy's biggest holiday. Many restaurants close or run skeleton crews, not just shops. Book Day 1 &amp; Day 2 dinners now.</li>
        <li>Alt sunset move: Parco Virgiliano (Posillipo) — free, near-empty even on a holiday, widest bay view in the city.</li>
      </ul>`
  },
  {
    num:3, date:"Sun Aug 16", focus:"Capri + Blue Grotto",
    badges:[{c:"book", t:"Book Today"}],
    body:`
      <p>Early hydrofoil from Molo Beverello (~40 min) — Blue Grotto is genuinely weather-dependent (closes on rough seas / high tide), so morning isn't just about crowds.</p>
      <ul>
        <li><strong>Book both directions now</strong> — return sailings sell out in August.</li>
        <li>Sea questionable morning-of? Call Capri info office <a href="tel:+390813776836">+39 081 3776836</a> before heading to the port.</li>
        <li>Seasick-prone? Ask for a single-hulled boat over a catamaran.</li>
        <li>After the Grotto: Anacapri chairlift, Capri town, Faraglioni.</li>
      </ul>`
  },
  {
    num:4, date:"Mon Aug 17", focus:"MANN museum + concert",
    badges:[],
    body:`
      <p>Morning: MANN — the actual mosaics/frescoes/bronzes removed from Pompeii. Great primer before Day 5.</p>
      <p>Afternoon: genuinely relaxed — Posillipo/Marechiaro for a swim off the rocks (less touristed than Chiaia).</p>
      <p>Evening: Vivaldi's Four Seasons at Chiesa di Santa Maria la Nova (~80 min, strings quintet + harpsichord).</p>`
  },
  {
    num:5, date:"Tue Aug 18", focus:"Pompeii — the heat day",
    badges:[{c:"heat", t:"Heat Risk"}],
    body:`
      <p>Circumvesuviana train from Napoli Centrale to Pompei Scavi (~35 min), 5 min walk to entrance.</p>
      <ul>
        <li><strong>Forecast: 89–93°F, near-zero shade across 170 acres.</strong> Get the earliest reasonable departure — this also dodges the packed 8am pickpocket-heavy train.</li>
        <li>Target on-site and moving by 8:30–9am. Aim to be in shaded/indoor areas (Baths, Forum) by 1pm.</li>
        <li>"Pompeii for All" accessible route has more shade + rest points if anyone needs an easier stretch.</li>
        <li>A guide earns its cost here — turns rubble into a story for kids.</li>
        <li>Water, hats, sunscreen for everyone. Watch younger kids for early heat exhaustion: flushed/pale skin, headache, nausea, unusual quietness.</li>
      </ul>`
  },
  {
    num:6, date:"Wed Aug 19", focus:"Amalfi Coast — private boat day",
    badges:[{c:"book", t:"Book Today"}],
    body:`
      <p>Transfer to Sorrento, board private skippered boat — Positano, Amalfi, Praiano, swim stops at Li Galli islets / Emerald Grotto.</p>
      <ul>
        <li><strong>Highest-priority booking on the whole trip</strong> — €800–1,500, tight August availability, unbooked as of the source itinerary.</li>
        <li>Confirm cancellation policy and the weather contingency before paying in full.</li>
        <li>Confirm properly-sized kid life jackets are supplied — not "adult, close enough."</li>
      </ul>`
  },
  {
    num:7, date:"Thu Aug 20", focus:"Departure",
    badges:[],
    body:`<p>Relaxed morning shaped around the flight — last pastries, final shopping, airport.</p>`
  }
];

const itinList = document.getElementById("itin-list");
itinerary.forEach(day => {
  const badgesHtml = day.badges.map(b => `<span class="badge ${b.c}">${b.t}</span>`).join("");
  const item = document.createElement("div");
  item.className = "accordion-item";
  item.innerHTML = `
    <button class="accordion-head">
      <span class="day-num">${String(day.num).padStart(2,"0")}</span>
      <span class="day-meta">
        <span class="day-date">${day.date}</span>
        <span class="day-focus">${day.focus}</span>
        <div>${badgesHtml}</div>
      </span>
      <span class="chev">▾</span>
    </button>
    <div class="accordion-body"><div class="accordion-body-inner">${day.body}</div></div>
  `;
  item.querySelector(".accordion-head").addEventListener("click", () => {
    item.classList.toggle("open");
  });
  itinList.appendChild(item);
});

/* ===========================================================
   SAFETY / SCAM DATA — three narrator voices
=========================================================== */
const scams = [
  {
    ic:"💩", title:"The Bird Poop Scam",
    body:"A stranger points out something on your jacket (mustard, ketchup, \"bird droppings\") and rushes to help clean it. While they're \"helping,\" an accomplice lifts your wallet or phone.",
    action:"If a stranger is suddenly very concerned about your shoulder, walk away first, check yourself second.",
    voice:{
      tio:"Mijo, nobody who truly loves you shows up out of nowhere with a napkin. Your tía taught you better than this. Keep walking.",
      millennial:"This is basically a phishing email but IRL. Someone's weirdly invested in your jacket? Hard block, keep it moving.",
      gringo:"Sir, I did not consent to a complimentary shoulder inspection. We're leaving."
    }
  },
  {
    ic:"🗺️", title:"The Map / Distraction Trick",
    body:"Someone holds up a map or asks an oddly specific question while a partner works your bag or pockets.",
    action:"Check maps while stationary against a wall or in a doorway — not mid-stride at a curb.",
    voice:{
      tio:"If a stranger needs YOUR help reading a map in the middle of a crowd, mijo, that's not a coincidence, that's a setup.",
      millennial:"Bro asking for directions has main character energy and I do not trust it. Keep your hands on your bag.",
      gringo:"I would love to help you find the Colosseum, random man, but this is Naples and also no."
    }
  },
  {
    ic:"📱", title:"Phone Snatching",
    body:"Increasingly common: someone grabs the phone straight out of your hand while you're looking at Google Maps.",
    action:"Grip it, keep it low when checking directions, or step into a shop doorway first.",
    voice:{
      tio:"You paid how much for that phone and you're holding it out like an offering? Put it away. Look up, not down, when you walk.",
      millennial:"Losing your phone here means losing your whole group chat AND your boarding pass. Absolutely not. Grip it like it's the last charger in the airport.",
      gringo:"Ope, just gonna scoot past you and steal your phone, no worries — actually, huge worries, hold on tight."
    }
  },
  {
    ic:"🚕", title:"The Taxi / Tour Upsell",
    body:"A driver quotes double the fixed rate, or a \"confirmed\" day-tour price balloons at the end of the day.",
    action:"Insist on the posted fixed rate ('tariffa predeterminata') before getting in. Get any private tour price in writing/text first.",
    voice:{
      tio:"Never agree to a price with just a handshake and a smile, m'ijo. Get it in writing or don't get in the car. This is not negotiable.",
      millennial:"No deposit, no contract, no ride. This is the group chat rule and the taxi rule.",
      gringo:"I'm going to need that in an email, please. Actually just text it to me, this is Italy, let's be reasonable."
    }
  },
  {
    ic:"🚆", title:"Circumvesuviana to Pompeii",
    body:"The single most pickpocket-dense train ride in southern Italy — especially the crowded 8am departure.",
    action:"Bag on your front when boarding. Hand resting on it the whole ride. Take the earliest reasonable departure to dodge the crush.",
    voice:{
      tio:"On a packed train, your bag goes in front like a baby you're carrying — not behind you where you can't see it.",
      millennial:"This train has main character energy for thieves specifically. Bag on the front, main character energy for you instead.",
      gringo:"This is basically the NYC subway at rush hour except everyone's headed to see a volcano. Bag up front, folks."
    }
  },
  {
    ic:"🎉", title:"Ferragosto Closures (Aug 15)",
    body:"Italy's biggest mid-August holiday. Many restaurants close entirely or run reduced hours — not just shops.",
    action:"Book Day 1 and Day 2 dinners now, not day-of.",
    voice:{
      tio:"Everybody's version of Sunday, but bigger. If you didn't call ahead, you go hungry — same rule as visiting your abuela without calling first.",
      millennial:"Ferragosto is Italy collectively logging off. Respect the boundary, book your table in advance.",
      gringo:"Cool, cool, it's basically everyone's Fourth of July at once and we did not get the group text."
    }
  }
];

const voiceLabels = {tio:"🧓 Tío says", millennial:"📱 Millennial take", gringo:"🦅 Gringo translation"};
let currentVoice = localStorage.getItem("napoli-voice") || "tio";

function renderScams(){
  const list = document.getElementById("scam-list");
  list.innerHTML = "";
  scams.forEach(s => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="card-top"><span class="card-ic">${s.ic}</span><span class="card-title">${s.title}</span></div>
      <div class="card-body">${s.body}</div>
      <div class="card-voice">${voiceLabels[currentVoice]}: ${s.voice[currentVoice]}</div>
      <div class="card-action">✅ ${s.action}</div>
    `;
    list.appendChild(card);
  });
}
document.querySelectorAll(".voice-btn").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    document.querySelectorAll(".voice-btn").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    currentVoice = btn.dataset.voice;
    localStorage.setItem("napoli-voice", currentVoice);
    renderScams();
  });
});
document.querySelector(`.voice-btn[data-voice="${currentVoice}"]`)?.classList.add("active");
document.querySelectorAll(".voice-btn").forEach(b=>{
  if(b.dataset.voice !== currentVoice) b.classList.remove("active");
});
renderScams();

/* ===========================================================
   SOS / EMERGENCY CONTACTS
=========================================================== */
const sosData = [
  {ic:"🚨", title:"Emergency — All Services", body:"Works from any phone, even without a SIM or credit. Save this even if you save nothing else.",
   rows:[["Call", "112", "tel:112"]]},
  {ic:"🇺🇸", title:"U.S. Consulate General Naples", body:"Piazza della Repubblica, 80122 Napoli. Mon–Fri 8:00am–5:00pm — this line also covers after-hours emergencies (arrest, death, injury) for anyone in the Naples consular district.",
   rows:[["Call", "081-583-8111", "tel:+390815838111"], ["Email", "uscitizensnaples@state.gov", "mailto:uscitizensnaples@state.gov"], ["Map", "Open in Maps", "https://maps.google.com/?q=Piazza+della+Repubblica+U.S.+Consulate+Naples"]]},
  {ic:"🇲🇽", title:"Mexican Consulate — Naples", body:"Via Tasso 480, 80127 Napoli. Right in the city — no need to go to Rome for routine issues.",
   rows:[["Call", "+39 81 2462 036", "tel:+390812462036"], ["Map", "Open in Maps", "https://maps.google.com/?q=Via+Tasso+480+Napoli+Consulado+Mexico"]]},
  {ic:"🇲🇽", title:"Mexican Embassy — Rome", body:"Via Lazzaro Spallanzani 16, 00161 Rome. For passport / major issues.",
   rows:[["Call", "+39 06 4416 061", "tel:+390644416061"]]},
  {ic:"🏥", title:"Nearest Hospitals", body:"Ospedale Cardarelli — largest hospital in southern Italy, full ER. Ospedale dei Pellegrini — closer to Spaccanapoli, good for non-critical needs.",
   rows:[["Map", "Cardarelli", "https://maps.google.com/?q=Ospedale+Cardarelli+Napoli"], ["Map", "Pellegrini", "https://maps.google.com/?q=Ospedale+dei+Pellegrini+Napoli"]]},
  {ic:"📋", title:"STEP Enrollment", body:"Smart Traveler Enrollment Program — free, gets you real alerts if anything regional develops during your week. Do this before you fly, needs signal once.",
   rows:[["Web", "step.state.gov", "https://step.state.gov"]]}
];
const sosList = document.getElementById("sos-list");
sosData.forEach(item=>{
  const card = document.createElement("div");
  card.className = "card";
  const rows = item.rows.map(r=>`<div class="sos-row"><span class="sos-label">${r[0]}</span><a href="${r[2]}">${r[1]}</a></div>`).join("");
  card.innerHTML = `
    <div class="card-top"><span class="card-ic">${item.ic}</span><span class="card-title">${item.title}</span></div>
    <div class="card-body">${item.body}</div>
    ${rows}
  `;
  sosList.appendChild(card);
});

/* ===========================================================
   TRANSPORT
=========================================================== */
const transportData = [
  {ic:"🚕", title:"Airport Taxi — Fixed Rates (2026)",
   body:`Rates are posted on a board at the official rank outside arrivals. Insist on the printed <strong>"tariffa predeterminata"</strong> and agree before getting in. Ignore any driver who claims not to know it.`,
   table:[["Centro Storico / Central Station","~€18"],["Molo Beverello (Capri ferries)","~€21"],["Lungomare hotel area","~€25"]]},
  {ic:"🚌", title:"Alibus Airport Shuttle",
   body:"Cheaper and reliable (~€5). Worth it if you're not luggage-heavy and want a no-drama option. Stops at both Central Station and Molo Beverello.", table:null},
  {ic:"⛴️", title:"Capri Ferry / Hydrofoil Weather Rules",
   body:"When seas are rough, hydrofoils are suspended first; ferries (slower, more stable) usually keep running. If in doubt morning-of, call the Capri info office before heading to the port.",
   table:null, extra:`<a class="maps-link" href="tel:+390813776836">📞 Call Capri Info Office</a>`},
  {ic:"🚦", title:"Crossing the Street",
   body:"Neapolitan drivers and scooters don't reliably yield. Cross with purpose, in a group, making eye contact with drivers. Never jaywalk while distracted, and never hesitate mid-crossing — that's when you get clipped.", table:null},
  {ic:"🚫", title:"No Uber / Bolt Street-Hails",
   body:"Ride-share apps are effectively non-functional for street hails in Naples. It's taxi (fixed rate) or Alibus — that's the real menu.", table:null}
];
const transportList = document.getElementById("transport-list");
transportData.forEach(item=>{
  const card = document.createElement("div");
  card.className = "card";
  let tableHtml = "";
  if(item.table){
    tableHtml = `<table class="rate-table">${item.table.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join("")}</table>`;
  }
  card.innerHTML = `
    <div class="card-top"><span class="card-ic">${item.ic}</span><span class="card-title">${item.title}</span></div>
    <div class="card-body">${item.body}</div>
    ${tableHtml}
    ${item.extra || ""}
  `;
  transportList.appendChild(card);
});

/* ===========================================================
   HIDDEN GEMS
=========================================================== */
const gems = [
  {ic:"🌅", title:"Parco Virgiliano", tag:"Free",
   body:"Posillipo promontory. Widest panoramic view of the whole bay — Vesuvius, Capri, Ischia in one frame. Open from dawn, near-zero tourists even on Ferragosto.",
   coords:"40.7998,14.1836"},
  {ic:"⛪", title:"Rione Sanità", tag:"Free to walk",
   body:"Once considered off-limits, now revitalized: catacombs, street art, some of the best street food in the city. Daytime visit is completely fine.",
   coords:"40.8590,14.2465"},
  {ic:"🛣️", title:"Tredici Discese / Il Petraio", tag:"Free",
   body:"Zigzagging hillside road locals call Naples' answer to Lombard Street. Great views — walk it, don't drive it.",
   coords:"40.8420,14.2280"},
  {ic:"🕳️", title:"Bourbon Tunnel", tag:"Ticketed",
   body:"Underground WWII bunker network beneath the city. Built-in escape from the heat if the kids need an indoor break mid-trip.",
   coords:"40.8362,14.2434"},
  {ic:"🍰", title:"Scaturchio (Real Sfogliatella)", tag:"Cheap",
   body:"Piazza San Domenico Maggiore, 2 min from Via Francesco Saverio Gargiulo. Skip the tourist-strip bakery version.",
   coords:"40.8494,14.2557"}
];
const gemsList = document.getElementById("gems-list");
gems.forEach(g=>{
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <div class="card-top"><span class="card-ic">${g.ic}</span><span class="card-title">${g.title}</span><span class="badge tip" style="margin-left:auto">${g.tag}</span></div>
    <div class="card-body">${g.body}</div>
    <div style="font-size:12px;color:#6b665c;margin-top:6px">📍 ${g.coords} (works offline in any GPS/offline-maps app)</div>
    <a class="maps-link" href="https://maps.google.com/?q=${g.coords}" target="_blank" rel="noopener">Open in Maps</a>
  `;
  gemsList.appendChild(card);
});

/* ===========================================================
   PHRASES
=========================================================== */
const phrases = [
  ["Quanto costa?", "KWAN-toh KOS-tah", "How much does it cost?"],
  ["Il conto, per favore", "eel KON-toh, pair fah-VOH-reh", "The check, please"],
  ["Dov'è il bagno?", "doh-VEH eel BAHN-yoh", "Where's the bathroom?"],
  ["Non parlo italiano", "non PAR-loh ee-tal-YAH-noh", "I don't speak Italian"],
  ["Aiuto!", "eye-OO-toh", "Help!"],
  ["Chiamate un medico", "kya-MAH-teh oon MEH-dee-koh", "Call a doctor"],
  ["Dove siamo?", "DOH-veh SYAH-moh", "Where are we?"],
  ["Ho perso il passaporto", "oh PEHR-soh eel pas-sah-POR-toh", "I lost my passport"]
];
const phraseList = document.getElementById("phrase-list");
phrases.forEach(p=>{
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <div class="phrase-it">${p[0]}</div>
    <div class="phrase-phon">${p[1]}</div>
    <div class="card-body" style="margin-top:4px">${p[2]}</div>
  `;
  phraseList.appendChild(card);
});
const tipCard = document.createElement("div");
tipCard.className = "card";
tipCard.innerHTML = `<div class="card-top"><span class="card-ic">💶</span><span class="card-title">Tipping</span></div>
<div class="card-body">Not obligatory like the U.S. Rounding up or leaving 5–10% for great service is generous and appreciated. Many sit-down places already add "coperto" (cover charge) — that's normal, not a scam.</div>`;
phraseList.appendChild(tipCard);

/* ===========================================================
   SIGNAL / CONNECTIVITY REALITY CHECK
=========================================================== */
const signalData = [
  {ic:"📵", title:"US Carrier Roaming — the Trap",
   body:"Verizon/AT&T/T-Mobile roaming in Italy is often either pay-per-use (expensive fast) or requires an international day-pass add-on. Check your plan's fine print before you land, not after a surprise bill.",
   fix:"Fix: enable your carrier's international pass, OR get an EU eSIM (Airalo, Holafly, etc.) — install it while still on home wifi, before you fly. Activating an eSIM needs a data connection the first time only."},
  {ic:"🧱", title:"Centro Storico Stone Walls Eat Wifi",
   body:"The historic center is old, thick stone construction. Hotel/apartment wifi signal can be inconsistent room to room, and public wifi is spotty and often behind a login wall requiring email/phone verification.",
   fix:"Fix: don't count on being able to look anything up mid-street. This app is built specifically so you don't have to."},
  {ic:"🔌", title:"Power / Plugs",
   body:"Italy uses Type C/F/L plugs at 230V. Most phone/laptop chargers are dual-voltage already (check the fine print on the brick), but you still need a physical adapter, not a converter.",
   fix:"Fix: pack a multi-standard EU adapter, one per person if charging overnight matters to the group."},
  {ic:"🗺️", title:"Offline Maps — Do This Before You Fly",
   body:"Google Maps and Apple Maps both let you download an offline region. Do this at home on real wifi, not at the airport gate.",
   fix:"Fix: download offline map areas for Naples, Capri, Pompeii, and the Amalfi Coast before departure."},
  {ic:"📲", title:"How This App Solves All of That",
   body:"This is a Progressive Web App. Once you open it one time with any connection (home wifi, hotel wifi, airport) and it finishes loading, every page, every phone number, every coordinate is cached on your device. After that it needs zero signal, forever, on this trip or the next one.",
   fix:"Do this now: tap your browser's menu → \"Add to Home Screen\" / \"Install App.\" It'll behave like a real app icon from then on."}
];
const signalList = document.getElementById("signal-list");
signalData.forEach(item=>{
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <div class="card-top"><span class="card-ic">${item.ic}</span><span class="card-title">${item.title}</span></div>
    <div class="card-body">${item.body}</div>
    <div class="card-action">${item.fix}</div>
  `;
  signalList.appendChild(card);
});
