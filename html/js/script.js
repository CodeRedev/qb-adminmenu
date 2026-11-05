'use strict';

const copyToClipboard = (str) => {
    const el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
};

const RES = typeof GetParentResourceName === 'function' ? GetParentResourceName() : null;
const post = (action, data) => RES
    ? fetch(`https://${RES}/${action}`, { method: 'POST', headers: { 'Content-Type': 'application/json; charset=UTF-8' }, body: JSON.stringify(data || {}) }).then(r => r.json()).catch(() => ({}))
    : dev(action, data);

const ICONS={
 shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
 users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
 server:'<rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><path d="M6 6h.01M6 18h.01"/>',
 car:'<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>',
 pill:'<path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/>',
 code:'<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',
 video:'<path d="m22 8-6 4 6 4V8Z"/><rect x="2" y="6" width="14" height="12" rx="2"/>',
 heart:'<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/>',
 eyeoff:'<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.53 13.53 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><path d="m2 2 20 20"/>',
 eye:'<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
 zap:'<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
 tag:'<path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><path d="M7 7h.01"/>',
 pin:'<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
 crosshair:'<circle cx="12" cy="12" r="10"/><path d="M22 12h-4M6 12H2M12 6V2M12 22v-4"/>',
 skull:'<circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><path d="M8 20v2h8v-2"/><path d="M16 20a2 2 0 0 0 1.56-3.25 8 8 0 1 0-11.12 0A2 2 0 0 0 8 20"/>',
 lock:'<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
 nav:'<polygon points="3 11 22 2 13 21 11 13 3 11"/>',
 down:'<path d="M12 17V3M6 11l6 6 6-6M19 21H5"/>',
 box:'<path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5M12 22V12"/>',
 shirt:'<path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>',
 logout:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
 ban:'<circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/>',
 key:'<circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6M15.5 7.5l3 3L22 7l-3-3"/>',
 search:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
 left:'<path d="m15 18-6-6 6-6"/>',right:'<path d="m9 18 6-6-6-6"/>',
 x:'<path d="M18 6 6 18M6 6l12 12"/>',check:'<path d="M20 6 9 17l-5-5"/>',
 copy:'<rect x="8" y="8" width="14" height="14" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
 sunrise:'<path d="M12 2v8M4.93 10.93l1.41 1.41M2 18h2M20 18h2M19.07 10.93l-1.41 1.41M22 22H2M8 6l4-4 4 4M16 18a4 4 0 0 0-8 0"/>',
 cloudsun:'<path d="M12 2v2M4.93 4.93l1.41 1.41M20 12h2M19.07 4.93l-1.41 1.41M15.95 12.65a4 4 0 0 0-5.93-4.13M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z"/>',
 cloud:'<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>',
 fog:'<path d="M4 14.9A7 7 0 1 1 15.7 8h1.8a4.5 4.5 0 0 1 2.5 8.2"/><path d="M16 17H7M17 21H9"/>',
 rain:'<path d="M4 14.9A7 7 0 1 1 15.7 8h1.8a4.5 4.5 0 0 1 2.5 8.2"/><path d="M16 14v6M8 14v6M12 16v6"/>',
 bolt:'<path d="M6 16.3A7 7 0 1 1 15.7 8h1.8a4.5 4.5 0 0 1 2.5 8.2"/><path d="m13 12-3 5h4l-3 5"/>',
 snow:'<path d="M2 12h20M12 2v20m7.07-17.07-14.14 14.14m0-14.14 14.14 14.14"/>',
 wind:'<path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2M9.6 4.6A2 2 0 1 1 11 8H2M12.6 19.4A2 2 0 1 0 14 16H2"/>',
 ghost:'<path d="M9 10h.01M15 10h.01M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z"/>',
 clock:'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
 wrench:'<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
 dollar:'<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
 trash:'<path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6"/>',
 rocket:'<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
 compass:'<circle cx="12" cy="12" r="10"/><path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z"/>',
 terminal:'<path d="m4 17 6-6-6-6M12 19h8"/>',
 monitor:'<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>',
 gauge:'<path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/>',
 scan:'<path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/><circle cx="12" cy="12" r="3"/>',
 walk:'<circle cx="12" cy="5" r="1.5"/><path d="m9 20 3-6 3 6M6 8l6 2 6-2M12 10v4"/>'
};
const ic=(n,c='')=>`<svg class="ico ${c}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n]||''}</svg>`;
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const $=(s,r=document)=>r.querySelector(s);

