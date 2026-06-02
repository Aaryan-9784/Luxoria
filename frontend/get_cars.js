fetch('https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&titles=Rolls-Royce_Phantom_VIII&format=json&pithumbsize=1000', {headers:{'User-Agent':'Mozilla/5.0'}})
.then(r=>r.json())
.then(d=>{
  const p = d.query.pages;
  const urls = Object.keys(p).map(k=>p[k].thumbnail?.source).filter(Boolean);
  require('fs').writeFileSync('rolls_url.txt', urls[0]);
})
.catch(e=>console.error(e));
