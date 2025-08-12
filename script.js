```javascript
// Simple JSON-driven dynamic site for TechLage

async function fetchJSON(path){
  try{const r=await fetch(path+'?cachebust='+Date.now()); return await r.json()}catch(e){console.error('Fetch error',path,e);return null}
}

function makeRow(rank,item){
  return `<tr><td>${rank}</td><td>${item.house}</td><td>${item.points}</td></tr>`;
}

async function loadLeaderboard(){
  const data = await fetchJSON('leaderboard.json');
  if(!data) return;
  const tech = data.techlage || [];
  const ann = data.annual || [];
  document.getElementById('techlage-body').innerHTML = tech.map((it,i)=>makeRow(i+1,it)).join('');
  document.getElementById('annual-body').innerHTML = ann.map((it,i)=>makeRow(i+1,it)).join('');
}

async function loadSchedule(){
  const data = await fetchJSON('schedule.json');
  if(!data) return;
  const el = document.getElementById('schedule-body');
  el.innerHTML = data.map(it=>{
    const cls = it.status && it.status.toLowerCase().includes('live')? 'live':'';
    return `<tr><td>${it.event}</td><td>${it.time}</td><td>${it.location}</td><td class="${cls}">${it.status||''}</td></tr>`;
  }).join('');
}

async function loadGallery(){
  const data = await fetchJSON('gallery.json');
  if(!data) return;
  const el = document.getElementById('gallery-grid');
  el.innerHTML = data.map(url=>`<img src="${url}" alt="TechLage photo">`).join('');
}

async function loadTicker(){
  const data = await fetchJSON('ticker.json');
  const el = document.getElementById('ticker');
  if(!data || !data.length){el.textContent='No announcements yet.';return}
  el.textContent = data[0]; // show first message; you can rotate later
}

// init
loadLeaderboard(); loadSchedule(); loadGallery(); loadTicker();

// simple auto-refresh every 20s (for live edits)
setInterval(()=>{loadLeaderboard();loadSchedule();loadGallery();loadTicker()},20000);
```

---

## leaderboard.json (example)

```json
{
  "techlage": [
    { "house": "Hercules", "points": 85 },
    { "house": "Caesar", "points": 78 },
    { "house": "Poseidon", "points": 72 },
    { "house": "Phoenix", "points": 65 }
  ],
  "annual": [
    { "house": "Caesar", "points": 225 },
    { "house": "Hercules", "points": 215 },
    { "house": "Phoenix", "points": 210 },
    { "house": "Poseidon", "points": 205 }
  ]
}
```

---

## schedule.json (example)

```json
[
  { "event": "Meme Court", "time": "09:00 AM", "location": "Hall A", "status": "Live Now" },
  { "event": "Knowledge Grid", "time": "11:00 AM", "location": "Lab 1", "status": "Upcoming" },
  { "event": "Innovation Fish Tank", "time": "01:00 PM", "location": "Hall B", "status": "Upcoming" },
  { "event": "Escape Room", "time": "03:00 PM", "location": "Room 5", "status": "Upcoming" }
]
```

---

## gallery.json (example)

```json
[
  "images/photo1.jpg",
  "images/photo2.jpg",
  "images/photo3.jpg"
]
```

---

## ticker.json (optional quick announcements)

```json
[
  "Phoenix wins Innovation Breakthrough (+5)",
  "Meme Court finals starting in Hall A",
  "Vote now for Crowd Favourite via the main page"
]
```