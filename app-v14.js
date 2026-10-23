import { firebaseConfig } from './firebase-config.js';
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safePhotoUrl = value => { try { const url=new URL(String(value||'').trim()); return url.protocol==='https:' ? url.href : ''; } catch { return ''; } };
const photoMarkup = (url,cls,alt) => { const src=safePhotoUrl(url); return src ? `<img class="${cls}" src="${esc(src)}" alt="${esc(alt)}" loading="lazy" referrerpolicy="no-referrer" onerror="this.hidden=true">` : ''; };
const money = n => new Intl.NumberFormat('fr-CH',{style:'currency',currency:'CHF',maximumFractionDigits:0}).format(Number(n)||0);
const niceDate = d => {try{return new Date(d+'T12:00:00').toLocaleDateString('fr-CH',{day:'2-digit',month:'long',year:'numeric'})}catch{return d}};
const databaseReady = firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith('VOTRE_') && firebaseConfig.projectId && !firebaseConfig.projectId.startsWith('VOTRE_');
const demoDefaults = {vehicles:[{id:'v1',code:'BUS-001',model:'Bus urbain',type:'Bus',capacity:'80',line:'L01',status:'En service'},{id:'v2',code:'BUS-002',model:'Bus interurbain',type:'Car',capacity:'55',line:'L02',status:'En service'},{id:'v3',code:'BUS-003',model:'Bus urbain',type:'Bus',capacity:'80',line:'',status:'Disponible'}],lines:[{id:'l1',number:'L01',name:'Ligne Centre',route:'Gare centrale ↔ Centre-ville',frequency:'15 min',status:'Active'},{id:'l2',number:'L02',name:'Ligne Express',route:'Centre-ville ↔ Aéroport',frequency:'30 min',status:'Active'}],staff:[{id:'s1',name:'Alex Martin',role:'Conducteur',assignment:'L01',salary:'4200'},{id:'s2',name:'Camille Dubois',role:'Conductrice',assignment:'L02',salary:'4200'}],finance:[{id:'f1',date:'2026-10-01',label:'Billetterie mensuelle',category:'Billetterie',type:'Recette',amount:'12800'},{id:'f2',date:'2026-10-05',label:'Carburant',category:'Exploitation',type:'Dépense',amount:'3600'},{id:'f3',date:'2026-10-08',label:'Entretien véhicules',category:'Maintenance',type:'Dépense',amount:'1150'}],news:[{id:'n1',date:'2026-10-19',title:'Bienvenue chez MACE Mobilité',body:'Découvrez notre compagnie de transports virtuelle, son réseau et ses véhicules.'},{id:'n2',date:'2026-10-18',title:'Notre réseau se développe',body:'Suivez nos nouvelles lignes et les prochains projets de notre entreprise.'}]};
const categories={advertising:{title:'Contrats publicitaires'},vehicles:{title:'Véhicules',cols:['Code','Modèle','Type','Capacité','Ligne','Statut'],keys:['code','model','type','capacity','line','status'],fields:[['code','Numéro / code','text'],['model','Modèle','text'],['type','Type','select',['Bus','Car','Tramway','Métro']],['capacity','Places','number'],['line','Ligne affectée','text'],['status','Statut','select',['En service','Disponible','Indisponible','Non immatriculé','En maintenance']],['photoUrl','URL de la photo (FiveManage)','url'],['engine','Motorisation','text'],['registration','Immatriculation','text'],['commissioned','Mise en service','date'],['mileage','Kilométrage (km)','number'],['lastService','Dernière révision','date'],['nextInspection','Prochain contrôle technique','date']]},lines:{title:'Lignes',cols:['Numéro','Nom','Parcours','Fréquence','Statut'],keys:['number','name','route','frequency','status'],fields:[['number','Numéro de ligne','text'],['name','Nom de ligne','text'],['route','Itinéraire','text'],['frequency','Fréquence','text'],['status','Statut','select',['Active','En projet','Suspendue']],['distanceKm','Distance de la ligne (km)','number'],['travelTime','Temps de trajet (minutes)','number'],['stopCount','Nombre d’arrêts','number'],['stops','Liste des arrêts (un par ligne)','textarea'],['chargingStations','Bornes de recharge','select',['Non','Oui']],['mapUrl','URL du plan de ligne (FiveManage)','url']]},staff:{title:'Personnel',cols:['N° employé','Nom','Fonction','Contrat','Statut','FCO','Expiration FCO'],keys:['employeeNumber','name','role','contractType','status','fco','fcoExpiry'],fields:[['employeeNumber','Numéro d’employé','text'],['name','Nom complet','text'],['hireDate','Date d’embauche','date'],['role','Métier','select',['Conducteur','Conductrice','Mécanicien','Commercial','Direction','Administration','Autre']],['contractType','Taux d’activité / contrat','select',['100 %','50 %','Intérimaire']],['contractEnd','Fin du contrat intérimaire','date'],['assignment','Affectation','text'],['status','Statut','select',['En service','En vacances','Malade','En congé','En repos','En formation','Indisponible','En attente d’affectation']],['fco','FCO à jour ?','select',['Non renseigné','Oui','Non','Non applicable']],['fcoExpiry','Date d’expiration FCO','date'],['salary','Salaire mensuel (CHF)','number']]},tickets:{title:'Tarifs des billets',cols:['Billet','Description','Prix (CHF)','Validité'],keys:['name','description','price','validity'],fields:[['name','Nom du billet','text'],['description','Description','text'],['price','Prix (CHF)','number'],['validity','Validité','text']]},history:{title:'Histoire de la compagnie',cols:['Période','Titre','Texte'],keys:['period','title','body'],fields:[['period','Année ou période','text'],['title','Titre','text'],['body','Récit / histoire','textarea']]},team:{title:'Équipe publique',cols:['Nom','Fonction','Présentation'],keys:['name','role','bio'],fields:[['name','Nom du membre','text'],['role','Fonction','text'],['bio','Présentation publique','textarea'],['photoUrl','URL de la photo (FiveManage)','url']]},loans:{title:'Prêts',cols:['Organisme','Référence','Capital prévu (CHF)','Taux annuel (%)','Durée (mois)','Date'],keys:['lender','reference','principal','rate','durationMonths','date'],fields:[['lender','Banque ou organisme prêteur','text'],['reference','Référence du prêt','text'],['principal','Capital contractuel (CHF)','number'],['rate','Taux d’intérêt annuel (%)','number'],['durationMonths','Durée du prêt (en mois)','number'],['calculationMode','Calcul des intérêts','select',['Transport Manager (intérêts fixes)','Banque (mensualités amortissables)']],['date','Date de souscription','date']]},finance:{title:'Finances',cols:['Date','Description','Catégorie','Type','Montant (CHF)'],keys:['date','label','category','type','amount'],fields:[['date','Date','date'],['label','Description','text'],['category','Catégorie','select',['Publicité','Billetterie','Exploitation','Maintenance','Salaires','Assurances','Administration','Investissement','Subvention','Divers','Prêt','Remboursement de prêt']],['type','Type','select',['Recette','Dépense']],['amount','Montant (CHF)','number']]},news:{title:'Actualités',cols:['Date','Titre','Description'],keys:['date','title','body'],fields:[['date','Date','date'],['title','Titre','text'],['body','Texte de l’actualité','textarea']]}};
let data={vehicles:[],lines:[],staff:[],finance:[],news:[],tickets:[],history:[],team:[],loans:[],advertising:[]};let currentTab='dashboard', editTarget=null, db=null, auth=null, uid=null, firebaseFns=null, unsubscribers=[];
const colKeys=Object.keys(data);
const ADMIN_UID = 'xeKXUePGh6eiD155UFhqusLW42y1';
function toast(message){const t=$('#toast');t.textContent=message;t.hidden=false;clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.hidden=true,3400)}
function localSave(){localStorage.setItem('mace-mobilite-data-v1',JSON.stringify(data))}
function localLoad(){try{const saved=JSON.parse(localStorage.getItem('mace-mobilite-data-v1'));data=saved&&typeof saved==='object'?Object.fromEntries(colKeys.map(k=>[k,Array.isArray(saved[k])?saved[k]:(demoDefaults[k]||[])])):Object.fromEntries(colKeys.map(k=>[k,structuredClone(demoDefaults[k]||[])]))}catch{data=Object.fromEntries(colKeys.map(k=>[k,structuredClone(demoDefaults[k]||[])]))}localSave()}
async function initializeFirebase(){if(!databaseReady){$('#demoBanner').hidden=false;$('#demoLoginHint').hidden=false;$('#loginEmail').required=false;$('#loginPassword').required=false;localLoad();renderPublic();return}
 try{const [appmod,authmod,storemod]=await Promise.all([import('https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js'),import('https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js'),import('https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js')]);const app=appmod.initializeApp(firebaseConfig);auth=authmod.getAuth(app);db=storemod.getFirestore(app);firebaseFns={...authmod,...storemod};authmod.onAuthStateChanged(auth,async u=>{uid=u?.uid||null;await syncAll();if(!uid&&!$('#adminView').hidden)showPublic();else if(uid&&!$('#adminView').hidden)renderAdmin()});await syncAll()}
 catch(e){console.error(e);$('#demoBanner').hidden=false;$('#demoBanner').textContent='Impossible de joindre Firebase. Vérifiez votre configuration et votre connexion.';toast('Connexion Firebase impossible. Vérifiez le paramétrage.');renderPublic()}}
