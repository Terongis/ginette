/* Estimation des prix — prix moyens en grande surface (France, 2025-2026), en €/kg.
   C'est un ordre de grandeur pour comparer les recettes, pas le prix exact du Drive.
   Chaque règle : [motif, €/kg, poids d'une pièce en g, {poids par unité}] */
"use strict";
const PRICE_RULES=[
 // en premier : mots qui pièges les règles suivantes
 [/bouillon|fond de|fumet/,0.6,250,{cube:250}],[/graisse de canard|saindoux/,9,0],[/champignon|pleurote|chanterelle/,5,20],[/potimarron/,2.2,1200],
 [/cepes? (seche|deshydrate)|morille|cepes? seche/,120,0],[/cepe|girolle/,35,0],[/manchon/,12,120],
 // poissons et fruits de mer
 [/saint-jacques/,60,25],[/crevette/,20,15],[/moule/,6,20],[/coque/,12,10],
 [/saumon fume|truite fumee/,40,20,{tranche:20}],[/saumon|truite/,22,130],
 [/cabillaud|colin|lieu|merlan|poisson|dorade|bar\b|sole|maquereau|sardine/,15,130],
 [/thon/,13,140],[/anchois/,30,4],
 // viandes
 [/filet de boeuf|filet mignon de veau|rognon/,38,150],[/roti de boeuf|bavette|entrecote|steak/,24,150],
 [/boeuf hache|viande de boeuf hachee|viande hachee|veau hache/,12,125],[/boeuf|paleron|joue de boeuf|bourguignon/,15,200],
 [/escalope de veau|cote de veau|filet de veau|roti de veau/,26,150],[/paupiette/,14,150],[/veau/,18,150],
 [/canard confit|cuisses? de canard/,20,250],[/magret|canard/,22,350],
 [/^poulet$|poulet entier/,7,1500],[/filet de poulet|filets de poulet|blanc de poulet|blancs de poulet|escalope|aiguillette|filet de dinde|filets de dinde/,12,130],
 [/pilon|cuisse/,7,250],[/poulet|dinde|volaille|pintade/,9,150],
 [/filet mignon|mignon de porc/,14,400],[/echine|cote de porc|roti de porc|joue|porc|travers/,10,200],
 [/saucisse de morteau|saucisses de morteau/,15,350],[/saucisse|chipolata|chair a saucisse/,10,100],
 [/chorizo/,18,30,{tranche:5}],[/lardon|bacon|poitrine|lard|pancetta/,14,20,{tranche:20}],
 [/jambon cru|jambon de parme|jambon de bayonne|fines de jambon/,35,15,{tranche:15}],[/jambon/,15,45,{tranche:45}],
 [/restes de viande/,0,0],
 // crèmerie
 [/parmesan|pecorino/,25,10],[/comte|beaufort|abondance/,20,30],[/gruyere|emmental|fromage rape|mimolette|raclette|pate pressee|cantal/,12,30],
 [/mozzarella/,10,125],[/feta/,12,200],[/chevre/,15,150],[/gorgonzola|roquefort|bleu|persillee/,16,100],
 [/ricotta|mascarpone|fromage frais|tartiner|saint-moret|boursin/,9,30],[/fromage blanc|yaourt|skyr/,3,125],[/fromage/,12,30],
 [/creme/,5,15],[/lait de coco/,5,400],[/lait concentre/,4,400],[/boisson vegetale/,3,1000],[/lait\b/,1.1,1000],
 [/beurre de cacahuete/,10,15],[/beurre/,10,10],[/jaune|oeuf/,5,60],
 // épicerie
 [/huile d'olive/,9,10],[/huile de sesame|huile de noix/,15,10],[/huile/,3,10],
 [/vinaigre balsamique|vinaigre de xeres/,7,15],[/vinaigre/,3,15],
 [/riz special risotto|risotto|arborio/,4,0],[/riz/,2.5,0],
 [/pates fraiches|gnocchi/,6,0],[/lasagne/,3,20,{feuille:20}],[/pate|crozet|spaghetti|tagliatelle|penne|macaroni|coquillette/,2.5,0],
 [/quinoa/,7,0],[/boulgour|polenta|ble|semoule/,3.5,0],[/farine/,1,0],[/fecule|maizena/,4,0],[/chapelure/,4,0],
 [/pain de mie/,3,25,{tranche:25}],[/pate feuilletee|pate brisee/,6,230],[/galette/,10,50],[/pain/,4,40,{tranche:40}],
 [/lentille/,4,0],[/pois chiche|haricots? blancs?|haricots? rouges?|flageolet/,3,0],
 [/chataigne|^marrons?\b|marrons? entiers/,15,10],
 [/concentre de tomate/,6,0],[/tomates? (concassee|entiere|pelee)|pulpe de tomate|puree de tomate|coulis|sauce tomate|tomates en conserve/,2.5,0],
 [/tomates? sechee|tomates? confite/,20,0],
 [/sauce soja|sauce de soja|sauce de poisson|sauce d'huitre/,8,0],[/moutarde/,5,0],[/ketchup|mayonnaise/,5,0],
 [/olive/,12,4],[/capre|cornichon|petits oignons au vinaigre/,10,8],[/artichaut/,8,40],
 [/miel/,12,0],[/sirop d'erable/,25,0],[/sucre|cassonade|vergeoise/,1.5,0],[/levure/,20,10,{sachet:10}],
 [/vanille/,0,0,{gousse:0}],
 [/pignons? de pin|^pignons?$/,50,0],[/noix|noisette|amande|cacahuete|graines de courge|pistache|cajou/,15,0],
 [/pruneau|raisins secs|canneberge|abricots secs/,10,10],
 [/vin|cidre|biere/,5,0],[/madere|cognac|porto|calvados/,20,0],
 [/jus d'orange/,2,0],[/jus de citron|zeste de citron|citron/,3.5,120,{zeste:0}],
 // fruits et légumes
 [/pommes? de terre|grenaille/,1.5,150],[/patates? douces?/,3,300],
 [/carotte/,1.5,100],[/oignons? nouveaux|ciboule/,3,30,{botte:150}],[/oignon/,2,120],[/echalote/,6,30],[/\bail\b/,10,5,{gousse:5}],
 [/blancs? de poireau/,3,150],[/poireau/,2.5,250],[/courgette/,2.5,250],
 [/tomates? cerise/,7,15],[/tomate/,3,120],
 
 [/epinards? surgele/,3,0],[/epinard|pousses|roquette|mache|jeunes pousses|salade|laitue/,12,300,{feuille:10}],
 [/brocoli/,3,400],[/feuilles? de chou/,2.5,30],[/chou-fleur|chou fleur|bouquets de chou/,2.5,800],[/chou/,2,1000,{feuille:30}],
 [/celeri-rave|celeri rave/,2.5,800],[/celeri/,3,50,{branche:50}],
 [/potiron|potimarron|butternut|courge/,2.2,1200],
 [/petits pois surgel|petits pois/,3.5,0],[/haricots? verts? surgel/,3,0],[/haricot vert|haricots verts/,6,0],[/feve/,8,0],
 [/poivron/,4,180],[/aubergine/,3.5,300],[/fenouil/,3.5,300],[/concombre/,2,350],[/endive/,3.5,120],[/asperge/,12,25],
 [/navet|panais|topinambour|betterave|radis/,3,150],[/legumes varies|julienne|poelee/,4,0],[/mais/,4,0],
 [/orange/,2.5,200],[/pomme/,2.5,150],[/poire/,3,150],[/framboise|myrtille|fraise/,20,0],
 [/gingembre/,10,50],
 // herbes fraîches et épices
 [/persil|ciboulette|basilic|coriandre|aneth|menthe|estragon|cerfeuil|thym|romarin|sauge|oseille|herbes aromatiques|garni/,30,30,{brin:2,branche:3,feuille:0.5,bouquet:30,botte:30,tige:2,"c. à soupe":3,"c. à café":1}],
 [/laurier/,30,0.3,{feuille:0.3}],
 [/curry|cumin|paprika|muscade|cannelle|curcuma|ras el|herbes de provence|origan|girofle|genievre|baies|poivre|anis|graines|piment|safran|epices/,50,0.5,{pincee:0.3,"clou":0.2}],
 [/avocat/,8,200],[/mangue|ananas|melon/,4,600],[/clementine|mandarine/,3,80],[/datte/,10,8],[/cresson/,12,0],[/pois gourmand/,9,0],
 [/cheddar|reblochon|camembert/,13,250],[/tofu/,10,0],[/langoustine/,30,40],[/flocons/,3,0],[/couscous/,2.5,0],[/rumsteck/,24,150],[/raie|eglefin|haddock|maigre/,18,130],
 [/sel/,1,0],[/eau/,0,0]];
const UNIT_G={"g":1,"kg":1000,"ml":1,"cl":10,"l":1000,"c. à soupe":15,"c. à café":5,"pincée":0.4,"gousse":5,"cube":10,"brin":2,"branche":3,"botte":30,"bouquet":30,"tige":2,"filet":10,"sachet":10};
const nrm=s=>String(s||"").toLowerCase().replace(/œ/g,"oe").replace(/æ/g,"ae").normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[’`]/g,"'").replace(/\s+/g," ").trim();
const ruleFor=name=>{const n=nrm(name);for(const r of PRICE_RULES)if(r[0].test(n))return r;return null;};
/* coût estimé (en €) d'une quantité d'ingrédient */
function ingCost(name,qty,unit){const r=ruleFor(name);const kg=r?r[1]:8,pw=r?r[2]:50,um=(r&&r[3])||{};
  const q=qty==null?1:Number(qty)||0,u=unit||"";let g;
  if(u==="pièce"&&q>50)g=q; // quantité saisie en grammes par erreur
  else if(u in um)g=q*um[u];
  else if(u==="g"||u==="kg"||u==="ml"||u==="cl"||u==="l")g=q*UNIT_G[u];
  else if(u==="pièce"||u===""||u==="tranche"||u==="feuille")g=q*(pw||50);
  else if(u==="filet")g=q*(pw>=100?Math.min(pw,200):10);
  else g=q*(UNIT_G[u]||(pw||10));
  return kg*g/1000;}
