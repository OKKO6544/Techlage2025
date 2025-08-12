```javascript
// Simple JSON-driven dynamic site for TechLage

async function fetchJSON(path) {
  try {
    const r = await fetch(path + '?cachebust=' + Date.now());
    if (!r.ok) throw new Error(`HTTP ${r.status} ${r.statusText}`);
    return await r.json();
  } catch (e) {
    console.error('Fetch error', path, e);
    return null;
  }
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
document.addEventListener('DOMContentLoaded', () => {
    loadLeaderboard();
    loadSchedule();
    loadGallery();
    loadTicker();
    setInterval(() => {
        loadLeaderboard();
        loadSchedule();
        loadGallery();
        loadTicker();
    }, 20000);
});




---


