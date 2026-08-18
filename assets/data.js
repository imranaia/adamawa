/* ============================================================
   ADAMAWA — shared knowledge base.
   Every figure is drawn from the cited sources; see footer for
   the full list. Population and mineral tonnage are marked as
   estimates where the underlying sources are projections rather
   than counts. Nothing here is invented — where public data does
   not exist (e.g. exact per-LGA language percentages, or a few
   landmark/LGA coordinates), the relevant field says so rather
   than guessing.
   ============================================================ */
window.__ADAMAWA_DATA__ = (function(){
  var DATA = {};

  /* Yola town / Yola South — used as the fixed reference point for
     every "distance from the capital" figure on the site. */
  DATA.yola = { lat: 9.183, lng: 12.467 };
  DATA.mapView = { bounds: [[7.35, 11.30],[11.02, 13.82]] };

  /* Simplified outline of Adamawa State's administrative boundary — used to
     dim everything outside the state (Cameroon, Borno, Gombe, Taraba) on the
     map backdrop, and to cap how far a viewer can pan/zoom out.
     Simplified (Ramer–Douglas–Peucker, epsilon 0.018) from geoBoundaries.org's
     open Nigeria ADM1 dataset (CC BY 4.0-equivalent open license). */
  DATA.adamawaBoundary = [[10.0339,11.8358],[9.8407,11.8012],[9.7935,11.8545],[9.7409,11.8172],[9.6275,11.6345],[9.6563,11.6136],[9.6051,11.563],[9.5985,11.468],[9.5496,11.4296],[9.4885,11.4438],[9.4078,11.5259],[9.3261,11.5307],[9.3054,11.6477],[9.2295,11.6874],[9.0745,11.7068],[9.0084,11.8311],[8.9471,11.8715],[8.7391,11.8271],[8.6776,11.7431],[8.6412,11.7889],[8.6172,11.7576],[8.5462,11.7945],[8.4709,11.7302],[8.4037,11.6129],[8.3866,11.6298],[8.2459,11.5463],[8.0187,11.3415],[7.7998,11.4898],[7.9033,11.5516],[7.908,11.5904],[7.8658,11.6464],[7.7504,11.633],[7.7248,11.758],[7.4879,11.7719],[7.3912,11.8527],[7.5778,12.0436],[7.715,12.0331],[7.9945,12.2211],[8.1068,12.2015],[8.1978,12.2556],[8.3267,12.2372],[8.4194,12.2633],[8.4648,12.586],[8.4934,12.6026],[8.4672,12.6812],[8.5719,12.7549],[8.5648,12.8263],[8.6504,12.8168],[8.7504,12.8787],[8.9712,12.8443],[8.9931,12.9252],[9.0635,12.9423],[9.3481,12.8978],[9.4961,13.0239],[9.5267,13.1867],[9.5789,13.2392],[9.7517,13.2597],[9.9077,13.2355],[9.9711,13.2864],[10.0376,13.2451],[10.0997,13.318],[10.1197,13.4103],[10.1719,13.4622],[10.2175,13.4636],[10.2145,13.5077],[10.3898,13.4922],[10.3938,13.5188],[10.6436,13.5608],[10.9141,13.7507],[10.9495,13.5854],[10.8784,13.3831],[10.9306,13.3457],[10.7373,13.3194],[10.5889,13.2325],[10.5079,13.248],[10.4089,13.1971],[10.4644,13.052],[10.5481,12.9586],[10.5795,12.7446],[10.439,12.6525],[10.4921,12.5788],[10.3951,12.5574],[10.3714,12.4216],[10.3505,12.3792],[10.3171,12.3869],[10.3151,12.3128],[10.3598,12.2572],[10.2808,12.2127],[10.2367,12.136],[10.1425,12.089],[10.0605,12.0868],[10.0669,12.0188],[10.0353,11.9912],[10.0247,11.9207],[10.0339,11.8358]];
  DATA.adamawaBoundarySource = 'geoBoundaries.org — Nigeria ADM1 (open license), simplified';

  DATA.facts = {
    'population':      { v: '≈4.9 million (2022 est.)', src: 'citypopulation.de, 2022 projection — no Nigerian census since 2006' },
    'population-2':    { v: '≈4.9M', src: '2022 est.' },
    'state-founded':   { v: '27 Aug 1991', src: '' },
    'state-founded-2': { v: '1991', src: '' },
    'land-area':       { v: '36,917 km²', src: '' }
  };

  DATA.governor = {
    name: 'Ahmadu Umaru Fintiri',
    title: 'Executive Governor, Adamawa State',
    bio: 'Born 27 October 1967 in Gulak, Madagali LGA. Read History at the University of Maiduguri, later serving in — and rising to Speaker of — the Adamawa State House of Assembly. Became acting governor in 2014, was elected in a March 2019 supplementary poll, and was re-elected in 2023 — a result the Supreme Court upheld on 10 January 2024. On 27 February 2026 he defected from the PDP to the ruling APC, becoming that party’s 30th sitting state governor nationally — a notable shift given Adamawa is the political home state of PDP figure Atiku Abubakar.',
    source: 'Source: Wikipedia; Premium Times, 10 Jan 2024; The ICIR &amp; Guardian Nigeria, 27 Feb 2026',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/0/03/Ahmadu_Fintiri.jpg',
    photoCredit: 'Wikimedia Commons, CC BY 4.0'
  };

  /* Every governor and military administrator of Adamawa State since its
     creation on 27 Aug 1991, most recent first. Source for the full run:
     Wikipedia's "List of governors of Adamawa State" plus each
     administration's individual article — see footer for links.
     One genuine unresolved conflict in the public record is flagged
     rather than silently resolved: see the note on the first governor. */
  DATA.governors = [
    { name: 'Ahmadu Umaru Fintiri', term: '29 May 2019 – present', party: 'APC (since 27 Feb 2026; previously PDP)', current: true,
      photo: 'https://upload.wikimedia.org/wikipedia/commons/0/03/Ahmadu_Fintiri.jpg',
      note: 'Elected in a March 2019 supplementary poll and re-elected 2023 — both wins were first declared inconclusive before being confirmed in run-offs. Also served as acting governor for under three months in 2014, immediately after Murtala Nyako’s impeachment.',
      source: 'Wikipedia — Ahmadu Fintiri' },
    { name: 'Mohammed Umaru "Bindow" Jibrilla', term: '29 May 2015 – 29 May 2019', party: 'APC', current: false,
      note: 'Former Senator for Adamawa North (2011–15) and Mubi business owner. Defeated Nuhu Ribadu and Markus Gundiri to win in 2015; lost his re-election bid to Fintiri in 2019.',
      source: 'Wikipedia — Bindow Jibrilla' },
    { name: 'Bala James Ngilari', term: '8 Oct 2014 – 29 May 2015', party: 'PDP', current: false,
      note: 'Previously Deputy Governor under Nyako (2007–14). A lawyer by training; convicted of corruption in March 2017, then acquitted on appeal that July.',
      source: 'Wikipedia — Bala James Ngilari' },
    { name: 'Murtala Hamman-Yero Nyako', term: '29 Apr 2008 – 15 Jul 2014 (2nd term)', party: 'PDP, later APC', current: false,
      note: 'Impeached 15 July 2014 on 16 counts of gross misconduct; the Court of Appeal later called the impeachment "illegal, null and void" (2016), though the Supreme Court declined to reinstate him. Former Chief of Naval Staff, known locally as "Baba Mai Mangoro" for his mango and dairy farms.',
      source: 'Wikipedia — Murtala Nyako' },
    { name: 'James Shaibu Barka', term: '26 Feb 2008 – 29 Apr 2008', party: 'Acting Governor', current: false,
      note: 'Took over after Nyako’s 2007 election was nullified, then handed back to Nyako once he won the re-run.',
      source: 'Wikipedia — James Shaibu Barka' },
    { name: 'Murtala Hamman-Yero Nyako', term: '29 May 2007 – 26 Feb 2008 (1st term)', party: 'PDP', current: false,
      note: 'His first term was cut short when an electoral tribunal nullified his 2007 election; he won the subsequent re-run.',
      source: 'Wikipedia — Murtala Nyako' },
    { name: 'Boni Haruna', term: '29 May 1999 – 29 May 2007', party: 'PDP', current: false,
      note: 'First elected civilian governor of the Fourth Republic. Publicly opposed a 2006 Obasanjo third-term bid; later named among 31 governors placed under EFCC investigation.',
      source: 'Wikipedia — Boni Haruna' },
    { name: 'Lt-Col Ahmadu G. Hussaini', term: 'Aug 1998 – 29 May 1999', party: 'Military Administrator', current: false,
      note: 'Oversaw the final stretch of Gen. Abdulsalami Abubakar’s transition to civilian rule, handing over to Boni Haruna at the start of the Fourth Republic.',
      source: 'Wikipedia' },
    { name: 'Joe A. Kalu-Igboama', term: 'Aug 1996 – Aug 1998', party: 'Military Administrator', current: false,
      note: 'A Nigerian Navy captain who administered the state under the Abacha regime; little further biographical detail is publicly documented.',
      source: 'Wikipedia — Joe Kalu-Igboama' },
    { name: 'Mustapha Ismail', term: '14 Sep 1994 – Aug 1996', party: 'Military Administrator', current: false,
      note: 'Previously administered Kwara State (1993–94), where he founded Kwara State University and Kwara State Polytechnic.',
      source: 'Wikipedia — Mustapha Ismail' },
    { name: 'Gregory Agboneni', term: '9 Dec 1993 – 14 Sep 1994', party: 'Military Administrator', current: false,
      note: 'A retired Air Vice Marshal who trained as a pilot with the US Air Force in 1971–72; went on to administer Cross River State from 1994.',
      source: 'Wikipedia — Gregory Agboneni' },
    { name: 'Abubakar Saleh Michika', term: '2 Jan 1992 – 17 Nov 1993', party: 'NRC', current: false,
      note: 'Civilian governor of the aborted Third Republic. Built the Bajabure Housing Estate and an agricultural college in Hong, introduced free WAEC fees, and initiated the State Polytechnic at Yola. Died 10 March 2018.',
      source: 'Wikipedia — Abubakar Saleh Michika' },
    { name: 'Abubakar Salihu', term: '27 Aug 1991 – 2 Jan 1992', party: 'Military Governor', current: false,
      photo: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Abubakar_Salihu.jpg',
      note: 'Adamawa State’s first military governor, previously military governor of Gongola State from 1989. Adamawa State Polytechnic was established during his brief tenure. A note on the record: a separate Wikipedia article credits this same post and dates to "Wilson Sabiya" instead — Wikipedia itself flags that claim as failed verification, and Salihu’s own article makes no mention of him. We show the better-supported attribution rather than silently pick a winner in a genuinely unresolved public record.',
      source: 'Wikipedia — Abubakar Salihu' }
  ];

  /* History timeline, chronological. */
  DATA.eras = [
    { when: 'before 1809', title: 'Before the jihad', body: 'Oral tradition in the Numan/Demsa area credits the founding of Bata-related settlements to the figure Nzeanzo, independent of — and predating — the Fulani jihad that would later sweep the region.', source: 'Kirk-Greene, "Adamawa Past and Present" (via Taylor & Francis)' },
    { when: 'c. 1809', title: 'A flag from Sokoto', body: 'Modibbo Adama, a Fulani scholar born in present-day Adamawa, receives a flag of authority from Shehu Usman dan Fodio and is named Lamido Fombina — ruler of the southlands — with a mandate to extend Fulani rule south of Bornu.' },
    { when: '1810', title: 'The fall of Demsa', body: 'Early in the jihad, a force under Ardo Hamman routs Demsa, then capital of the powerful Bata states, extending the nascent Adamawa Emirate beyond its original base at Gurin.', source: 'Wikipedia — Adamawa Emirate' },
    { when: '1841', title: 'Yola becomes the seat', body: 'After moving his capital several times during years of campaigning, Adama settles it at Yola. It has remained the seat of the Adamawa Emirate ever since, and later becomes the state capital.' },
    { when: '19th century', title: 'An emirate at its height', body: 'At its peak, Fombina covers roughly 40,000 square miles — from Marua and Madagali in the north to Ngaoundéré and Tibati in the south, and from Rei Buba in the east to Mayo Lope in the west — spanning what is today northeastern Nigeria and northern Cameroon.', source: 'Wikipedia — Adamawa Emirate' },
    { when: '1901–1903', title: 'An empire, partitioned', body: 'Frederick Lugard sends a British expedition that captures and burns parts of Yola in September 1901 over resistance from Lamido Zubairu’s forces; Zubairu flees and leads a brief guerrilla resistance until his death in 1903. Britain, Germany and France then formally divide Fombina between them — roughly seven-eighths of the old emirate falls on the German side, in what is now Cameroon, while Britain folds Yola into the Northern Nigeria Protectorate.', source: 'Wikipedia — Adamawa Wars' },
    { when: '1903', title: 'Numan takes shape', body: 'A small British force is permanently stationed at Numan, near the Benue–Gongola confluence, establishing it as an administrative headquarters — the origin of the town’s modern role.', source: 'Encyclopaedia Britannica — Numan' },
    { when: '1959–1961', title: 'Sardauna Province, briefly', body: 'The northern part of the former British Cameroons trust territory operates as a quasi-regional government headquartered at Mubi — in what is now Adamawa State — ahead of a United Nations plebiscite on its future.', source: 'Wikipedia — 1961 British Cameroons referendum' },
    { when: '11 Feb 1961', title: 'A vote to rejoin Nigeria', body: 'The Muslim-majority Northern Cameroons votes in a UN plebiscite to join Nigeria rather than the newly independent Republic of Cameroon, formally becoming Sardauna Province of Nigeria’s Northern Region that June 1st — the direct territorial ancestor of Adamawa’s northern LGAs, including Mubi North, Mubi South, Michika and Madagali.', source: 'Wikipedia — 1961 British Cameroons referendum' },
    { when: '1967', title: 'North-Eastern State', body: 'General Yakubu Gowon’s restructuring of Nigeria into twelve states places the Adamawa area within the newly created North-Eastern State — the intermediate step between the old Northern Region and the later Gongola/Adamawa split.', source: 'Wikipedia — North-Eastern State' },
    { when: '1976', title: 'Gongola State', body: 'Nigeria’s post-independence reorganisation carves Gongola State out of the former North-Eastern State, uniting the old Adamawa and Sardauna provinces under one administration.' },
    { when: '27 Aug 1991', title: 'Adamawa State', body: 'The federal military government splits Gongola State in two. The northern half — home to the historic Adamawa Emirate — becomes Adamawa State, taking Yola, the emirate’s old capital, as its own.' },
    { when: 'Aug–Nov 2014', title: 'War reaches four LGAs', body: 'Boko Haram captures Michika (17–18 Aug), Madagali (21 Aug) and Mubi (29 Oct, briefly renamed "Madinatul Islam"), putting four local government areas under insurgent control and displacing thousands. The military, aided by local vigilantes, retakes Mubi by 13 November 2014; most affected areas are liberated by February 2015.', source: 'Sahara Reporters; Vanguard; TheCable' },
    { when: '27 Feb 2026', title: 'A governor changes parties', body: 'Sitting governor Ahmadu Fintiri defects from the PDP to the ruling APC, becoming the party’s 30th governor nationally — a notable shift given Adamawa is the political home state of PDP figure Atiku Abubakar.', source: 'The ICIR; Guardian Nigeria' }
  ];

  /* lat/lng are town-centre approximations for the LGA headquarters, used
     to drive the map backdrop and straight-line distance-from-Yola figures.
     Two are flagged as lower-confidence (Gulak, Gella) because Wikipedia
     itself only gives an LGA-level coordinate rather than a town-specific
     one. languages lists document which language/ethnic groups are
     recorded as present in the area per Wikipedia's Adamawa State article —
     these are NOT census percentages, which are not published at LGA level
     anywhere in the public record. */
  DATA.lgas = [
    { name: 'Demsa', zone: 'south', hq: 'Demsa', lat: 9.417, lng: 12.133,
      languages: ['Bali', 'Bata', 'Bille', 'Mbula-Bwazza', 'Wakka'],
      note: 'Historically part of the Bachama/Bwatiye kingdom’s domain — Demsa hosts one of the two royal palaces of the Hama Bata, a Bwatiye traditional ruler, and is a centre of the Bwatiye Vunon festival marking the start of the farming season.',
      source: 'Wikipedia — Bwatiye people' },
    { name: 'Fufore', zone: 'central', hq: 'Fufore', lat: 9.217, lng: 12.650,
      languages: ['Fulfulde', 'Bata', 'Mumuye'],
      note: 'Home ground of Yadim Waterfall (also known locally as Sella Negis), one of the state’s most-visited natural sites.' },
    { name: 'Ganye', zone: 'south', hq: 'Ganye', lat: 8.437, lng: 12.051,
      languages: ['Fulfulde', 'Peere', 'Chamba Daka', 'Mumuye'],
      note: 'The worldwide administrative and traditional headquarters of the Chamba (Sama) people, seated by the Gangwari Ganye; oral tradition holds the Chamba migrated from a place called Sham far to the east before settling here — Jada and Toungo LGAs were later carved out of the original Ganye.',
      source: 'Wikipedia — Ganye' },
    { name: 'Girei', zone: 'central', hq: 'Girei', lat: 9.367, lng: 12.550,
      languages: ['Fulfulde', 'Bata', 'Tambo'],
      note: 'Founded in 1853 as a military base by Lamido Muhammad Lawal of the Adamawa Emirate during a siege against the Bata of Bagale; it later grew into a hub for Islamic scholars migrating into Fombina from across the Sokoto Caliphate.',
      source: 'Wikipedia — Girei' },
    { name: 'Gombi', zone: 'central', hq: 'Gombi', lat: 10.168, lng: 12.737,
      languages: ['Bura-Pabir', 'Ga’anda', 'Hwana', 'Lala-Roba', 'Ngwaba'],
      note: 'Garkida, a town in Gombi LGA, is the birthplace of Ekklesiyar Yan’uwa a Nigeria (EYN) — Nigeria’s Church of the Brethren, founded there in 1923 by American missionaries under a tamarind tree, and later attacked by Boko Haram in 2014.',
      source: 'brethren.org; Wikipedia — Gombi' },
    { name: 'Guyuk', zone: 'south', hq: 'Guyuk', lat: 9.906, lng: 11.928,
      languages: ['Longuda (Lunguda)'],
      note: 'Guyuk town was established roughly two centuries ago near large local limestone deposits, which have anchored the LGA’s economy through mining alongside agriculture and commerce along the Gongola River.',
      source: 'Wikipedia — Guyuk' },
    { name: 'Hong', zone: 'central', hq: 'Hong', lat: 10.232, lng: 12.930,
      languages: ['Kilba (Huba)', 'Marghi'],
      note: 'The traditional capital of the Kilba (Hoba) people, who historically lived as separate clan-based mountain communities — including Pella, Gwaja, Hong and Kulinyi, all within present-day Hong LGA — each ruled by its own hilltop chief before later political consolidation.',
      source: 'Wikipedia — Hong, Nigeria / Kilba people' },
    { name: 'Jada', zone: 'south', hq: 'Jada', lat: 8.767, lng: 12.150,
      languages: ['Fulfulde', 'Mumuye', 'Chamba', 'Koma'],
      note: 'The Koma Hills, part of the Alantika Mountains on the Cameroon border, sit within Jada LGA and are home to the culturally distinct Koma people.' },
    { name: 'Lamurde', zone: 'south', hq: 'Lamurde', lat: 9.600, lng: 11.783,
      languages: ['Tsobo', 'Kwa', 'Bacama (Bwatiye)'],
      note: 'Carved out of Numan LGA and established on 14 December 1990; the historical headquarters of the Bwatiye (Bachama) people, predominantly inhabited by the Bwatiye and Tsobo groups.',
      source: 'Wikipedia — Lamurde' },
    { name: 'Madagali', zone: 'north', hq: 'Gulak', lat: 10.799, lng: 13.462, lowConfidenceCoord: true,
      languages: ['Marghi', 'Mafa', 'Sukur'],
      note: 'Home to the Sukur Cultural Landscape — Africa’s first UNESCO World Heritage Site — and the birthplace of Governor Ahmadu Umaru Fintiri.' },
    { name: 'Maiha', zone: 'north', hq: 'Maiha', lat: 9.996, lng: 13.218,
      languages: ['Nzanyi'] },
    { name: 'Mayo-Belwa', zone: 'south', hq: 'Mayo-Belwa', lat: 9.050, lng: 12.050,
      languages: ['Fulfulde', 'Mumuye', 'Wakka'],
      note: 'Founded by Bata settlers as "Gabalwa" in the Mayo Ine valley, then taken over by Lamido Lawal’s forces and renamed Mayo-Belwa. On the evening of 3 August 1974 a roughly 5 kg meteorite fell in the town, seen streaking across the sky and heard up to 25 km away.',
      source: 'Wikipedia — Mayo Belwa' },
    { name: 'Michika', zone: 'north', hq: 'Michika', lat: 10.617, lng: 13.383,
      languages: ['Kamwe'],
      note: 'Kamwe is closely related to the Higi people/language in the surrounding borderland.' },
    { name: 'Mubi North', zone: 'north', hq: 'Mubi', lat: 10.268, lng: 13.264,
      languages: ['Fali'],
      note: 'Mubi was probably founded in the late 18th century under the Mandara sultanate before being absorbed into the Fulani kingdom of Fombina during Modibbo Adama’s jihad; it passed from German to British control in 1914, and was briefly captured and renamed by Boko Haram in October 2014 before being retaken that November.',
      source: 'Wikipedia — Mubi (town) / Mubi North' },
    { name: 'Mubi South', zone: 'north', hq: 'Gella', lat: 10.187, lng: 13.396, lowConfidenceCoord: true,
      languages: ['Gude', 'Mafa'] },
    { name: 'Numan', zone: 'south', hq: 'Numan', lat: 9.467, lng: 12.033,
      languages: ['Bachama', 'Waaja', 'Kaan'],
      note: 'Established as a British administrative headquarters in 1903, near the Benue–Gongola confluence.' },
    { name: 'Shelleng', zone: 'south', hq: 'Shelleng', lat: 9.885, lng: 12.009,
      languages: ['Kanakuru'],
      note: 'Site of the Kiri Dam on the Gongola River — completed in 1982, with a reservoir holding 615 million m³.' },
    { name: 'Song', zone: 'central', hq: 'Song', lat: 9.824, lng: 12.625,
      languages: ['Mboi', 'Yungur'],
      note: 'Home to Three Sisters Rock, a triple rock formation about an hour’s drive from Yola.' },
    { name: 'Toungo', zone: 'south', hq: 'Toungo', lat: 8.117, lng: 12.050,
      languages: ['Chamba', 'Mumuye'] },
    { name: 'Yola North', zone: 'central', hq: 'Jimeta', lat: 9.279, lng: 12.446,
      languages: ['Lakka', 'Mumuye'],
      note: 'Headquartered in Jimeta, Yola’s twin city and Adamawa’s commercial centre.' },
    { name: 'Yola South', zone: 'central', hq: 'Yola Town', lat: 9.183, lng: 12.467,
      languages: ['Fulfulde', 'Mumuye', 'Vere'],
      note: 'The old town of Yola — seat of the Adamawa Emirate since 1841, and now the state capital.' }
  ];

  DATA.minerals = [
    { name: 'Kaolin', where: 'Mubi, Gombi & Ganye', note: 'Used across paint, fertiliser, rubber and paper manufacturing.' },
    { name: 'Gypsum', where: 'Yola South, Lamurde, Guyuk & Numan', note: 'An estimated 5 million tonnes documented across these deposits.' },
    { name: 'Limestone', where: 'Yola South, Guyuk, Demsa, Numan & Fufore', note: '72.9 million metric tons cited by the state planning commission — used in cement and road-building.' },
    { name: 'Also documented', where: 'Across the state', note: 'Gold, granite, trona and diatomite deposits are recorded alongside more than twenty other minerals, with continued small-scale artisanal mining.',
      answer: 'Beyond kaolin, gypsum and limestone, Adamawa also has documented deposits of gold, granite, trona and diatomite, alongside more than twenty other minerals, with continued small-scale artisanal mining.' }
  ];

  DATA.achievements = [
    { title: '₦26bn+ in infrastructure', body: 'State Executive Council approvals include ₦3.89bn for the 11.2km Plum Road in Michika and ₦6.59bn for the Mubi–Garta road overlay, part of over ₦26 billion for roads, agriculture, health and education combined.', source: 'Adamawa State Government', sourceUrl: 'https://adamawastate.gov.ng/fintiris-council-approves-over-n26bn-for-roads-agriculture-health-and-education-projects/' },
    { title: '111 primary healthcare centres', body: 'Built, remodelled or renovated, alongside ₦256 million in state counterpart funding for the 2025 Basic Health Care Provision Fund and a new CT scanner at Yola Specialist Hospital, completed April 2025.', source: 'TG News', sourceUrl: 'https://tgnews.com.ng/beyond-politics-how-governor-ahmadu-umaru-fintiri-is-changing-the-story-of-healthcare-in-adamawa-state/' },
    { title: '21 model schools, ₦24.8bn', body: 'A state-wide school building programme includes the Yola Model School, commissioned by President Bola Tinubu, among 21 model schools built across Adamawa’s local governments.', source: 'Adamawa State Government', sourceUrl: 'https://adamawastate.gov.ng/' },
    { title: 'Fintiri Business Wallet', body: 'An entrepreneur cash-support scheme launched in March 2024, providing direct capital to small business owners and first-time entrepreneurs across the state.', source: 'Adamawa State Government', sourceUrl: 'https://adamawastate.gov.ng/' },
    { title: 'Minimum pension raised to ₦50,000', body: 'The minimum monthly pension for state retirees was raised from under ₦10,000 to ₦50,000, announced alongside further development plans in mid-2026.', source: 'Legit.ng', sourceUrl: 'https://www.legit.ng/nigeria/1720042-adamawa-governor-fintiri-raises-minimum-pension-n50000-monthly/' },
    { title: 'Security "with justice, not just weapons"', body: 'A community-based strategy in response to Boko Haram-linked violence in border LGAs, including a request for a dedicated Police Mobile Base for Madagali — though attacks in the region have continued.', source: 'Peoples Gazette', sourceUrl: 'https://gazettengr.com/we-strengthened-security-in-adamawa-with-justice-not-just-weapons-says-gov-fintiri/' }
  ];

  /* photo URLs are direct Wikimedia Commons file links, verified individually —
     three sites (Njuwa Lake, Yadim/Sella Negis, Sassa Waterfall) have no
     verifiable freely-licensed photo publicly available, so they keep the
     generated texture card instead of a fabricated or unclear-licence image. */
  DATA.landmarks = [
    { name: 'Sukur Cultural Landscape', lga: 'Madagali', lat: 10.7833, lng: 13.5667, note: 'Africa’s first UNESCO World Heritage Site (1999) — a 16th-century hill settlement in Madagali LGA with dry-stone terraces and a still-standing chief’s palace.', palette: ['#2f8f52', '#74d492'], source: 'UNESCO',
      photo: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Hidi%27s_Palace_Sukur.jpg' },
    { name: 'Mandara Mountains', lga: 'Madagali / Michika', lat: 10.6, lng: 13.6, note: 'The volcanic range along the Cameroon border sheltering Sukur and dozens of other terraced hillside settlements.', palette: ['#123d21', '#74d492'],
      photo: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Mandara_Mountains_from_Yola.jpg' },
    { name: 'Kiri Dam', lga: 'Shelleng', lat: 9.6167, lng: 12.0833, note: 'Completed in 1982 on the Gongola River in Shelleng LGA — a 615 million m³ reservoir used for power, irrigation and fishing.', palette: ['#123d21', '#2f8f52'],
      photo: 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Kiri_Reservoir.jpg' },
    { name: 'Njuwa Lake', lga: 'Yola South', lat: 9.25, lng: 12.55, note: 'Yola’s lakeside home to the annual Njuwa fishing festival, held each March through May.', palette: ['#2f8f52', '#74d492'] },
    { name: 'Three Sisters Rock', lga: 'Song', lat: 9.8234, lng: 12.6131, note: 'A striking triple rock formation about an hour’s drive from Yola; the tallest of the three peaks is climbable.', palette: ['#74d492', '#123d21'], source: 'Wikidata',
      photo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/The_three_sisters_rock_song_Local_Government_Area_Song%2C_Adamawa_State_Nigeria.jpeg' },
    { name: 'Koma Hills', lga: 'Jada', lat: 8.774, lng: 12.616, note: 'A highland stretch of the Alantika Mountains on the Cameroon border, home to the culturally distinct Koma people — publicly "discovered" by an NYSC corps member in 1986.', palette: ['#2f8f52', '#0c2a17'], source: 'Wikipedia — Koma people',
      photo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Photo_A_village_of_the_Koma_people_in_the_Atlantika_Mountains_1958_-_Touring_Club_Italiano_BBH_119.jpg' },
    { name: 'Lamido of Adamawa’s Palace', lga: 'Yola South', lat: 9.230, lng: 12.460, note: 'Seat of the traditional Lamido of Adamawa in central Yola; the current Sudano-Sahelian mud-brick structure was built in the early 20th century by Lamido Zubairu, and now also houses a museum of emirate history.', palette: ['#74d492', '#2f8f52'],
      photo: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Lamido_Palace.jpg' },
    { name: 'Yadim Waterfall', lga: 'Fufore', lat: null, lng: null, note: 'Also known locally as Sella Negis — one of the state’s most-visited waterfalls, in Yadim village. Sources use the two names somewhat interchangeably; precise coordinates for the falls themselves are not published, only the general Fufore LGA location.', palette: ['#2f8f52', '#74d492'] },
    { name: 'Sassa Waterfall', lga: 'Toungo', lat: null, lng: null, note: 'A waterfall in Sassa village, Toungo LGA — documented as a local attraction, though no independently verifiable precise coordinates for the site were found.', palette: ['#123d21', '#74d492'] }
  ];

  DATA.sources = [
    { label: 'Adamawa State Government', url: 'https://adamawastate.gov.ng/history/' },
    { label: 'Wikipedia — Adamawa State', url: 'https://en.wikipedia.org/wiki/Adamawa_State' },
    { label: 'Wikipedia — Adamawa Emirate', url: 'https://en.wikipedia.org/wiki/Adamawa_Emirate' },
    { label: 'Wikipedia — Adamawa Wars', url: 'https://en.wikipedia.org/wiki/Adamawa_Wars' },
    { label: 'Wikipedia — Ahmadu Fintiri', url: 'https://en.wikipedia.org/wiki/Ahmadu_Fintiri' },
    { label: 'Wikipedia — List of governors of Adamawa State', url: 'https://en.wikipedia.org/wiki/List_of_governors_of_Adamawa_State' },
    { label: 'UNESCO — Sukur Cultural Landscape', url: 'https://whc.unesco.org/en/list/938/' },
    { label: 'Premium Times — Supreme Court affirms Fintiri’s election', url: 'https://www.premiumtimesng.com/news/top-news/663865-supreme-court-affirms-adamawa-governor-fintiris-election-binani-loses.html' },
    { label: 'The ICIR — Fintiri defects to APC, Feb 2026', url: 'https://www.icirnigeria.org/apc-secures-30th-governor-as-fintiri-defects-from-pdp/' },
    { label: 'citypopulation.de — Adamawa', url: 'https://www.citypopulation.de/en/nigeria/admin/NGA002__adamawa/' },
    { label: 'Nigeria Geological Survey Agency', url: 'https://ngsa.gov.ng/wp-content/uploads/2024/08/Adamawa-State-Mineral-Resources-Map-2021.pdf' },
    { label: 'Wikimedia Commons — governor portraits', url: 'https://commons.wikimedia.org/' },
    { label: 'OpenStreetMap contributors', url: 'https://www.openstreetmap.org/copyright' },
    { label: 'geoBoundaries.org — Nigeria state boundaries', url: 'https://www.geoboundaries.org/' }
  ];

  return DATA;
})();
