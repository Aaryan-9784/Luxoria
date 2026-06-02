fetch('https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&titles=Lamborghini_Aventador%7CRolls-Royce_Phantom_VIII%7CRange_Rover&format=json&pithumbsize=1000', {headers:{'User-Agent':'Mozilla/5.0'}})
.then(r=>r.json())
.then(d=>{
  const p = d.query.pages;
  console.log(Object.keys(p).map(k=>p[k].thumbnail?.source).filter(Boolean).join('\n'));
})
.catch(e=>console.error(e));