const NAV=[
 {id:'admin',ic:'shield',label:'Admin Options',desc:'Personal admin tools'},
 {id:'players',ic:'users',label:'Players',desc:'Manage online players'},
 {id:'server',ic:'server',label:'Server',desc:'Weather and time'},
 {id:'vehicles',ic:'car',label:'Vehicles',desc:'Spawn and modify'},
 {id:'dealers',ic:'pill',label:'Dealers',desc:'Existing dealers'},
 {id:'dev',ic:'code',label:'Developer',desc:'Coords and debug'}
];
const WEATHER=[['EXTRASUNNY','Extra Sunny',"I'm Melting!",'sun'],['CLEAR','Clear','The Perfect Day!','sunrise'],['NEUTRAL','Neutral','Just A Regular Day!','cloudsun'],['SMOG','Smog','Smoke Machine!','wind'],['FOGGY','Foggy','Smoke Machine x2!','fog'],['OVERCAST','Overcast','Not Too Sunny!','cloud'],['CLOUDS','Clouds',"Where's The Sun?",'cloud'],['CLEARING','Clearing','Clouds Start To Clear!','cloudsun'],['RAIN','Rain','Make It Rain!','rain'],['THUNDER','Thunder','Run and Hide!','bolt'],['SNOW','Snow','Is It Cold Out Here?','snow'],['BLIZZARD','Blizzard','Snow Machine?','snow'],['SNOWLIGHT','Light Snow','Starting To Feel Like Christmas!','snow'],['XMAS','Heavy Snow (XMAS)','Snowball Fight!','snow'],['HALLOWEEN','Halloween','What Was That Noise?!','ghost']];
const TOGLABEL={noclip:'NoClip',invisible:'Invisible',god:'Godmode',names:'Names',blips:'Blips',coords:'Display coords',vehdev:'Vehicle dev mode',huddev:'HUD dev mode',evfree:'Freeaim mode',evveh:'Display vehicles',evped:'Display peds',evobj:'Display objects'};
const PACT={kill:'Killed',revive:'Revived',freeze:'Toggled freeze on',spectate:'Spectating',goto:'Teleported to',bring:'Brought',intovehicle:'Entered the vehicle of',inventory:'Opened the inventory of',cloth:'Opened the clothing menu for'};
const PARENT={player:null,weapons:null,'player/ban':'player','player/kick':'player','player/perms':'player',vcats:null,vmodels:'vcats',dealer:null};

let LABELS={up:'↑',down:'↓',left:'←',right:'→',select:'↵',back:'⌫'};
let SECTIONS={};
let WEAPONS=[],VEHICLES=[];
let BANLEN=[['1 hour','3600'],['1 day','86400'],['1 week','604800'],['Permanent','99999999999']];
let GROUPS=[{value:'user',label:'User',desc:''},{value:'admin',label:'Admin',desc:''},{value:'god',label:'God',desc:''}];
let PLAYERS=[],DEALERS=[],pLoaded=false,dLoaded=false;

const S={open:false,sec:null,sub:null,pid:null,dname:null,q:'',weather:null,hour:12,clock:12,vcat:'',evDist:10,dock:'right',editor:null,
 tog:{noclip:false,invisible:false,god:false,names:false,blips:false,coords:false,vehdev:false,huddev:false,evfree:false,evveh:false,evped:false,evobj:false},
 ban:{reason:'',len:null,custom:'',err:false},kick:{reason:'',err:false},group:null};
const player=()=>PLAYERS.find(p=>p.id===S.pid);
const initials=n=>String(n).split(' ').filter(Boolean).map(w=>w[0]).slice(0,2).join('').toUpperCase()||'?';
const hh=h=>String(h).padStart(2,'0')+':00';
const navList=()=>NAV.filter(n=>SECTIONS[n.id]!==false);

let tt;function toast(msg,kind){const t=$('#toast');t.textContent=msg;t.classList.toggle('err',kind==='err');t.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('on'),2400)}