async function syncAll(){unsubscribers.forEach(f=>f());unsubscribers=[];if(!db)return;colKeys.forEach(k=>{if(!uid&&(k==='staff'||k==='finance'||k==='loans'||k==='advertising')){data[k]=[];return}const ref=firebaseFns.collection(db,'company','mace-mobilite',k);const cancel=firebaseFns.onSnapshot(ref,snap=>{data[k]=snap.docs.map(doc=>({id:doc.id,...doc.data()}));renderPublic();if(!$('#adminView').hidden)renderAdmin()},e=>{console.error('Firestore',k,e);if(e.code==='permission-denied'&&uid)toast('Accès refusé : vérifiez l’UID dans les règles Firestore.')});unsubscribers.push(cancel)});renderPublic()}
async function saveRecord(k,record){if(!db){if(editTarget?.id){data[k]=data[k].map(o=>o.id===editTarget.id?{...record,id:o.id}:o)}else{data[k].push({...record,id:crypto.randomUUID()})}localSave();renderPublic();renderAdmin();return}if(!uid)throw Error('Authentification requise');const col=firebaseFns.collection(db,'company','mace-mobilite',k);if(editTarget?.id)await firebaseFns.setDoc(firebaseFns.doc(col,editTarget.id),record);else await firebaseFns.addDoc(col,record)}
async function removeRecord(k,id){if(!db){data[k]=data[k].filter(i=>i.id!==id);localSave();renderPublic();renderAdmin();return}if(!uid)throw Error('Authentification requise');await firebaseFns.deleteDoc(firebaseFns.doc(db,'company','mace-mobilite',k,id))}
function renderPublic(){const vehicles=data.vehicles,lines=data.lines,news=data.news;$('#statVehicles').textContent=vehicles.length;$('#statLines').textContent=lines.length;$('#statStaff').textContent='MACE';$('#publicLines').innerHTML=lines.length?lines.filter(l=>l.status==='Active').map(l=>`<article class="item-card route-card"><div class="card-top"><span class="route-badge">${esc(l.number)}</span><span class="pill">${esc(l.status)}</span></div><h3>${esc(l.name)}</h3><p>${esc(l.route)}</p><div class="card-meta">Fréquence : ${esc(l.frequency||'À confirmer')}</div><button type="button" class="btn outline dark route-detail-button" data-line-id="${esc(l.id)}">Voir la fiche de la ligne →</button></article>`).join('')||empty('Aucune ligne active à afficher.'):empty('Les lignes seront bientôt présentées.');$('#publicFleet').innerHTML=vehicles.length?vehicles.map(v=>`<article class="item-card">${photoMarkup(v.photoUrl,"fleet-photo",`Photo du véhicule ${v.code||""}`)||'<div class="fleet-icon">▰</div>'}<div class="card-top"><strong>${esc(v.code)}</strong><span class="pill ${v.status==='En service'?'':'muted'}">${esc(v.status)}</span></div><h3>${esc(v.model)}</h3><p>${esc(v.type)} · ${esc(v.capacity)} places</p><div class="card-meta">Affectation : ${esc(v.line||'Non affecté')}</div><button type="button" class="vehicle-details-link" data-vehicle-id="${esc(v.id)}" aria-label="Voir la fiche du véhicule ${esc(v.code)}">Voir la fiche du véhicule <span aria-hidden="true">→</span></button></article>`).join(''):empty('La flotte sera bientôt présentée.');$('#publicNews').innerHTML=news.length?[...news].sort((a,b)=>(b.date||'').localeCompare(a.date||'')).map((n,i)=>`<article class="news-card ${i===0?'news-featured':''}"><div class="news-top"><span class="news-topic">MACE · ACTUALITÉS</span><time>${esc(niceDate(n.date))}</time></div><h3>${esc(n.title)}</h3><p class="news-excerpt">${esc(n.body||'').slice(0,260)}${(n.body||'').length>260?'…':''}</p><button type="button" class="article-open" data-news-id="${esc(n.id)}">Lire l’article <span aria-hidden="true">↗</span></button></article>`).join(''):empty('Nos prochaines actualités seront publiées ici.');
 $('#publicTickets').innerHTML=data.tickets.length?data.tickets.map(t=>`<article class="item-card ticket-card"><span class="kicker">TARIF VOYAGEUR</span><h3>${esc(t.name)}</h3><div class="ticket-price">${esc(money(t.price))}</div><p>${esc(t.description)}</p><div class="card-meta">Validité : ${esc(t.validity)}</div></article>`).join(''):empty('Les tarifs seront publiés prochainement.');
 $('#publicHistory').innerHTML=data.history.length?[...data.history].sort((a,b)=>String(a.period||'').localeCompare(String(b.period||''))).map(x=>`<article class="history-entry"><span class="history-period">${esc(x.period)}</span><div><h3>${esc(x.title)}</h3><p>${paragraphs(x.body)}</p></div></article>`).join(''): '<div class="history-entry"><span class="history-period">UNE NOUVELLE ÈRE</span><div><h3>MACE Mobilité, un réseau tourné vers l’avenir</h3><p>Découvrez prochainement l’histoire de notre compagnie et les grandes étapes de son développement.</p></div></div>';
 $('#publicTeam').innerHTML=data.team.length?data.team.map(m=>`<article class="item-card team-card">${photoMarkup(m.photoUrl,"team-photo",`Portrait de ${m.name||"l’équipe"}`)||`<span class="team-monogram">${esc((m.name||"M").trim().charAt(0).toUpperCase())}</span>`}<h3>${esc(m.name)}</h3><strong class="team-role">${esc(m.role)}</strong><p>${esc(m.bio)}</p></article>`).join(''):empty('La présentation de notre équipe arrive prochainement.');}
