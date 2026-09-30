import fs from 'node:fs';
const targets = await (await fetch('http://127.0.0.1:9222/json')).json();
const target = targets.find(x => x.type === 'page' && /127\.0\.0\.1:417[34]/.test(x.url));
if (!target) throw new Error('Headless Edge page not found');
const ws = new WebSocket(target.webSocketDebuggerUrl);
let seq = 0;
const pending = new Map();
ws.addEventListener('message', ({data}) => {
  const msg = JSON.parse(data);
  if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); }
});
await new Promise((resolve, reject) => { ws.addEventListener('open', resolve, {once:true}); ws.addEventListener('error', reject, {once:true}); });
const cdp = (method, params={}) => new Promise(resolve => { const id=++seq; pending.set(id,resolve); ws.send(JSON.stringify({id,method,params})); });
await cdp('Page.navigate',{url:'http://127.0.0.1:4174/'});
await new Promise(r=>setTimeout(r,800));
const evaluate = async expression => (await cdp('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true})).result.result.value;
for (const width of [360,390,768,1440]) {
  await cdp('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<=768});
  await new Promise(r=>setTimeout(r,350));
  const data=await evaluate(`({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,bodyWidth:document.body.scrollWidth,broken:[...document.images].filter(i=>i.src&&i.complete&&i.naturalWidth===0).map(i=>i.src),gallery:[...document.querySelectorAll('#galeria-ambientes figure')].map(f=>f.hidden),hero:document.querySelector('.lm-hero img')?.naturalWidth})`);
  console.log(JSON.stringify({width,...data}));
  if (width===390) { const shot=await cdp('Page.captureScreenshot',{format:'png',captureBeyondViewport:false}); fs.writeFileSync('C:/Users/morai/AppData/Local/Temp/lemura-home-390.png',Buffer.from(shot.result.data,'base64')); }
}
await cdp('Emulation.setDeviceMetricsOverride',{width:390,height:900,deviceScaleFactor:1,mobile:true});
const interactions=await evaluate(`(() => {const more=document.querySelector('.lm-ambientes__mais');more.click();const revealed=[...document.querySelectorAll('#galeria-ambientes figure')].filter(f=>!f.hidden).length;const opener=document.querySelector('#galeria-ambientes figure button');opener.focus();opener.click();const dialog=document.querySelector('.lm-galeria__dialog');const opened=dialog.open;dialog.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));const count=dialog.querySelector('.lm-galeria__contador').textContent;dialog.close();return {revealed,opened,count,focusRestored:document.activeElement===opener};})()`);
console.log(JSON.stringify({interaction:interactions}));
await evaluate(`document.querySelector('#ambientes').scrollIntoView({block:'start'})`);
await new Promise(r=>setTimeout(r,350));
const galleryShot=await cdp('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
fs.writeFileSync('C:/Users/morai/AppData/Local/Temp/lemura-gallery-390.png',Buffer.from(galleryShot.result.data,'base64'));
await cdp('Emulation.clearDeviceMetricsOverride');
ws.close();