const sw=on=>`<span class="sw${on?' on':''}"><span>${on?'On':'Off'}</span><i></i></span>`;
const cyc=txt=>`<span class="arr">‹</span><em>${esc(txt)}</em><span class="arr">›</span>`;
const row=({i,label,desc,right='',attr='',cls='',av})=>`<div class="row ${cls}" ${attr}><div class="rl">${av?`<span class="av">${esc(av)}</span>`:i?`<span class="ib">${ic(i)}</span>`:''}<div class="lb"><b>${label}</b><small>${desc==null?'':desc}</small></div></div><div class="ctl">${right}</div></div>`;
const togRow=(k,i,label,desc)=>row({i,label,desc,right:sw(S.tog[k]),attr:`data-a="tog" data-v="${k}"`});
const go_=attr=>`data-a="${attr[0]}" data-v="${esc(attr[1])}"`;
const grp=(cap,inner)=>`<div class="grp">${cap?`<div class="cap">${cap}</div>`:''}${inner}</div>`;
const empty=(i,t)=>`<div class="empty"><span class="ib">${ic(i)}</span>${t}</div>`;
const match=s=>!S.q||String(s).toLowerCase().includes(S.q.toLowerCase());
const searchRow=ph=>row({i:'search',label:'Search',desc:S.q?esc(S.q):ph,right:S.q?'<em>Enter to change</em>':'',attr:'data-a="search"'});
const chev=ic('right');
const confirmRow=(a,label,i,bad)=>row({i,label,desc:'',right:'',attr:`data-a="${a}"`,cls:bad?'bad':''});

function view(){
  if(!S.sec)return{crumb:['QB Core','Staff'],title:'Admin Menu',desc:'Signed in as Admin',body:homeBody};
  const sec=NAV.find(n=>n.id===S.sec),base=['Admin menu',sec.label];
  if(S.sec==='admin'){
    if(S.sub==='weapons')return{crumb:base,title:'Spawn Weapons',desc:'Select a weapon to add it to your inventory.',body:weaponsBody};
    return{crumb:base,title:sec.label,desc:'Misc. admin options.',body:adminBody};
  }
  if(S.sec==='players'){
    const p=player();
    if(S.sub&&!p)S.sub=null;
    if(S.sub==='player')return{crumb:[...base,p.name],title:p.name,desc:`ID ${p.id} · ${p.cid} · ${p.ping} ms`,body:playerBody};
    if(S.sub==='player/ban')return{crumb:[...base,p.name,'Ban'],title:'Ban Player',desc:`Ban ${p.name} from the server.`,body:banBody};
    if(S.sub==='player/kick')return{crumb:[...base,p.name,'Kick'],title:'Kick Player',desc:`Remove ${p.name} from the server.`,body:kickBody};
    if(S.sub==='player/perms')return{crumb:[...base,p.name,'Permissions'],title:'Permissions',desc:`Set the authority group for ${p.name}.`,body:permsBody};
    return{crumb:base,title:'Online Players',desc:'Select a player to open their options.',body:playersBody};
  }
  if(S.sec==='server')return{crumb:base,title:sec.label,desc:'Change the weather and the time for everyone.',body:serverBody};
  if(S.sec==='vehicles'){
    if(S.sub==='vcats')return{crumb:base,title:'Spawn Vehicle',desc:'Pick a category or search all models.',body:vcatsBody};
    if(S.sub==='vmodels')return{crumb:[...base,S.vcat],title:S.vcat,desc:'Select a model to spawn it.',body:vmodelsBody};
    return{crumb:base,title:sec.label,desc:'Spawn a vehicle or work on the one you are in.',body:vehiclesBody};
  }
  if(S.sec==='dealers'){
    if(S.sub==='dealer')return{crumb:[...base,S.dname],title:S.dname,desc:'Dealer options.',body:dealerBody};
    return{crumb:base,title:'Dealer List',desc:'List of existing dealers.',body:dealersBody};
  }
  return{crumb:base,title:'Developer Options',desc:'Misc. dev options.',body:devBody};
}

function homeBody(){
  const on=Object.keys(S.tog).filter(k=>S.tog[k]);
  return `<div class="view"><div class="info"><span>${pLoaded?PLAYERS.length+' online':'Loading…'} · Time ${hh(S.clock)}</span>${on.map(k=>`<span class="tag"><i></i>${TOGLABEL[k]}</span>`).join('')}</div>`+
  grp('Menu',navList().map(n=>row({i:n.ic,label:n.label,desc:n.desc,right:chev,attr:`data-a="nav" data-v="${n.id}"`})).join(''))+
  grp('Panel',row({i:'monitor',label:'Panel side',desc:'Left or right of the screen',right:cyc(S.dock==='left'?'Left':'Right'),attr:'data-a="dock"'}))+`</div>`;
}