function showLineDetails(id){
 const line=data.lines.find(l=>l.id===id);
 if(!line)return;
 const val=v=>v===undefined||v===null||String(v).trim()===''?'Non renseigné':esc(v);
 $('#lineModalNumber').textContent=line.number||'Ligne';
 $('#lineModalTitle').textContent=line.name||'Fiche de ligne';
 $('#lineModalRoute').textContent=line.route||'Itinéraire à préciser';
 $('#lineModalInfo').innerHTML=`
 <div class="route-spec"><span>Distance</span><strong>${line.distanceKm?val(line.distanceKm)+' km':'Non renseigné'}</strong></div>
 <div class="route-spec"><span>Durée du trajet</span><strong>${line.travelTime?val(line.travelTime)+' min':'Non renseigné'}</strong></div>
 <div class="route-spec"><span>Arrêts</span><strong>${val(line.stopCount)}</strong></div>
 <div class="route-spec"><span>Fréquence</span><strong>${val(line.frequency)}</strong></div>
 <div class="route-spec"><span>Bornes de recharge</span><strong>${val(line.chargingStations)}</strong></div>`;
 const stops=String(line.stops||'').split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
 $('#lineModalStops').innerHTML=stops.length?`<ol class="route-stops">${stops.map(stop=>`<li>${esc(stop)}</li>`).join('')}</ol>`:'<p class="route-placeholder">Les arrêts seront renseignés prochainement.</p>';
 const map=safePhotoUrl(line.mapUrl);
 $('#lineModalMap').innerHTML=map?`<a href="${esc(map)}" target="_blank" rel="noopener noreferrer"><img src="${esc(map)}" alt="Plan de la ligne ${esc(line.number)}" loading="lazy" referrerpolicy="no-referrer"></a>`:'<p class="route-placeholder">Plan de ligne prochainement disponible.</p>';
 $('#lineModal').hidden=false;
}
$('#publicLines').addEventListener('click',e=>{const button=e.target.closest('[data-line-id]');if(button)showLineDetails(button.dataset.lineId)});
$('#closeLine').onclick=()=>$('#lineModal').hidden=true;
$('#lineModal').addEventListener('click',e=>{if(e.target===$('#lineModal'))$('#lineModal').hidden=true});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#lineModal').hidden)$('#lineModal').hidden=true});
function paragraphs(t){return String(t||'').split(/\n\s*\n/).filter(Boolean).map(p=>'<p>'+esc(p).replace(/\n/g,'<br>')+'</p>').join('')}
$('#publicNews').addEventListener('click',e=>{const b=e.target.closest('[data-news-id]');if(!b)return;const n=data.news.find(x=>x.id===b.dataset.newsId);if(!n)return;$('#articleTitle').textContent=n.title;$('#articleDate').textContent=niceDate(n.date);$('#articleBody').innerHTML=paragraphs(n.body);$('#articleModal').hidden=false;$('#closeArticle').focus()});
$('#closeArticle').onclick=()=>$('#articleModal').hidden=true;
$('#articleModal').addEventListener('click',e=>{if(e.target===$('#articleModal'))$('#articleModal').hidden=true});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#articleModal').hidden)$('#articleModal').hidden=true});
const vehicleDate = value => value ? niceDate(value) : 'Non renseigné';
const vehicleText = value => value === undefined || value === null || String(value).trim() === '' ? 'Non renseigné' : esc(value);
function showVehicleDetails(id){
 const vehicle=data.vehicles.find(v=>v.id===id);
 if(!vehicle)return;
 const specs=[
  ['Motorisation',vehicleText(vehicle.engine)],
  ['Immatriculation',vehicleText(vehicle.registration)],
  ['Mise en service',vehicleDate(vehicle.commissioned)],
  ['Kilométrage',vehicle.mileage!==undefined && vehicle.mileage!=='' ? `${esc(new Intl.NumberFormat('fr-CH').format(Number(vehicle.mileage)||0))} km` : 'Non renseigné'],
  ['Dernière révision',vehicleDate(vehicle.lastService)],
  ['Prochain contrôle technique',vehicleDate(vehicle.nextInspection)]
 ];
 $('#vehicleModalPhoto').innerHTML=photoMarkup(vehicle.photoUrl,'vehicle-modal-photo',`Photo du véhicule ${vehicle.code||''}`);
 $('#vehicleModalTitle').textContent=vehicle.model||'Fiche véhicule';
 $('#vehicleModalCode').textContent=vehicle.code||'Véhicule';
 $('#vehicleModalIntro').textContent=`${vehicle.type||'Véhicule'} · ${vehicle.capacity||'—'} places · ${vehicle.status||'Statut non renseigné'}`;
 $('#vehicleModalLine').textContent=vehicle.line||'Non affecté';
 $('#vehicleModalSpecs').innerHTML=specs.map(([label,value])=>`<div class="spec-cell"><span>${esc(label)}</span><strong>${value}</strong></div>`).join('');
 $('#vehicleModal').hidden=false;
 $('#closeVehicleModal').focus();
}
function closeVehicleDetails(){$('#vehicleModal').hidden=true}
$('#publicFleet').addEventListener('click',e=>{const btn=e.target.closest('[data-vehicle-id]');if(btn)showVehicleDetails(btn.dataset.vehicleId)});
$('#closeVehicleModal').onclick=closeVehicleDetails;
$('#vehicleModal').addEventListener('click',e=>{if(e.target===$('#vehicleModal'))closeVehicleDetails()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#vehicleModal').hidden)closeVehicleDetails()});
function empty(t){return `<div class="empty">${esc(t)}</div>`}
function showPublic(){if(!db&&databaseReady)toast('Connexion aux données indisponible');$('#adminView').hidden=true;$('#publicView').hidden=false;$('#siteFooter').hidden=false;$('#nav').hidden=false;window.scrollTo(0,0)}
function showAdmin(){if(db&&(!uid||uid!==ADMIN_UID)){if(uid)toast('Ce compte ne dispose pas des droits administrateur');else $('#loginModal').hidden=false;return}if(!db&&databaseReady){toast('Firebase doit être connecté pour accéder à la direction');return}$('#loginModal').hidden=true;$('#publicView').hidden=true;$('#siteFooter').hidden=true;$('#adminView').hidden=false;$('#nav').hidden=true;renderAdmin();window.scrollTo(0,0)}
function renderAdmin(){const isDash=currentTab==='dashboard',c=categories[currentTab];$('#breadcrumb').textContent=isDash?'VUE D’ENSEMBLE':c.title.toUpperCase();$('#adminTitle').textContent=isDash?'Tableau de bord':`Gestion · ${c.title.toLowerCase()}`;document.querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('active',b.dataset.tab===currentTab));$('#profileLabel').textContent=uid?auth.currentUser.email:'Direction · Démo';if(isDash){renderDashboard();return}if(currentTab==='finance'){renderFinance();return}if(currentTab==='advertising'){renderAdvertising();return}if(currentTab==='loans'){renderLoans();return}const records=[...data[currentTab]];if(currentTab==='finance'||currentTab==='news')records.sort((a,b)=>(b.date||'').localeCompare(a.date||''));$('#adminContent').innerHTML=`${!db?'<div class="notice warning">Mode démonstration : vos changements sont enregistrés uniquement dans ce navigateur.</div>':''}<div class="panel"><div class="toolbar"><h2>${esc(c.title)} <span style="color:#94a4ae;font-size:14px">(${records.length})</span></h2><button class="btn primary" id="addRecord">+ Ajouter</button></div><div class="table-scroll">${records.length?`<table><thead><tr>${c.cols.map(s=>`<th>${esc(s)}</th>`).join('')}<th>Actions</th></tr></thead><tbody>${records.map(r=>`<tr>${c.keys.map(key=>`<td>${esc(key==='amount'?money(r[key]):key==='salary'?money(r[key]):key==='date'?niceDate(r[key]):r[key])}</td>`).join('')}<td class="actions">${currentTab==='vehicles'?`<button class="text-button" data-view-vehicle="${esc(r.id)}">Fiche</button>`:''}<button class="text-button" data-edit="${esc(r.id)}">Modifier</button><button class="text-button delete" data-delete="${esc(r.id)}">Supprimer</button></td></tr>`).join('')}</tbody></table>`:empty('Aucune donnée pour le moment.')}</div></div>`;$('#addRecord').onclick=()=>openEditor(currentTab);document.querySelectorAll('[data-view-vehicle]').forEach(b=>b.onclick=()=>showVehicleDetails(b.dataset.viewVehicle));document.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>openEditor(currentTab,data[currentTab].find(r=>r.id===b.dataset.edit)));document.querySelectorAll('[data-delete]').forEach(b=>b.onclick=async()=>{if(!confirm('Supprimer définitivement cet élément ?'))return;try{await removeRecord(currentTab,b.dataset.delete);toast('Élément supprimé')}catch(e){toast('Suppression impossible : '+e.message)}})}