function adminBody(){return `<div class="view">`+
 grp('Toggles',togRow('noclip','video','NoClip','Enable/Disable NoClip')+togRow('invisible','eyeoff','Invisible','Enable/Disable invisibility')+togRow('god','zap','Godmode','Enable/Disable god mode')+togRow('names','tag','Names','Enable/Disable names overhead')+togRow('blips','pin','Blips','Enable/Disable blips for players in maps'))+
 grp('Actions',row({i:'heart',label:'Revive',desc:'Revive yourself',attr:'data-a="revive"'})+row({i:'crosshair',label:'Spawn Weapons',desc:'Spawn any weapon',right:chev,attr:'data-a="sub" data-v="weapons"'}))+`</div>`}

function weaponsBody(){
  const l=WEAPONS.filter(w=>match(w[0])||match(w[1]));
  return `<div class="view"><div class="grp">${searchRow('Press Enter to type')}${l.map(w=>row({i:'crosshair',label:esc(w[0]),desc:esc(w[1]),attr:`data-a="weapon" data-v="${esc(w[1])}"`,cls:'mono'})).join('')}</div>${l.length?'':empty('search','No weapon matches your search.')}</div>`}

function playersBody(){
  if(!pLoaded)return `<div class="view">${empty('users','Loading players…')}</div>`;
  const l=PLAYERS.filter(p=>match(p.name)||match(p.id)||match(p.cid)||match(p.user));
  return `<div class="view"><div class="grp">${searchRow('Name, ID or citizen ID')}${l.map(p=>row({av:initials(p.name),label:esc(p.name),desc:`${esc(p.cid)} · ${esc(p.user)}`,right:`<output>ID ${p.id}</output>`,attr:`data-a="player" data-v="${p.id}"`})).join('')}</div>${l.length?'':empty('search','No player matches your search.')}</div>`}

function playerBody(){
  const p=player(),f=esc(p.name.split(' ')[0]);
  const r=(a,v,i,label,desc,cls)=>row({i,label,desc,attr:`data-a="${a}" data-v="${v}"`,cls:cls||''});
  return `<div class="view">`+
  grp('Teleport and view',r('pact','goto','nav','Go to','To '+f)+r('pact','bring','down','Bring',f+' to you')+r('pact','spectate','eye','Spectate','Watch '+f)+r('pact','intovehicle','car','Sit in vehicle','In '+f+"'s vehicle"))+
  grp('Manage',r('pact','revive','heart','Revive','Revive '+f)+r('pact','freeze','lock','Freeze','Freeze '+f)+r('pact','inventory','box','Open Inventory','Open '+f+"'s inventory")+r('pact','cloth','shirt','Give Clothing Menu','Give the menu to '+f))+
  grp('Moderation',r('pact','kill','skull','Kill','Kill '+f,'bad')+r('sub','player/kick','logout','Kick','Needs a reason','bad')+r('sub','player/ban','ban','Ban','Reason and length','bad')+r('sub','player/perms','key','Permissions','Authority group'))+`</div>`}

const reasonRow=(who,f)=>row({i:'tag',label:'Reason',desc:f.reason?esc(f.reason):'Press Enter to type',right:'',attr:`data-a="reason" data-v="${who}"`,cls:f.err&&!f.reason.trim()?'err':''});
function banBody(){
  const b=S.ban,len=BANLEN.find(x=>x[1]===b.len);
  const lenTxt=b.len==='custom'?'Custom':len?len[0]:'Not set';
  return `<div class="view">`+grp('',reasonRow('ban',b)+
   row({i:'clock',label:'Length',desc:'Left/Right to change',right:cyc(lenTxt),attr:'data-a="banlen" data-cy="banlen"',cls:b.err&&!b.len?'err':''})+
   (b.len==='custom'?row({i:'clock',label:'Custom length',desc:b.custom?esc(b.custom)+' seconds':'Press Enter to type seconds',attr:'data-a="bancustom"'}):'')+
   confirmRow('banok','Confirm ban','ban',true))+`</div>`}

function kickBody(){
  return `<div class="view">`+grp('',reasonRow('kick',S.kick)+confirmRow('kickok','Confirm kick','logout',true))+`</div>`}

function permsBody(){
  return `<div class="view">`+grp('Authority group',GROUPS.map(g=>row({i:g.value==='user'?'users':g.value==='god'?'zap':'shield',label:esc(g.label),desc:esc(g.desc||''),right:S.group===g.value?ic('check'):'',attr:`data-a="group" data-v="${esc(g.value)}"`})).join('')+confirmRow('permok','Confirm','check',false))+`</div>`}

function serverBody(){
  return `<div class="view">`+grp('Weather',WEATHER.map(w=>row({i:w[3],label:w[1],desc:esc(w[2]),right:S.weather===w[0]?ic('check'):'',attr:`data-a="weather" data-v="${w[0]}"`})).join(''))+
  grp('Server time',row({i:'clock',label:'Server Time',desc:'Left/Right to pick, Enter to set',right:cyc(hh(S.hour)),attr:'data-a="hourset" data-cy="hour"'}))+`</div>`}

function vehiclesBody(){
  const r=(a,v,i,label,desc)=>row({i,label,desc,attr:`data-a="${a}" data-v="${v}"`});
  return `<div class="view">`+grp('Spawner',row({i:'car',label:'Spawn Vehicle',desc:'Spawn a vehicle',right:chev,attr:'data-a="sub" data-v="vcats"'}))+
  grp('Actions',r('vact','fix','wrench','Fix Vehicle','Fix the vehicle you are in')+r('vact','buy','dollar','Buy','Buy the vehicle for free')+r('vact','remove','trash','Remove Vehicle','Remove closest vehicle')+r('vact','maxmods','rocket','Max Mods','Max mod your current vehicle'))+`</div>`}
const modelRow=v=>row({i:'car',label:esc(v[0]),desc:esc(v[1]),attr:`data-a="spawn" data-v="${esc(v[1])}"`,cls:'mono'});
function vcatsBody(){
  if(S.q){const l=VEHICLES.flatMap(c=>c[1]).filter(v=>match(v[0])||match(v[1]));return `<div class="view"><div class="grp">${searchRow('Search all models')}${l.map(modelRow).join('')}</div>${l.length?'':empty('search','No vehicle matches your search.')}</div>`}
  return `<div class="view"><div class="grp">${searchRow('Search all models')}${VEHICLES.map(c=>row({i:'car',label:esc(c[0]),desc:'Category name',right:`<output>${c[1].length}</output>`+chev,attr:`data-a="vcat" data-v="${esc(c[0])}"`})).join('')}</div></div>`}
function vmodelsBody(){
  const c=VEHICLES.find(x=>x[0]===S.vcat);
  return `<div class="view"><div class="grp">${(c?c[1]:[]).map(modelRow).join('')}</div></div>`}

function dealersBody(){
  if(!dLoaded)return `<div class="view">${empty('pill','Loading dealers…')}</div>`;
  if(!DEALERS.length)return `<div class="view">${empty('pill','No dealers found.')}</div>`;
  return `<div class="view"><div class="grp">${DEALERS.map(d=>row({i:'pill',label:esc(d),desc:'Dealer name',right:chev,attr:`data-a="dealer" data-v="${esc(d)}"`})).join('')}</div></div>`}
function dealerBody(){
  return `<div class="view"><div class="grp">${row({i:'nav',label:'Go to '+esc(S.dname),desc:'Goto dealer',attr:'data-a="dgo"'})}${row({i:'x',label:'Remove '+esc(S.dname),desc:'Remove dealer',attr:'data-a="ddel"',cls:'bad'})}</div></div>`}