const money2=n=>new Intl.NumberFormat('fr-CH',{style:'currency',currency:'CHF',minimumFractionDigits:2,maximumFractionDigits:2}).format(Number(n)||0);
const operationsFor=id=>data.finance.filter(f=>f.loanId===id);
function loanMetrics(l){
 const ops=operationsFor(l.id);
 const received=ops.filter(f=>f.category==='Prêt'&&f.type==='Recette').reduce((sum,f)=>sum+Number(f.amount||0),0);
 // La fiche présente le capital contractuel tant qu'aucun encaissement n'est saisi.
 // Dès le premier encaissement, le calcul porte sur le capital effectivement reçu.
 const borrowed=received>0?received:Math.max(0,Number(l.principal)||0);
 const rate=Math.max(0,Number(l.rate)||0);
 const months=Math.max(0,Math.floor(Number(l.durationMonths)||0));
 const mode=l.calculationMode||'Transport Manager (intérêts fixes)';
 const isGame=mode!=='Banque (mensualités amortissables)';
 let interest,total,monthlyPayment;
 if(isGame){
   // Intérêts simples fixes, au prorata de la durée en années.
   // Exemple TM : 300000 CHF, 5%, 12 mois => 15000 CHF / 26250 CHF par mois.
   interest=borrowed*(rate/100)*(months>0?months/12:1);
   total=borrowed+interest;
   monthlyPayment=months>0?total/months:0;
 }else{
   const monthlyRate=rate/1200;
   monthlyPayment=months>0?(monthlyRate>0?borrowed*monthlyRate/(1-Math.pow(1+monthlyRate,-months)):borrowed/months):0;
   total=months>0?monthlyPayment*months:borrowed;
   interest=Math.max(0,total-borrowed);
 }
 const repaid=ops.filter(f=>f.category==='Remboursement de prêt'&&f.type==='Dépense').reduce((sum,f)=>sum+Number(f.amount||0),0);
 let endDate='—';
 if(months>0 && /^\d{4}-\d{2}-\d{2}$/.test(l.date||'')){
   const [year,month,day]=l.date.split('-').map(Number);
   const target=new Date(Date.UTC(year,month-1+months,1));
   const lastDay=new Date(Date.UTC(target.getUTCFullYear(),target.getUTCMonth()+1,0)).getUTCDate();
   target.setUTCDate(Math.min(day,lastDay));
   endDate=new Intl.DateTimeFormat('fr-CH',{timeZone:'UTC',day:'2-digit',month:'2-digit',year:'numeric'}).format(target);
 }
 return {borrowed,received,rate,months,mode,monthlyPayment,endDate,interest,total,repaid,remaining:Math.max(0,total-repaid),percent:total?Math.min(100,Math.round(repaid/total*100)):0};
}
let financeQuery='',financeCategory='Toutes',financeType='Tous',financeYear='Toutes';
function financeTotals(records){return {revenue:records.filter(r=>r.type==='Recette'&&!['Prêt'].includes(r.category)).reduce((s,r)=>s+Number(r.amount||0),0),expenses:records.filter(r=>r.type==='Dépense'&&r.category!=='Remboursement de prêt').reduce((s,r)=>s+Number(r.amount||0),0),borrowed:records.filter(r=>r.category==='Prêt').reduce((s,r)=>s+Number(r.amount||0),0),repaid:records.filter(r=>r.category==='Remboursement de prêt').reduce((s,r)=>s+Number(r.amount||0),0)};}
function renderFinance(){
 const all=data.finance,catList=[...new Set(all.map(r=>r.category).filter(Boolean))].sort(),yearList=[...new Set(all.map(r=>(r.date||'').slice(0,4)).filter(Boolean))].sort().reverse();
 const filtered=all.filter(r=>(financeCategory==='Toutes'||r.category===financeCategory)&&(financeType==='Tous'||r.type===financeType)&&(financeYear==='Toutes'||(r.date||'').startsWith(financeYear))&&[r.label,r.category,r.date,r.loanId?data.loans.find(l=>l.id===r.loanId)?.reference:''].join(' ').toLowerCase().includes(financeQuery.toLowerCase())).sort((a,b)=>(b.date||'').localeCompare(a.date||''));
 const t=financeTotals(filtered);const cash=(t.revenue+t.borrowed)-(t.expenses+t.repaid);
 $('#adminContent').innerHTML=`<div class="finance-intro"><h2>Comptabilité et suivi</h2><p>Les montants sont calculés automatiquement à partir de tes écritures. Les prêts et leurs remboursements sont séparés du résultat d’exploitation.</p></div><div class="finance-kpis"><div class="finance-kpi positive"><span>Recettes d’exploitation</span><strong>${money2(t.revenue)}</strong></div><div class="finance-kpi negative"><span>Dépenses d’exploitation</span><strong>${money2(t.expenses)}</strong></div><div class="finance-kpi ${t.revenue-t.expenses>=0?'positive':'negative'}"><span>Résultat d’exploitation</span><strong>${money2(t.revenue-t.expenses)}</strong></div><div class="finance-kpi"><span>Flux net, prêts compris</span><strong>${money2(cash)}</strong></div></div><div class="panel"><div class="toolbar"><div><h2>Journal des opérations</h2><p class="finance-help">${filtered.length} opération(s) affichée(s) · ${all.length} au total</p></div><button class="btn primary" id="addRecord">+ Nouvelle opération</button></div><div class="finance-filters"><label>Recherche<input id="finSearch" type="search" placeholder="Description, catégorie, date…" value="${esc(financeQuery)}"></label><label>Catégorie<select id="finCategory"><option value="Toutes">Toutes</option>${catList.map(c=>`<option value="${esc(c)}" ${financeCategory===c?'selected':''}>${esc(c)}</option>`).join('')}</select></label><label>Type<select id="finType"><option value="Tous">Tous</option><option value="Recette" ${financeType==='Recette'?'selected':''}>Recettes</option><option value="Dépense" ${financeType==='Dépense'?'selected':''}>Dépenses</option></select></label><label>Année<select id="finYear"><option value="Toutes">Toutes</option>${yearList.map(y=>`<option value="${esc(y)}" ${financeYear===y?'selected':''}>${esc(y)}</option>`).join('')}</select></label></div><div class="table-scroll"><table class="finance-table"><thead><tr><th>Date</th><th>Libellé</th><th>Catégorie</th><th>Type</th><th>Montant</th><th>Actions</th></tr></thead><tbody>${filtered.map(r=>`<tr><td>${esc(niceDate(r.date))}</td><td>${esc(r.label)}${r.loanId?`<small class="loan-ref">${esc(data.loans.find(l=>l.id===r.loanId)?.reference||'Prêt associé')}</small>`:''}</td><td><span class="category-chip">${esc(r.category)}</span></td><td>${esc(r.type)}</td><td class="finance-amount ${r.type==='Recette'?'positive':'negative'}">${r.type==='Recette'?'+':'−'} ${money2(r.amount)}</td><td class="actions"><button class="text-button" data-edit-fin="${esc(r.id)}">Modifier</button><button class="text-button delete" data-remove-fin="${esc(r.id)}">Supprimer</button></td></tr>`).join('')||'<tr><td colspan="6">Aucune opération ne correspond aux filtres.</td></tr>'}</tbody></table></div></div>`;
 $('#addRecord').onclick=()=>openEditor('finance');
 $('#finSearch').oninput=e=>{financeQuery=e.target.value;const pos=e.target.selectionStart;renderFinance();const inp=$('#finSearch');inp.focus();inp.setSelectionRange(pos,pos)};
 $('#finCategory').onchange=e=>{financeCategory=e.target.value;renderFinance()};$('#finType').onchange=e=>{financeType=e.target.value;renderFinance()};$('#finYear').onchange=e=>{financeYear=e.target.value;renderFinance()};
 document.querySelectorAll('[data-edit-fin]').forEach(b=>b.onclick=()=>{const r=data.finance.find(x=>x.id===b.dataset.editFin);if(r?.advertisingId){toast('Écriture générée par un contrat publicitaire clôturé : non modifiable.');return}openEditor('finance',r)});
 document.querySelectorAll('[data-remove-fin]').forEach(b=>b.onclick=async()=>{if(data.finance.some(r=>r.id===b.dataset.removeFin&&r.advertisingId)){toast('Cette recette appartient à un contrat publicitaire clôturé.');return}if(!confirm('Supprimer cette écriture ? Les soldes de prêts seront recalculés.'))return;try{await removeRecord('finance',b.dataset.removeFin);toast('Écriture supprimée')}catch(e){toast('Erreur : '+e.message)}});
}
function renderLoans(){
 const loans=data.loans;
 $('#adminContent').innerHTML=`<div class="finance-intro"><h2>Emprunts et remboursements</h2><p>Crée une fiche de prêt, enregistre le versement du capital dans Finances → catégorie « Prêt », puis les remboursements dans « Remboursement de prêt ».</p></div><div class="toolbar"><h2>Prêts en cours (${loans.length})</h2><button id="addLoan" class="btn primary">+ Créer un prêt</button></div><div class="loan-grid">${loans.map(l=>{const m=loanMetrics(l);return `<article class="loan-card"><div class="loan-card-header"><span class="category-chip">${esc(l.reference)}</span><strong>${esc(l.lender)}</strong></div><div class="loan-fields"><div><small>Capital servant au calcul</small><strong>${money2(m.borrowed)}</strong></div><div><small>Taux d’intérêt annuel</small><strong>${esc(l.rate)} %</strong></div><div><small>Mode de calcul</small><strong>${m.mode.startsWith("Transport")?"Transport Manager":"Banque amortissable"}</strong></div><div><small>Durée du prêt</small><strong>${m.months?m.months+" mois":"À compléter"}</strong></div><div><small>Mensualité estimée</small><strong>${m.months?money2(m.monthlyPayment):"—"}</strong></div><div><small>Date de fin estimée</small><strong>${esc(m.endDate)}</strong></div><div><small>Intérêts estimés</small><strong>${money2(m.interest)}</strong></div><div><small>Total à rembourser</small><strong>${money2(m.total)}</strong></div><div><small>Déjà remboursé</small><strong class="positive">${money2(m.repaid)}</strong></div><div><small>Reste à rembourser</small><strong class="negative">${money2(m.remaining)}</strong></div></div><div class="loan-progress"><div style="width:${m.percent}%"></div></div><p class="finance-help">${m.percent} % remboursé · Capital prévu au contrat : ${money2(l.principal)}</p><div class="loan-actions"><button class="text-button" data-edit-loan="${esc(l.id)}">Modifier</button><button class="text-button delete" data-remove-loan="${esc(l.id)}">Supprimer</button><button class="text-button" data-add-payment="${esc(l.id)}">Saisir remboursement</button></div></article>`}).join('')||'<div class="empty">Aucun prêt enregistré pour le moment.</div>'}</div><p class="finance-help">Mode Transport Manager : intérêts fixes simples calculés au prorata de la durée. Exemple : 300’000 CHF à 5 % sur 12 mois = 15’000 CHF d’intérêts et 26’250 CHF par mois. Le mode Banque reste disponible. Le capital contractuel est utilisé jusqu’à la saisie d’un encaissement. Les remboursements enregistrés sont déduits du total prévisionnel : ils ne constituent pas un échéancier bancaire ni un calcul d’intérêts au jour le jour.</p>`;
 $('#addLoan').onclick=()=>openEditor('loans');
 document.querySelectorAll('[data-edit-loan]').forEach(b=>b.onclick=()=>openEditor('loans',loans.find(l=>l.id===b.dataset.editLoan)));
 document.querySelectorAll('[data-remove-loan]').forEach(b=>b.onclick=async()=>{if(operationsFor(b.dataset.removeLoan).length){toast('Supprime d’abord les écritures associées à ce prêt.');return}if(!confirm('Supprimer cette fiche de prêt ?'))return;try{await removeRecord('loans',b.dataset.removeLoan)}catch(e){toast('Erreur : '+e.message)}});
 document.querySelectorAll('[data-add-payment]').forEach(b=>b.onclick=()=>{currentTab='finance';renderAdmin();openEditor('finance',{loanId:b.dataset.addPayment,category:'Remboursement de prêt',type:'Dépense',date:new Date().toISOString().slice(0,10),label:'Remboursement de prêt'})});
}