function devBody(){
  const cp=(k,i,l,d)=>row({i,label:l,desc:d,attr:`data-a="copy" data-v="${k}"`});
  return `<div class="view">`+grp('Copy to clipboard',cp('vector3','copy','Copy vector3','Copy vector3 to clipboard')+cp('vector4','copy','Copy vector4','Copy vector4 to clipboard')+cp('heading','compass','Copy Heading','Copy heading to clipboard'))+
  grp('Display',togRow('coords','pin','Display Coords','Show coords on screen')+togRow('vehdev','gauge','Vehicle Dev Mode','Display vehicle information')+togRow('huddev','monitor','Dev Mode (qb-hud)','Enable/Disable developer mode')+togRow('noclip','video','NoClip','Enable/Disable NoClip'))+
  grp('Entity view',row({i:'scan',label:'Set View Distance',desc:'Left/Right to change, meters',right:cyc(S.evDist+' m'),attr:'data-a="noop" data-cy="dist"'})+togRow('evfree','crosshair','Freeaim Mode','Entity info via freeaim')+togRow('evveh','car','Display Vehicles','Vehicle info in the world')+togRow('evped','walk','Display Peds','Ped info in the world')+togRow('evobj','box','Display Objects','Object info in the world')+cp('freeaim','copy','Copy Freeaim Entity Info','Copies the freeaim entity info to clipboard'))+`</div>`}

let KF=0,KST=[];
const items=()=>[...document.querySelectorAll('#body [data-a]')];
function kfApply(){const l=items();if(!l.length)return;KF=Math.min(Math.max(KF,0),l.length-1);l.forEach((e,k)=>e.classList.toggle('kf',k===KF));l[KF].scrollIntoView({block:'nearest'})}
function inputBody(){return `<div class="view input-view"><label class="input-label" for="menuInput">${esc(S.editor.title)}</label><input id="menuInput" class="menu-input" type="text" value="${esc(S.editor.value)}" maxlength="${S.editor.max}" autocomplete="off" spellcheck="false"><p class="input-help">Press Enter to save or Escape to cancel.</p></div>`}
function renderBody(keep){const b=$('#body'),y=b.scrollTop;b.classList.toggle('still',!!keep);b.innerHTML=S.editor?inputBody():view().body();if(keep)b.scrollTop=y;kfApply()}
function render(){
  const v=view();
  const editor=S.editor;
  $('#mh').innerHTML=`<div class="crumb">${v.crumb.map(esc).join(' / ')}</div><h2>${esc(editor?editor.title:v.title)}</h2><p>${esc(editor?'Enter to save · Esc to cancel':v.desc)}</p>`;
  renderBody();
  const sh=$('#shell');sh.classList.toggle('left',S.dock==='left');sh.hidden=!S.open;
  renderKeys();
}
function renderKeys(){
  $('#keys').innerHTML=S.editor
    ?'<kbd>Enter</kbd><span>Save</span><kbd>Esc</kbd><span>Cancel</span>'
    :`<kbd>${LABELS.up}${LABELS.down}</kbd><span>Move</span><kbd>${LABELS.left}${LABELS.right}</kbd><span>Change</span><kbd>${LABELS.select}</kbd><span>Select</span><kbd>${LABELS.back}</kbd><span>Back</span>`;
}
function go(sec,sub){if(sec)S.sec=sec;S.sub=sub||null;S.q='';KF=0;render();$('#body').scrollTop=0}
const push=()=>KST.push(KF);

function loadPlayers(){post('getPlayers').then(l=>{PLAYERS=Array.isArray(l)?l:[];pLoaded=true;if(S.open)renderBody(true)})}
function loadDealers(){post('getDealers').then(l=>{DEALERS=Array.isArray(l)?l:[];dLoaded=true;if(S.open&&S.sec==='dealers')renderBody(true)})}

function finishInput(value){
  const editor=S.editor;
  if(!editor)return;
  S.editor=null;
  post('inputFocus',{focus:false});
  editor.resolve(value);
  if(S.open)render();
}
const ask=(title,value,max)=>new Promise(resolve=>{
  S.editor={title,value:value||'',max:max||255,resolve};
  render();
  post('inputFocus',{focus:true}).then(()=>{
    const field=$('#menuInput');
    if(field){field.focus();field.setSelectionRange(field.value.length,field.value.length)}
  });
});
document.addEventListener('input',e=>{if(e.target.id==='menuInput'&&S.editor)S.editor.value=e.target.value});