let adEditingId=null;
const adVehicleName=id=>{const v=data.vehicles.find(x=>x.id===id);return v?`${v.code||''} — ${v.model||'Véhicule'}`:'Véhicule inconnu'};
const adDate=d=>d?niceDate(d):'Non renseignée';
const adField=(label,value)=>`<div><small>${esc(label)}</small><strong>${esc(value??'—')}</strong></div>`;
function renderAdvertising(){
 const contracts=[...data.advertising].sort((a,b)=>(b.startDate||'').localeCompare(a.startDate||''));
 const active=contracts.filter(c=>c.status!=='Terminé');
 $('#adminContent').innerHTML=`<div class="finance-intro"><h2>Contrats publicitaires</h2><p>Associe une campagne à un ou plusieurs véhicules et suis les engagements commerciaux. La recette n'est créée qu'au moment où tu termines le contrat.</p></div>
 <div class="finance-kpis"><div class="finance-kpi"><span>Contrats en cours</span><strong>${active.length}</strong></div><div class="finance-kpi positive"><span>Recettes encaissées</span><strong>${money2(contracts.filter(c=>c.status==='Terminé').reduce((a,c)=>a+Number(c.price||0),0))}</strong></div><div class="finance-kpi"><span>Valeur des contrats en cours</span><strong>${money2(active.reduce((a,c)=>a+Number(c.price||0),0))}</strong></div></div>
 <div class="toolbar"><h2>Contrats (${contracts.length})</h2><button id="newAd" class="btn primary">+ Nouveau contrat</button></div>
 <div class="ad-contracts">${contracts.map(c=>`<article class="panel ad-contract"><div class="ad-contract-header"><div><span class="category-chip">${esc(c.status||'En cours')}</span><h3>${esc(c.advertiser)}</h3><p>${esc(c.reason)}</p></div><strong class="ad-price">${money2(c.price)}</strong></div><div class="ad-summary"><span>${esc(c.adType||'Publicité')}</span><span>${esc(c.vehicles?.length||0)} véhicule(s)</span><span>${esc(adDate(c.startDate))} → ${esc(adDate(c.endDate))}</span></div><div class="loan-actions"><button class="text-button" data-ad-view="${esc(c.id)}">Consulter le contrat</button>${c.status==='Terminé'?'':`<button class="text-button" data-ad-edit="${esc(c.id)}">Modifier</button><button class="text-button ad-complete" data-ad-complete="${esc(c.id)}">Terminer le contrat</button><button class="text-button delete" data-ad-remove="${esc(c.id)}">Supprimer</button>`}</div></article>`).join('')||'<div class="empty">Aucun contrat publicitaire pour le moment.</div>'}</div>`;
 $('#newAd').onclick=()=>openAdEditor();
 document.querySelectorAll('[data-ad-view]').forEach(b=>b.onclick=()=>viewAdContract(b.dataset.adView));
 document.querySelectorAll('[data-ad-edit]').forEach(b=>b.onclick=()=>openAdEditor(data.advertising.find(c=>c.id===b.dataset.adEdit)));
 document.querySelectorAll('[data-ad-complete]').forEach(b=>b.onclick=()=>completeAdContract(b.dataset.adComplete));
 document.querySelectorAll('[data-ad-remove]').forEach(b=>b.onclick=async()=>{if(!confirm('Supprimer ce contrat en cours ?'))return;try{await removeRecord('advertising',b.dataset.adRemove);toast('Contrat supprimé')}catch(e){toast('Suppression impossible : '+e.message)}});
}
function showAdModal(html){$('#adModalContent').innerHTML=html;$('#adModal').hidden=false;$('#adModal').querySelector('.ad-modal').scrollTop=0}
function closeAdModal(){$('#adModal').hidden=true;$('#adModalContent').innerHTML='';adEditingId=null}
function openAdEditor(c=null){
 if(c?.status==='Terminé'){toast('Ce contrat est déjà terminé.');return}
 adEditingId=c?.id||null;
 const selected=new Set(Array.isArray(c?.vehicles)?c.vehicles:[]);
 const vehicles=data.vehicles.map(v=>`<label class="ad-vehicle-option"><input type="checkbox" value="${esc(v.id)}" ${selected.has(v.id)?'checked':''}><span>${esc(v.code||'Sans code')} — ${esc(v.model||'Bus')} <small>(${esc(v.status||'Statut inconnu')})</small></span></label>`).join('');
 showAdModal(`<span class="kicker">MACE MOBILITÉ · PUBLICITÉ</span><h2>${c?'Modifier':'Créer'} un contrat publicitaire</h2><form id="adForm" class="ad-form"><h3>Informations publicitaires</h3><div class="ad-form-grid"><label>Annonceur<input name="advertiser" required maxlength="160" value="${esc(c?.advertiser||'')}"></label><label>Raison / objet<textarea name="reason" required maxlength="3000">${esc(c?.reason||'')}</textarea></label></div><h3>Informations techniques</h3><div class="ad-form-grid"><label>Type de publicité<select name="adType">${['Affichage extérieur','Affichage intérieur','Habillage partiel','Habillage intégral','Autre'].map(o=>`<option ${c?.adType===o?'selected':''}>${o}</option>`).join('')}</select></label><label>Nombre d’affichages<input name="displayCount" type="number" min="1" step="1" required value="${esc(c?.displayCount??1)}"></label></div><h3>Informations commerciales</h3><div class="ad-form-grid"><label>Date de début<input name="startDate" type="date" required value="${esc(c?.startDate||'')}"></label><label>Date de fin<input name="endDate" type="date" required value="${esc(c?.endDate||'')}"></label><label>Prix du contrat (CHF)<input name="price" type="number" min="0" step="0.01" required value="${esc(c?.price??'')}"></label></div><h3>Véhicules concernés</h3><p>Sélectionne les véhicules associés à cette campagne.</p><div class="ad-vehicle-list">${vehicles||'<p>Aucun véhicule enregistré : ajoute d’abord des véhicules dans la flotte.</p>'}</div><div class="modal-actions"><button type="button" class="btn outline dark" id="adCancel">Annuler</button><button type="submit" class="btn primary">Enregistrer le contrat</button></div></form>`);
 $('#adCancel').onclick=closeAdModal;
 $('#adForm').onsubmit=async e=>{e.preventDefault();const form=e.currentTarget;const r=Object.fromEntries(new FormData(form).entries());r.vehicles=[...form.querySelectorAll('.ad-vehicle-list input:checked')].map(i=>i.value);r.status='En cours';r.displayCount=Number(r.displayCount);r.price=Number(r.price);if(r.endDate<r.startDate){toast('La date de fin doit suivre la date de début.');return}if(!r.vehicles.length){toast('Sélectionne au moins un véhicule.');return}const button=form.querySelector('[type=submit]');button.disabled=true;try{const existing=adEditingId?data.advertising.find(x=>x.id===adEditingId):null;if(existing?.status==='Terminé')throw Error('Contrat déjà terminé');editTarget=existing||null;await saveRecord('advertising',r);editTarget=null;closeAdModal();toast('Contrat enregistré');if(!db)renderAdvertising()}catch(err){editTarget=null;toast('Impossible de sauvegarder : '+err.message)}finally{button.disabled=false}};
}
function viewAdContract(id){
 const c=data.advertising.find(x=>x.id===id);if(!c)return;
 const items=(c.vehicles||[]).map(id=>`<li>${esc(adVehicleName(id))}</li>`).join('');
 showAdModal(`<span class="kicker">MACE MOBILITÉ · CONTRAT PUBLICITAIRE</span><h2>${esc(c.advertiser)}</h2><span class="category-chip">${esc(c.status||'En cours')}</span><section class="ad-details"><h3>Informations publicitaires</h3><div class="loan-fields">${adField('Annonceur',c.advertiser)}${adField('Raison',c.reason)}</div><h3>Informations techniques</h3><div class="loan-fields">${adField('Type de publicité',c.adType)}${adField('Nombre d’affichages',c.displayCount)}</div><h3>Informations commerciales</h3><div class="loan-fields">${adField('Date de début',adDate(c.startDate))}${adField('Date de fin',adDate(c.endDate))}${adField('Montant du contrat',money2(c.price))}</div><h3>Véhicules concernés</h3><ul>${items||'<li>Aucun véhicule associé</li>'}</ul>${c.status==='Terminé'?`<p class="positive"><strong>Contrat terminé et recette comptabilisée.</strong></p>`:`<p class="finance-help">La somme sera inscrite dans Finances uniquement après validation de la clôture.</p>`}</section><div class="modal-actions"><button class="btn outline dark" id="adClose">Fermer</button>${c.status==='Terminé'?'':`<button class="btn primary" id="adCompleteFromView">Terminer le contrat</button>`}</div>`);
 $('#adClose').onclick=closeAdModal;
 if($('#adCompleteFromView'))$('#adCompleteFromView').onclick=()=>completeAdContract(c.id);
}
async function completeAdContract(id){
 const c=data.advertising.find(x=>x.id===id);if(!c)return;
 if(c.status==='Terminé'){toast('Ce contrat est déjà terminé.');return}
 if(!confirm(`Terminer le contrat « ${c.advertiser} » et enregistrer une recette de ${money2(c.price)} dans Finances ? Cette action est définitive.`))return;
 const entryId='publicite-'+id;
 const entry={date:new Date().toISOString().slice(0,10),label:`Contrat publicitaire — ${c.advertiser}`,category:'Publicité',type:'Recette',amount:Number(c.price),advertisingId:id};
 try{
  if(db){
   if(uid!==ADMIN_UID)throw Error('Compte administrateur requis');
   const contractRef=firebaseFns.doc(db,'company','mace-mobilite','advertising',id);
   const financeRef=firebaseFns.doc(db,'company','mace-mobilite','finance',entryId);
   await firebaseFns.runTransaction(db,async tx=>{
    const contractSnap=await tx.get(contractRef);
    const financeSnap=await tx.get(financeRef);
    if(!contractSnap.exists())throw Error('Contrat introuvable');
    if(contractSnap.data().status==='Terminé'||financeSnap.exists())throw Error('Ce contrat a déjà été comptabilisé');
    tx.update(contractRef,{status:'Terminé',completedAt:entry.date,financeId:entryId});
    tx.set(financeRef,entry);
   });
  }else{
   if(data.finance.some(f=>f.advertisingId===id)||c.status==='Terminé')throw Error('Recette déjà enregistrée');
   c.status='Terminé';c.completedAt=entry.date;c.financeId=entryId;
   data.finance.push({...entry,id:entryId});localSave();renderAdmin();
  }
  closeAdModal();toast('Contrat terminé : recette ajoutée aux finances.');
 }catch(err){toast('Clôture impossible : '+err.message)}
}
$('#adModalClose').onclick=closeAdModal;
$('#adModal').addEventListener('click',e=>{if(e.target.id==='adModal')closeAdModal()});

function renderDashboard(){const revenue=data.finance.filter(f=>f.type==='Recette'&&f.category!=='Prêt').reduce((v,f)=>v+Number(f.amount||0),0),expenses=data.finance.filter(f=>f.type==='Dépense'&&f.category!=='Remboursement de prêt').reduce((v,f)=>v+Number(f.amount||0),0),profit=revenue-expenses;const kpis=[['Véhicules',data.vehicles.length,'Parc enregistré'],['Lignes',data.lines.length,'Réseau exploité'],['Personnel',data.staff.length,'Collaborateurs'],['Résultat',money(profit),profit>=0?'Solde positif':'Solde négatif']];const max=Math.max(1,revenue,expenses);$('#adminContent').innerHTML=`${!db?'<div class="notice warning">Vous êtes en mode démonstration. Rien n’est synchronisé avec Google : <strong>exportez vos données</strong> avant de changer de navigateur.</div>':''}<div class="admin-kpis">${kpis.map(([a,b,c])=>`<div class="kpi"><label>${esc(a)}</label><strong>${esc(b)}</strong><div class="kpi-foot">${esc(c)}</div></div>`).join('')}</div><div class="dual-panels"><div class="panel"><h3>Situation financière</h3><div class="simple-chart"><div style="height:${Math.max(4,100*revenue/max)}%" title="Recettes"></div><div style="height:${Math.max(4,100*expenses/max)}%" title="Dépenses"></div></div><div class="chart-key">Recettes ${money(revenue)} · Dépenses ${money(expenses)}</div><p style="margin-top:15px;font-size:12px;color:#91a2ac">Totaux des opérations enregistrées, toutes périodes confondues.</p></div><div class="panel"><h3>Dernières actualités</h3>${data.news.length?[...data.news].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,4).map(n=>`<p style="font-size:13px;color:#4d6372;border-bottom:1px solid #ecf0f3;padding:9px 0"><strong>${esc(n.title)}</strong><br><small>${esc(niceDate(n.date))}</small></p>`).join(''):empty('Aucune actualité.')}</div></div><div class="panel"><h3>Accès rapides</h3><div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn primary" data-quick="vehicles">+ Véhicule</button><button class="btn outline dark" data-quick="lines">+ Ligne</button><button class="btn outline dark" data-quick="finance">+ Opération financière</button><button class="btn outline dark" data-quick="news">+ Actualité</button></div></div>`;document.querySelectorAll('[data-quick]').forEach(b=>b.onclick=()=>{currentTab=b.dataset.quick;renderAdmin();openEditor(currentTab)})}
function openEditor(k,record=null){
  editTarget=record||null;
  const c=categories[k];
  $('#editTitle').textContent=(record?'Modifier':'Ajouter')+' · '+c.title.toLowerCase();
  const optionalFields={
    vehicles:['photoUrl','engine','registration','commissioned','mileage','lastService','nextInspection'],
    team:['photoUrl'],
    lines:['distanceKm','travelTime','stopCount','stops','chargingStations','mapUrl'],
    staff:['employeeNumber','hireDate','contractEnd','assignment','fcoExpiry','salary']
  };
  const htmlFields=c.fields.map(([key,label,type,options])=>{
    const val=record?.[key] ?? '';
    const required=!(optionalFields[k]||[]).includes(key);
    const name=esc(key);
    if(type==='select'){
      const choices=(options||[]).map(o=>`<option value="${esc(o)}" ${val===o?'selected':''}>${esc(o)}</option>`).join('');
      return `<label>${esc(label)}<select name="${name}" ${required?'required':''}>${choices}</select></label>`;
    }
    if(type==='textarea'){
      return `<label>${esc(label)}<textarea name="${name}" ${required?'required':''}>${esc(val)}</textarea></label>`;
    }
    return `<label>${esc(label)}<input name="${name}" type="${esc(type)}" value="${esc(val)}" ${type==='number'?'min="0" step="any"':''} ${required?'required':''}></label>`;
  });
  $('#dynamicFields').innerHTML=htmlFields.join('');
  if(k==='staff'){
    const role=$('#dynamicFields').querySelector('[name="role"]');
    const contract=$('#dynamicFields').querySelector('[name="contractType"]');
    const end=$('#dynamicFields').querySelector('[name="contractEnd"]');
    const fco=$('#dynamicFields').querySelector('[name="fco"]');
    const expiry=$('#dynamicFields').querySelector('[name="fcoExpiry"]');
    const refresh=()=>{
      // Contract rate applies to drivers; temporary contracts may apply to any profession.
      contract.closest('label').hidden=!(['Conducteur','Conductrice'].includes(role.value)||contract.value==='Intérimaire');
      end.closest('label').hidden=contract.value!=='Intérimaire';
      end.required=contract.value==='Intérimaire';
      fco.closest('label').hidden=role.value!=='Conducteur';
      expiry.closest('label').hidden=!(['Conducteur','Conductrice'].includes(role.value)&&fco.value==='Oui');
      expiry.required=['Conducteur','Conductrice'].includes(role.value)&&fco.value==='Oui';
    };
    role.addEventListener('change',()=>{
      if(role.value!=='Conducteur'&&contract.value!=='Intérimaire')contract.value='100 %';
      refresh();
    });
    contract.addEventListener('change',refresh);
    fco.addEventListener('change',refresh);
    refresh();
  }
  if(k==='finance'){
 const linkNeeded=['Prêt','Remboursement de prêt'].includes(record?.category);
 const options=data.loans.map(l=>`<option value="${esc(l.id)}" ${record?.loanId===l.id?'selected':''}>${esc(l.reference||l.lender||'Prêt')} — ${esc(l.lender)}</option>`).join('');
 $('#dynamicFields').insertAdjacentHTML('beforeend',`<label id="loanLinkLabel" ${linkNeeded?'':'hidden'}>Prêt associé<select name="loanId" id="loanLinkSelect"><option value="">Sélectionner un prêt</option>${options}</select></label>`);
 const category=$('#dynamicFields').querySelector('[name="category"]');
 const type=$('#dynamicFields').querySelector('[name="type"]');
 const linkLabel=$('#loanLinkLabel'),linkSelect=$('#loanLinkSelect');
 const updateLink=()=>{
   const isLoan=['Prêt','Remboursement de prêt'].includes(category.value);
   linkLabel.hidden=!isLoan;
   linkSelect.required=isLoan;
   if(!isLoan)linkSelect.value='';
   if(category.value==='Prêt')type.value='Recette';
   if(category.value==='Remboursement de prêt')type.value='Dépense';
 };
 category.addEventListener('change',updateLink);
 updateLink();
 }
 if(k==='team'||k==='vehicles'){
  const field=$('#dynamicFields').querySelector('[name="photoUrl"]');
  if(field){
    const imagePreview=document.createElement('div');
    imagePreview.className='photo-editor-preview';
    field.closest('label').insertAdjacentElement('afterend',imagePreview);
    const updatePreview=()=>{
      imagePreview.innerHTML=photoMarkup(field.value,'photo-preview-image','Aperçu de la photo') || '<span>Colle un lien HTTPS vers une photo FiveManage pour afficher l’aperçu ici.</span>';
    };
    field.addEventListener('input',updatePreview);updatePreview();
  }
 }
 $('#editModal').dataset.category=k;$('#editModal').hidden=false}