const ACT={
 noop:()=>{},
 nav:v=>{push();go(v);if(v==='players')loadPlayers();if(v==='dealers')loadDealers()},
 sub:v=>{S.ban={reason:'',len:null,custom:'',err:false};S.kick={reason:'',err:false};S.group=null;push();go(null,v)},
 back:()=>{if(S.sub)S.sub=PARENT[S.sub];else S.sec=null;S.q='';render();KF=KST.pop()||0;kfApply();$('#body').scrollTop=0},
 close:()=>{S.open=false;KST=[];post('close');render()},
 dock:()=>{S.dock=S.dock==='left'?'right':'left';try{localStorage.setItem('adm_dock',S.dock)}catch(e){}render()},
 search:()=>ask('Search',S.q,40).then(v=>{if(v!==null){S.q=v.trim();KF=0;renderBody(true)}}),
 reason:v=>{const f=S[v];ask(v==='ban'?'Ban reason':'Kick reason',f.reason,255).then(r=>{if(r!==null){f.reason=r;f.err=false;renderBody(true)}})},
 bancustom:()=>ask('Ban length in seconds',S.ban.custom,11).then(r=>{if(r!==null){S.ban.custom=r.replace(/\D/g,'');renderBody(true)}}),
 revive:()=>{post('revive');toast('You have been revived')},
 weapon:v=>{post('weapon',{name:v});toast('You have spawned a weapon · '+v)},
 player:v=>{S.pid=+v;push();go(null,'player')},
 pact:v=>{const p=player();post('playerAction',{action:v,id:p.id});toast(`${PACT[v]} ${p.name}`)},
 group:v=>{S.group=v;renderBody(true)},
 permok:()=>{if(!S.group)return toast('Choose a group!','err');const p=player();post('setPermissions',{id:p.id,group:S.group});toast(`${p.name} is now ${S.group}`);KST=[];go(null,'player')},
 banlen:()=>CYC.banlen(1),
 banok:()=>{const b=S.ban,len=b.len==='custom'?(+b.custom>0?b.custom:null):b.len;
   if(!b.reason.trim()||!len){b.err=true;renderBody(true);return toast('You must give a reason and set a length for the ban!','err')}
   const p=player();post('ban',{id:p.id,reason:b.reason.trim(),length:len});toast(`${p.name} has been banned`);KST=[];go(null,null);loadPlayers()},
 kickok:()=>{const k=S.kick;if(!k.reason.trim()){k.err=true;renderBody(true);return toast('You must give a reason!','err')}
   const p=player();post('kick',{id:p.id,reason:k.reason.trim()});toast(`${p.name} has been kicked`);KST=[];go(null,null);loadPlayers()},
 weather:v=>{S.weather=v;const w=WEATHER.find(x=>x[0]===v);post('weather',{value:v});toast('Weather changed to: '+w[1]);renderBody(true)},
 hourset:()=>{S.clock=S.hour;post('time',{hour:S.hour});toast(`Time changed to ${S.hour} hs 00 min`)},
 vact:v=>{const m={fix:'Vehicle fixed',buy:'Vehicle added to your garage',remove:'Closest vehicle removed',maxmods:'Vehicle upgraded'};post('vehicle',{action:v});toast(m[v])},
 vcat:v=>{S.vcat=v;S.q='';push();go(null,'vmodels')},
 spawn:v=>{post('spawn',{model:v});toast('Spawned '+v)},
 dealer:v=>{S.dname=v;push();go(null,'dealer')},
 dgo:()=>{post('dealerGoto',{name:S.dname});toast('Teleported to '+S.dname)},
 ddel:()=>{const n=S.dname;DEALERS=DEALERS.filter(d=>d!==n);post('dealerRemove',{name:n});toast(n+' removed');KST=[];go(null,null)},
 copy:v=>{post('copy',{type:v}).then(r=>{if(r&&r.ok)toast(v==='heading'?'Heading copied to clipboard!':v==='freeaim'?'Freeaim entity info copied to clipboard!':'Coordinates copied to clipboard!');else toast('No freeaim entity info to copy to clipboard!','err')})},
 tog:(v,el)=>{post('toggle',{key:v}).then(r=>{S.tog[v]=r&&typeof r.value==='boolean'?r.value:!S.tog[v];
   const s=el&&el.isConnected&&$('.sw',el);if(s){s.classList.toggle('on',S.tog[v]);$('span',s).textContent=S.tog[v]?'On':'Off'}
   toast(`${TOGLABEL[v]} ${S.tog[v]?'enabled':'disabled'}`)})}
};

const CYC={
 banlen:d=>{const o=[...BANLEN.map(x=>x[1]),'custom'],i=o.indexOf(S.ban.len);S.ban.len=o[(i<0?(d>0?0:o.length-1):(i+d+o.length)%o.length)];renderBody(true)},
 hour:d=>{S.hour=(S.hour+d+24)%24;renderBody(true)},
 dist:d=>{S.evDist=Math.min(50,Math.max(5,S.evDist+d*5));post('entityDistance',{value:S.evDist});renderBody(true)}
};
document.addEventListener('click',e=>{const el=e.target.closest('[data-a]');if(!el)return;const f=ACT[el.dataset.a];if(f)f(el.dataset.v,el)});

function handleKey(k){
  if(!S.open)return;
  if(S.editor)return;
  const l=items(),el=l[KF];
  if(k==='up'||k==='down'){if(l.length){KF=(KF+(k==='down'?1:-1)+l.length)%l.length;kfApply()}}
  else if(k==='left'||k==='right'){if(el&&el.dataset.cy)CYC[el.dataset.cy](k==='right'?1:-1)}
  else if(k==='select'){if(el)el.click()}
  else if(k==='back'){S.sec?ACT.back():ACT.close()}
}

function init(d){
  const c=d.config||{};
  if(c.keys)LABELS=Object.assign(LABELS,c.keys);
  SECTIONS=c.sections||{};
  if(c.banLengths&&c.banLengths.length)BANLEN=c.banLengths;
  if(c.groups&&c.groups.length)GROUPS=c.groups;
  WEAPONS=d.weapons||[];
  VEHICLES=(d.vehicles||[]).map(x=>[x.c,x.v]);
  S.vcat=VEHICLES.length?VEHICLES[0][0]:'';
  let dock=c.dock==='left'?'left':'right';
  try{const s=localStorage.getItem('adm_dock');if(s==='left'||s==='right')dock=s}catch(e){}
  S.dock=dock;
  renderKeys();
}
function open(st){
  st=st||{};
  for(const k in S.tog)if(typeof st[k]==='boolean')S.tog[k]=st[k];
  if(typeof st.hour==='number'){S.hour=S.clock=st.hour}
  if(typeof st.evDist==='number')S.evDist=st.evDist;
  S.open=true;S.sec=null;S.sub=null;S.q='';KF=0;KST=[];
  render();loadPlayers();
}
window.addEventListener('message',e=>{const d=e.data||{};
  if(d.string!==undefined){copyToClipboard(String(d.string));return}
  if(d.action==='init')init(d);
  else if(d.action==='open')open(d.state);
  else if(d.action==='key')handleKey(d.key);
  else if(d.action==='close'){if(S.editor)finishInput(null);S.open=false;render()}
});

document.addEventListener('keydown',e=>{
  if(!S.editor)return;
  if(e.key==='Enter'){
    e.preventDefault();
    e.stopImmediatePropagation();
    const field=$('#menuInput');
    finishInput(field?field.value:S.editor.value);
  }else if(e.key==='Escape'){
    e.preventDefault();
    e.stopImmediatePropagation();
    finishInput(null);
  }
});

function dev(a,d){
  const R=v=>Promise.resolve(v);
  if(a==='getPlayers')return R([{id:1,name:'Marcus Hale',user:'marcus_h',cid:'QBX48213',ping:32},{id:4,name:'Jonas Reed',user:'jreed',cid:'QBX11872',ping:58},{id:7,name:'Priya Nair',user:'pnair',cid:'QBX30295',ping:27}]);
  if(a==='getDealers')return R(['Ricky','Marco']);
  if(a==='toggle')return R({value:!S.tog[d.key]});
  if(a==='copy')return R({ok:true});
  if(a==='input')return R({value:(typeof prompt==='function'&&prompt(d.title,d.value))||''});
  return R({});
}
if(!RES){
  const KM={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right',Enter:'select',Backspace:'back'};
  document.addEventListener('keydown',e=>{
    if(S.editor)return;
    const k=KM[e.key];if(k){e.preventDefault();handleKey(k)}
  });
  init({weapons:[['Pistol','weapon_pistol'],['Carbine Rifle','weapon_carbinerifle']],vehicles:[{c:'Sports',v:[['Elegy RH8','elegy2'],['Comet','comet2']]},{c:'Super',v:[['Adder','adder']]}]});
  open({hour:12,evDist:10});
}