function closeEditor(){$('#editModal').hidden=true;editTarget=null}
$('#editForm').addEventListener('submit',async e=>{e.preventDefault();const k=$('#editModal').dataset.category,form=new FormData(e.target),record=Object.fromEntries(form.entries());const btn=e.target.querySelector('[type=submit]');if(k==='finance'){if((record.category==='Prêt'||record.category==='Remboursement de prêt')&&!record.loanId){toast('Sélectionne le prêt associé à cette opération.');return}if(record.category==='Prêt'&&record.type!=='Recette'){toast('Un prêt reçu doit être une recette.');return}if(record.category==='Remboursement de prêt'&&record.type!=='Dépense'){toast('Un remboursement doit être une dépense.');return}if(!['Prêt','Remboursement de prêt'].includes(record.category)){record.loanId=''}}btn.disabled=true;try{await saveRecord(k,record);closeEditor();toast('Enregistrement réussi')}catch(err){toast('Enregistrement impossible : '+err.message)}finally{btn.disabled=false}});
$('#closeEditor').onclick=closeEditor;$('#cancelEditor').onclick=closeEditor;
$('#adminButton').onclick=()=>{if(databaseReady&&!db){toast('Connexion Firebase indisponible');return}if(databaseReady&&!uid){$('#loginModal').hidden=false}else showAdmin()};$('#closeLogin').onclick=()=>$('#loginModal').hidden=true;
$('#loginForm').onsubmit=async e=>{e.preventDefault();$('#loginError').hidden=true;if(!db){if(databaseReady){$('#loginError').textContent='Firebase n’est pas disponible';$('#loginError').hidden=false;return}showAdmin();return}try{await firebaseFns.signInWithEmailAndPassword(auth,$('#loginEmail').value,$('#loginPassword').value);$('#loginPassword').value='';if(auth.currentUser?.uid!==ADMIN_UID){await firebaseFns.signOut(auth);throw Error('Compte non autorisé')}showAdmin()}catch(err){$('#loginError').textContent='Connexion refusée. Vérifiez les identifiants et l’activation du compte.';$('#loginError').hidden=false;console.error(err)}};
$('#returnBtn').onclick=showPublic;$('#signOutBtn').onclick=async()=>{if(auth){await firebaseFns.signOut(auth);toast('Déconnecté')}else toast('Démonstration terminée');showPublic()};
$('#adminTabs').onclick=e=>{const b=e.target.closest('[data-tab]');if(!b)return;currentTab=b.dataset.tab;renderAdmin()};
$('#exportBtn').onclick=()=>{const blob=new Blob([JSON.stringify({exportedAt:new Date().toISOString(),data},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='mace-mobilite-sauvegarde.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};
$('#menuToggle').onclick=()=>$('#nav').classList.toggle('open');document.querySelectorAll('.navlink').forEach(a=>a.onclick=()=>$('#nav').classList.remove('open'));$('#year').textContent=new Date().getFullYear();
initializeFirebase();
