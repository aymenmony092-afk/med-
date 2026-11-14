import type { AcademicYearCurriculum, MedicalLesson } from '../types/med';

export const ACADEMIC_YEARS: AcademicYearCurriculum[] = [
  {
    year: 1,
    sectionId: 'annee-1',
    title: 'Première année de médecine',
    cycle: 'Cycle Préclinique',
    description:
      'Acquisition des sciences fondamentales : organisation anatomique du corps humain, biologie cellulaire, biochimie structurale, embryologie, histologie et biophysique.',
    modules: [
      {
        name: 'Anatomie I (Ostéologie, Arthrologie, Myologie)',
        specialty: 'Anatomie',
        coefficient: 3,
        semesters: 'S1 – S2',
        keyTopics: ['Membre supérieur et plexus brachial', 'Membre inférieur et artère fémorale', 'Cage thoracique et rachis'],
      },
      {
        name: 'Biochimie Structurale & Enzymologie',
        specialty: 'Biochimie',
        coefficient: 3,
        semesters: 'S1 – S2',
        keyTopics: ['Glucides et liaison osidique', 'Acides aminés et structure des protéines', 'Cinétique enzymatique de Michaelis-Menten'],
      },
      {
        name: 'Histologie Générale',
        specialty: 'Histologie',
        coefficient: 2,
        semesters: 'S1 – S2',
        keyTopics: ['Épithéliums de revêtement et glandulaires', 'Tissus conjonctifs et cartilagineux', 'Tissu osseux et musculaire'],
      },
      {
        name: 'Embryologie Humaine',
        specialty: 'Embryologie',
        coefficient: 2,
        semesters: 'S1 – S2',
        keyTopics: ['Gamétogenèse et fécondation', 'Gastrulation et neurulation (3e semaine)', 'Dérivés des feuillets embryonnaires'],
      },
    ],
  },
  {
    year: 2,
    sectionId: 'annee-2',
    title: 'Deuxième année de médecine',
    cycle: 'Cycle Préclinique',
    description:
      'Étude intégrée des grands appareils (cardiovasculaire, respiratoire, rénal, nerveux) : anatomie descriptive, physiologie des organes, biochimie métabolique, immunologie et génétique.',
    modules: [
      {
        name: 'Physiologie Cardiovasculaire & Respiratoire',
        specialty: 'Physiologie',
        coefficient: 3,
        semesters: 'S3 – S4',
        keyTopics: ['Cycle cardiaque et loi de Frank-Starling', 'Mécanique ventilatoire et courbe de dissociation de l’Hb', 'Régulation de la pression artérielle'],
      },
      {
        name: 'Physiologie Rénale & Neurophysiologie',
        specialty: 'Physiologie',
        coefficient: 3,
        semesters: 'S3 – S4',
        keyTopics: ['Filtration glomérulaire et clairance', 'Potentiel d’action et transmission synaptique', 'Système nerveux autonome'],
      },
      {
        name: 'Biochimie Métabolique',
        specialty: 'Biochimie',
        coefficient: 2,
        semesters: 'S3 – S4',
        keyTopics: ['Glycolyse, cycle de Krebs et chaîne respiratoire', 'Bêta-oxydation et cétogenèse', 'Cycle de l’urée'],
      },
      {
        name: 'Anatomie II & Neuroanatomie',
        specialty: 'Anatomie',
        coefficient: 3,
        semesters: 'S3 – S4',
        keyTopics: ['Cœur et gros vaisseaux', 'Voies nerveuses ascendantes et descendantes', 'Vascularisation cérébrale (polygone de Willis)'],
      },
    ],
  },
  {
    year: 3,
    sectionId: 'annee-3',
    title: 'Troisième année de médecine',
    cycle: 'Cycle Préclinique',
    description:
      'Année charnière vers la clinique : apprentissage de la sémiologie médicale et chirurgicale, pharmacologie générale, anatomie pathologique, microbiologie et immunopathologie.',
    modules: [
      {
        name: 'Sémiologie Médicale & Chirurgicale',
        specialty: 'Médecine interne',
        coefficient: 4,
        semesters: 'S5 – S6',
        keyTopics: ['Sémiologie cardiovasculaire et respiratoire', 'Sémiologie digestive et neurologique', 'Examen clinique systématisé'],
      },
      {
        name: 'Pharmacologie Générale',
        specialty: 'Pharmacologie',
        coefficient: 3,
        semesters: 'S5 – S6',
        keyTopics: ['Pharmacocinétique (ADME, demi-vie, biodisponibilité)', 'Pharmacodynamie et récepteurs', 'Interactions médicamenteuses'],
      },
      {
        name: 'Anatomie Pathologique Générale',
        specialty: 'Pathologie',
        coefficient: 3,
        semesters: 'S5 – S6',
        keyTopics: ['Inflammation aiguë et chronique', 'Nécrose, apoptose et athérosclérose', 'Processus tumoral bénin vs malin'],
      },
      {
        name: 'Microbiologie & Immunologie Clinique',
        specialty: 'Microbiologie',
        coefficient: 3,
        semesters: 'S5 – S6',
        keyTopics: ['Bactériologie médicale et antibiogramme', 'Virologie (VIH, hépatites)', 'Réactions d’hypersensibilité de Gell et Coombs'],
      },
    ],
  },
  {
    year: 4,
    sectionId: 'annee-4',
    title: 'Quatrième année de médecine',
    cycle: 'Cycle Clinique',
    description:
      'Entrée dans le cycle clinique avec stages hospitaliers matinaux : pathologie cardiovasculaire, pneumologie, gastro-entérologie, néphrologie, maladies infectieuses et hématologie.',
    modules: [
      {
        name: 'Cardiologie',
        specialty: 'Cardiologie',
        coefficient: 4,
        semesters: 'Unité Cardio-Respiratoire',
        keyTopics: ['Syndromes coronariens aigus', 'Insuffisance cardiaque et valvulopathies', 'Hypertension artérielle et troubles du rythme'],
      },
      {
        name: 'Pneumologie',
        specialty: 'Pneumologie',
        coefficient: 3,
        semesters: 'Unité Cardio-Respiratoire',
        keyTopics: ['Asthme et BPCO', 'Tuberculose pulmonaire (programme national)', 'Pneumopathies et épanchements pleuraux'],
      },
      {
        name: 'Gastro-entérologie & Hépatologie',
        specialty: 'Gastro-entérologie',
        coefficient: 3,
        semesters: 'Unité Digestive',
        keyTopics: ['Ulcère gastro-duodénal et H. pylori', 'Cirrhose et hypertension portale', 'Hémorragies digestives et MICI'],
      },
      {
        name: 'Néphrologie & Maladies Infectieuses',
        specialty: 'Néphrologie',
        coefficient: 3,
        semesters: 'Unité Immuno-Infectieuse & Rénale',
        keyTopics: ['Insuffisance rénale aiguë et chronique', 'Syndromes glomérulaires', 'Méningites, endocardites et sepsis'],
      },
    ],
  },
  {
    year: 5,
    sectionId: 'annee-5',
    title: 'Cinquième année de médecine',
    cycle: 'Cycle Clinique',
    description:
      'Approfondissement des spécialités médicales et mère-enfant : neurologie, endocrinologie-diabétologie, pédiatrie, gynécologie-obstétrique, psychiatrie et appareil locomoteur.',
    modules: [
      {
        name: 'Neurologie',
        specialty: 'Neurologie',
        coefficient: 3,
        semesters: 'Unité Neuro-Locomotrice',
        keyTopics: ['AVC ischémiques et hémorragiques', 'Épilepsies et céphalées', 'Neuropathies périphériques et sclérose en plaques'],
      },
      {
        name: 'Endocrinologie & Diabétologie',
        specialty: 'Endocrinologie',
        coefficient: 3,
        semesters: 'Unité Endocrinienne',
        keyTopics: ['Diabètes de type 1 et 2 et complications aiguës', 'Dysthyroïdies', 'Insuffisance surrénalienne aiguë et syndrome de Cushing'],
      },
      {
        name: 'Pédiatrie',
        specialty: 'Pédiatrie',
        coefficient: 4,
        semesters: 'Unité Mère-Enfant',
        keyTopics: ['Déshydratation aiguë du nourrisson', 'Bronchiolite et détresses respiratoires néonatales', 'Calendrier vaccinal algérien et ictères néonatals'],
      },
      {
        name: 'Gynécologie-Obstétrique',
        specialty: 'Gynécologie-obstétrique',
        coefficient: 4,
        semesters: 'Unité Mère-Enfant',
        keyTopics: ['Pré-éclampsie et éclampsie', 'Hémorragies du post-partum et du 3e trimestre', 'Grossesse extra-utérine et cancers gynécologiques'],
      },
    ],
  },
  {
    year: 6,
    sectionId: 'annee-6',
    title: 'Sixième année de médecine',
    cycle: 'Cycle Clinique',
    description:
      'Synthèse clinique terminale avant l’internat : médecine interne, urgences et réanimation, chirurgie viscérale et urologique, spécialités neurosensorielles, médecine légale et santé publique.',
    modules: [
      {
        name: 'Urgences Médico-Chirurgicales & Réanimation',
        specialty: 'Urgences et Réanimation',
        coefficient: 4,
        semesters: 'Synthèse Clinique',
        keyTopics: ['États de choc et arrêt cardio-respiratoire', 'Intoxications aiguës et polytraumatisé', 'Troubles hydro-électrolytiques graves'],
      },
      {
        name: 'Médecine Interne & Maladies Systémiques',
        specialty: 'Médecine interne',
        coefficient: 3,
        semesters: 'Synthèse Clinique',
        keyTopics: ['Lupus érythémateux systémique', 'Vascularites et maladie de Horton', 'Fièvres prolongées inexpliquées'],
      },
      {
        name: 'Chirurgie Viscérale & Urologie',
        specialty: 'Chirurgie',
        coefficient: 3,
        semesters: 'Synthèse Chirurgicale',
        keyTopics: ['Occlusions intestinales aiguës', 'Péritonites et appendicite aiguë', 'Lithiase urinaire et torsion du cordon spermatique'],
      },
      {
        name: 'Hématologie Clinique',
        specialty: 'Hématologie',
        coefficient: 3,
        semesters: 'Synthèse Médicale',
        keyTopics: ['Anémies carentielles et hémolytiques', 'Leucémies aiguës et lymphomes', 'Troubles de l’hémostase et thrombopénies'],
      },
    ],
  },
  {
    year: 7,
    sectionId: 'annee-7',
    title: 'Septième année — Internat & Résidanat',
    cycle: 'Internat & Résidanat',
    description:
      'Année de stage interné hospitalier rotatif (Médecine interne, Chirurgie, Pédiatrie, Gynécologie-Obstétrique) et préparation intensive au concours national d’accès au Résidanat.',
    modules: [
      {
        name: 'Synthèse Préclinique pour le Résidanat',
        specialty: 'Anatomie',
        coefficient: 5,
        semesters: 'Épreuve Sciences Fondamentales',
        keyTopics: ['Anatomie topographique chirurgicale', 'Physiologie intégrée des grands appareils', 'Pharmacologie et biochimie clinique'],
      },
      {
        name: 'Synthèse Médico-Chirurgicale (Adulte)',
        specialty: 'Cardiologie',
        coefficient: 5,
        semesters: 'Épreuve Pathologie Médicale & Chirurgicale',
        keyTopics: ['Cardio-pneumo-néphrologie', 'Neuro-endocrino-gastro-entérologie', 'Urgences vitales et réanimation'],
      },
      {
        name: 'Stage Interné Pédiatrie & Gynéco-Obstétrique',
        specialty: 'Pédiatrie',
        coefficient: 4,
        semesters: 'Stages Hospitaliers',
        keyTopics: ['Urgences pédiatriques en garde', 'Surveillance de grossesse et salle d’accouchement', 'Prise en charge du nouveau-né'],
      },
      {
        name: 'Méthodologie QCM & Cas Cliniques',
        specialty: 'Médecine interne',
        coefficient: 4,
        semesters: 'Concours National',
        keyTopics: ['Stratégie de gestion du temps', 'Analyse des distracteurs fréquents', 'Révision ciblée sur les erreurs récurrentes'],
      },
    ],
  },
];

export const MEDICAL_LESSONS: MedicalLesson[] = [
  // 1ère année
  {
    id: 'L1-ANAT-01',
    year: 1,
    subject: 'Anatomie I',
    specialty: 'Anatomie',
    chapter: 'Membre supérieur',
    title: 'Le plexus brachial : constitution, rapports et branches terminales',
    durationMin: 18,
    objectives: [
      'Décrire la constitution des troncs primaires et secondaires à partir des racines C5 à T1.',
      'Identifier les rapports anatomiques dans le défilé interscalénique et le creux axillaire.',
      'Associer chaque nerf terminal à son territoire moteur et sensitif principal.',
    ],
    definitions: [
      { term: 'Tronc primaire supérieur', definition: 'Union des branches antérieures des racines C5 et C6.' },
      { term: 'Faisceau postérieur', definition: 'Réunion des trois branches postérieures des troncs primaires ; donne le nerf axillaire et le nerf radial.' },
    ],
    contentSections: [
      {
        heading: '1. Constitution anatomique (C5–T1)',
        body: 'Le plexus brachial est formé par les rameaux antérieurs des nerfs spinaux C5, C6, C7, C8 et T1. C5 et C6 s’unissent pour former le tronc supérieur, C7 forme seul le tronc moyen, et C8-T1 forment le tronc inférieur. Chaque tronc se divise en une branche antérieure et une branche postérieure.',
      },
      {
        heading: '2. Branches terminales cliniques',
        body: 'Le faisceau latéral (C5–C7) donne le nerf musculo-cutané et la racine latérale du nerf médian. Le faisceau médial (C8–T1) donne la racine médiale du médian, le nerf ulnaire, le nerf cutané médial du bras et de l’avant-bras. Le faisceau postérieur donne le nerf axillaire (C5–C6, deltoïde) et le nerf radial (C5–T1, loge postérieure, extension du poignet et des doigts).',
      },
    ],
    summary:
      'Retenir le schéma 3 troncs primaires → 6 divisions → 3 faisceaux (latéral, médial, postérieur) → 5 nerfs terminaux principaux. Lésion radiale = main tombante en col de cygne ; lésion ulnaire = griffe cubitale.',
    highYieldPoints: [
      'Le nerf axillaire contourne le col chirurgical de l’humérus (risque lors d’une luxation antéro-interne de l’épaule).',
      'Le nerf radial chemine dans le sillon du nerf radial à la face postérieure de la diaphyse humérale.',
      'Le syndrome de Duchenne-Erb (C5–C6) donne une paralysie de l’abduction de l’épaule et de la flexion du coude.',
    ],
    diagramType: 'anatomy',
    reference: 'Anatomie Humaine — H. Rouvière & A. Delmas, Tome 3 (Membres)',
  },
  {
    id: 'L1-BIO-01',
    year: 1,
    subject: 'Biochimie Structurale',
    specialty: 'Biochimie',
    chapter: 'Enzymologie',
    title: 'Cinétique enzymatique de Michaelis-Menten et inhibitions',
    durationMin: 15,
    objectives: [
      'Interpréter la signification physiologique des constantes Km et Vmax.',
      'Différencier graphiquement une inhibition compétitive d’une inhibition non compétitive.',
    ],
    definitions: [
      { term: 'Km (Constante de Michaelis)', definition: 'Concentration en substrat pour laquelle la vitesse initiale est égale à Vmax / 2 ; reflète inversement l’affinité de l’enzyme pour son substrat.' },
      { term: 'Vmax', definition: 'Vitesse maximale atteinte lorsque tous les sites catalytiques de l’enzyme sont saturés en substrat.' },
    ],
    contentSections: [
      {
        heading: '1. Équation de Michaelis-Menten',
        body: 'Vi = (Vmax × [S]) / (Km + [S]). Lorsque [S] << Km, la vitesse est proportionnelle à [S] (cinétique d’ordre 1). Lorsque [S] >> Km, l’enzyme est saturée et Vi tend vers Vmax (cinétique d’ordre 0).',
      },
      {
        heading: '2. Profils d’inhibition réversible',
        body: 'Dans l’inhibition compétitive, l’inhibiteur se lie au site actif en compétition avec le substrat : Vmax reste inchangée mais Km apparent augmente. Dans l’inhibition non compétitive pure, l’inhibiteur se fixe sur un site distinct : Vmax diminue et Km reste inchangée.',
      },
    ],
    summary:
      'Compétitive = Vmax inchangée, Km augmente (surmontable par excès de substrat). Non compétitive = Vmax diminue, Km inchangée. Incompétitive = Vmax et Km diminuent dans le même rapport.',
    highYieldPoints: [
      'En représentation de Lineweaver-Burk (1/Vi en fonction de 1/[S]), l’ordonnée à l’origine vaut 1/Vmax et l’abscisse à l’origine vaut -1/Km.',
      'De nombreux médicaments (statines sur l’HMG-CoA réductase) agissent comme inhibiteurs compétitifs.',
    ],
    diagramType: 'metabolic',
    reference: 'Biochimie Médicale — Lehninger / Harper',
  },
  {
    id: 'L1-HIST-01',
    year: 1,
    subject: 'Histologie Générale',
    specialty: 'Histologie',
    chapter: 'Tissus épithéliaux',
    title: 'Épithéliums de revêtement : classification et spécialisations apicales',
    durationMin: 14,
    objectives: [
      'Classer les épithéliums selon le nombre d’assises cellulaires et la forme des cellules superficielles.',
      'Distinguer microvillosités, stéréocils et cils vibratiles sur le plan ultrastructural.',
    ],
    definitions: [
      { term: 'Lame basale', definition: 'Structure extracellulaire spécialisée séparant tout épithélium du tissu conjonctif sous-jacent.' },
      { term: 'Urothélium', definition: 'Épithélium pseudostratifié polymorphe tapissant les voies urinaires excrétrices.' },
    ],
    contentSections: [
      {
        heading: '1. Critères de classification',
        body: 'Les épithéliums de revêtement sont avasculaires et innervés, reposant sur une lame basale. Ils sont simples (1 couche : pavimenteux, cubique, prismatique), pseudostratifiés (toutes les cellules touchent la lame basale, ex. épithélium respiratoire) ou stratifiés (malpighien kératinisé ou non).',
      },
      {
        heading: '2. Spécialisations membranaires',
        body: 'Les microvillosités (plateau strié entérocytaire, bordure en brosse du tube contourné proximal) contiennent des microfilaments d’actine et augmentent la surface d’absorption. Les cils vibratiles possèdent un axonème de microtubules (9 doublets + 2 singulets) mû par la dynéine.',
      },
    ],
    summary:
      'Épithélium = cellules jointives polarisées, avasculaires, sur lame basale. Cils = microtubules + dynéine (mobilité). Microvillosités = actine (absorption).',
    highYieldPoints: [
      'Le syndrome de Kartagener (dyskinésie ciliaire primitive) associe bronchectasies, sinusite chronique et situs inversus par déficit en dynéine.',
      'L’épithélium œsophagien est malpighien non kératinisé ; l’épiderme est malpighien kératinisé.',
    ],
    diagramType: 'none',
    reference: 'Histologie Humaine — Stevens & Lowe / Poirier',
  },
  {
    id: 'L1-EMBR-01',
    year: 1,
    subject: 'Embryologie Humaine',
    specialty: 'Embryologie',
    chapter: 'Premières semaines du développement',
    title: 'La 3ème semaine du développement : gastrulation et neurulation',
    durationMin: 16,
    objectives: [
      'Expliquer le passage du disque embryonnaire didermique au disque tridermique.',
      'Citer les dérivés de l’ectoblaste, du mésoblaste et de l’endoblaste.',
    ],
    definitions: [
      { term: 'Ligne primitive', definition: 'Épaississement axial de l’épiblaste marquant l’axe crânio-caudal et le début de la gastrulation.' },
      { term: 'Crêtes neurales', definition: 'Population cellulaire issue des bords de la gouttière neurale donnant les ganglions nerveux, mélanocytes et médullosurrénale.' },
    ],
    contentSections: [
      {
        heading: '1. Gastrulation (J15–J21)',
        body: 'Les cellules de l’épiblaste migrent à travers la ligne primitive et le nœud de Hensen pour former les trois feuillets définitifs : endoblaste, mésoblaste intra-embryonnaire et ectoblaste. La chorde (notochorde) induit la différenciation de l’ectoblaste sus-jacent en plaque neurale.',
      },
      {
        heading: '2. Neurulation et fermeture du tube neural',
        body: 'La plaque neurale se creuse en gouttière puis se ferme en tube neural (neuropore antérieur fermé à J25, postérieur à J28). Un défaut de fermeture expose au spina bifida ou à l’anencéphalie (prévention par acide folique préconceptionnel).',
      },
    ],
    summary:
      '3e semaine = gastrulation (3 feuillets) + début de la neurulation. Neuropore antérieur J25, postérieur J28. Supplémentation en vitamine B9 essentielle.',
    highYieldPoints: [
      'Les somites dérivent du mésoblaste para-axial et donnent sclérotome (vertèbres), myotome (muscles) et dermatome.',
      'La médullosurrénale dérive des crêtes neurales alors que la corticosurrénale dérive du mésoblaste.',
    ],
    diagramType: 'none',
    reference: 'Embryologie Médicale — Langman',
  },

  // 2ème année
  {
    id: 'L2-PHYS-01',
    year: 2,
    subject: 'Physiologie Cardiovasculaire',
    specialty: 'Physiologie',
    chapter: 'Hémodynamique cardiaque',
    title: 'Le cycle cardiaque et la régulation du débit cardiaque',
    durationMin: 20,
    objectives: [
      'Décrire les quatre phases du cycle cardiaque et les pressions ventriculo-valvulaires associées.',
      'Expliquer les déterminants du volume d’éjection systolique (précharge, postcharge, inotropisme).',
    ],
    definitions: [
      { term: 'Débit cardiaque (Qc)', definition: 'Volume de sang éjecté par chaque ventricule par minute : Qc = FC × VES (≈ 5 L/min au repos).' },
      { term: 'Fraction d’éjection (FEVG)', definition: 'Rapport VES / VTD (Volume Télédiastolique), normale entre 55 % et 70 %.' },
    ],
    contentSections: [
      {
        heading: '1. Phases du cycle cardiaque',
        body: 'La systole comprend la contraction isovolumétrique (fermeture mitrale = B1) suivie de l’éjection ventriculaire. La diastole débute par la relaxation isovolumétrique (fermeture aortique = B2), puis le remplissage rapide, lent, et la systole auriculaire (onde P à l’ECG).',
      },
      {
        heading: '2. Loi de Frank-Starling',
        body: 'Dans les limites physiologiques, plus le retour veineux étire les fibres myocardiques en fin de diastole (augmentation de la précharge), plus la force de contraction systolique augmente.',
      },
    ],
    summary:
      'B1 = fermeture des valves AV (début systole). B2 = fermeture des valves sigmoïdes (début diastole). Qc = FC × VES.',
    highYieldPoints: [
      'La perfusion coronaire du ventricule gauche s’effectue essentiellement pendant la diastole.',
      'Une tachycardie extrême réduit le temps de remplissage diastolique et peut faire chuter le débit cardiaque.',
    ],
    diagramType: 'cardiac',
    reference: 'Traité de Physiologie Médicale — Guyton & Hall',
  },
  {
    id: 'L2-PHYS-02',
    year: 2,
    subject: 'Physiologie Rénale',
    specialty: 'Physiologie',
    chapter: 'Fonction glomérulaire et tubulaire',
    title: 'Filtration glomérulaire, clairance et système rénine-angiotensine',
    durationMin: 18,
    objectives: [
      'Calculer le débit de filtration glomérulaire à partir de la formule de Starling.',
      'Expliquer les mécanismes de réabsorption dans le tube contourné proximal et l’anse de Henlé.',
    ],
    definitions: [
      { term: 'DFG normal', definition: 'Environ 120 mL/min/1,73 m² chez l’adulte jeune (180 L/jour filtrés).' },
      { term: 'Clairance rénale', definition: 'Volume de plasma virtuellement totalement épuré d’une substance par unité de temps : C = (U × V) / P.' },
    ],
    contentSections: [
      {
        heading: '1. Déterminants de la filtration glomérulaire',
        body: 'La pression nette de filtration résulte de l’équilibre entre la pression hydrostatique capillaire glomérulaire (Pcg ≈ 55–60 mmHg, favorisant la filtration) et la somme de la pression oncotique plasmatique et de la pression hydrostatique dans la capsule de Bowman.',
      },
      {
        heading: '2. Réabsorption tubulaire et macula densa',
        body: 'Le tube contourné proximal réabsorbe environ 65 à 70 % du Na+ et de l’eau de façon iso-osmotique, ainsi que la totalité du glucose (jusqu’au Tm ≈ 1,80 g/L). La branche ascendante large de l’anse de Henlé est imperméable à l’eau et réabsorbe activement Na+/K+/2Cl- (cible du furosémide).',
      },
    ],
    summary:
      'TCP = 65 % réabsorption Na+/H2O + 100 % glucose/AA. Anse ascendante large = imperméable à l’eau (dilution). Tube collecteur = ADH (aquaporines-2) et aldostérone.',
    highYieldPoints: [
      'La vasoconstriction sélective de l’artériole efférente par l’angiotensine II maintient le DFG en cas d’hypoperfusion rénale modérée.',
      'L’inuline mesure exactement le DFG car elle est librement filtrée, ni réabsorbée ni sécrétée.',
    ],
    diagramType: 'nephron',
    reference: 'Physiologie Humaine — Vander / Guyton & Hall',
  },
  {
    id: 'L2-PHYS-03',
    year: 2,
    subject: 'Physiologie Respiratoire',
    specialty: 'Physiologie',
    chapter: 'Échanges gazeux',
    title: 'Transport de l’oxygène et effet Bohr',
    durationMin: 15,
    objectives: [
      'Analyser la courbe sigmoïde de dissociation de l’oxyhémoglobine (Barcroft).',
      'Prédire le sens de déplacement de la courbe selon le pH, la PaCO2, la température et le 2,3-DPG.',
    ],
    definitions: [
      { term: 'P50', definition: 'Pression partielle en O2 pour laquelle 50 % de l’hémoglobine est saturée (≈ 26,8 mmHg normalement).' },
      { term: 'Effet Bohr', definition: 'Diminution de l’affinité de l’hémoglobine pour l’O2 induite par l’acidose ou l’hypercapnie, favorisant le largage tissulaire de l’O2.' },
    ],
    contentSections: [
      {
        heading: '1. Formes de transport de l’O2',
        body: '98,5 % de l’oxygène sanguin est transporté lié réversiblement au fer ferreux (Fe2+) de l’hémoglobine (1 g d’Hb fixe 1,34 mL d’O2 à saturation complète). Seulement 1,5 % est dissous dans le plasma selon la loi de Henry.',
      },
      {
        heading: '2. Déplacements de la courbe de Barcroft',
        body: 'Un déplacement vers la droite (augmentation de la P50, diminution d’affinité = libération facilitée aux tissus) survient lors de : baisse du pH (acidose), hausse de la PaCO2, fièvre/hyperthermie, et hausse du 2,3-BPG.',
      },
    ],
    summary:
      'À droite = « Acidose, Hypercapnie, Température élevée, 2,3-DPG élevé » → baisse d’affinité → meilleure oxygénation tissulaire. L’inverse déplace vers la gauche (alcalose, hypothermie, HbF, CO).',
    highYieldPoints: [
      'L’intoxication au monoxyde de carbone (CO) déplace la courbe vers la gauche et réduit la capacité de transport de l’O2.',
      'La méthémoglobine contient du fer ferrique (Fe3+) incapable de fixer l’O2.',
    ],
    diagramType: 'respiratory',
    reference: 'Physiologie Respiratoire — J.B. West',
  },
  {
    id: 'L2-ANAT-02',
    year: 2,
    subject: 'Neuroanatomie',
    specialty: 'Anatomie',
    chapter: 'Vascularisation encéphalique',
    title: 'Le polygone de Willis et les territoires artériels cérébraux',
    durationMin: 16,
    objectives: [
      'Schématiser les artères constitutives du cercle artériel de la base du crâne.',
      'Corréler l’occlusion d’une artère cérébrale avec le déficit clinique correspondant.',
    ],
    definitions: [
      { term: 'Polygone de Willis', definition: 'Anastomose artérielle située dans les citernes de la base entre le système carotidien interne et le système vertébro-basilaire.' },
    ],
    contentSections: [
      {
        heading: '1. Architecture anastomotique',
        body: 'En avant : les deux artères cérébrales antérieures reliées par l’artère communicante antérieure. Latéralement : les artères carotides internes et les artères communicantes postérieures. En arrière : le tronc basilaire se divisant en deux artères cérébrales postérieures.',
      },
      {
        heading: '2. Territoires sylvien, antérieur et postérieur',
        body: 'L’artère cérébrale moyenne (sylvienne) irrigue la face latérale des hémisphères (déficit brachio-facial, aphasie si hémisphère dominant). L’artère cérébrale antérieure irrigue la face médiale (déficit prédominant au membre inférieur). L’artère cérébrale postérieure irrigue le lobe occipital (hémianopsie latérale homonyme).',
      },
    ],
    summary:
      'ACA = membre inférieur controlatéral. ACM (sylvienne) = face et membre supérieur controlatéraux ± aphasie. ACP = hémianopsie latérale homonyme.',
    highYieldPoints: [
      'L’artère communicante antérieure est le siège le plus fréquent des anévrismes sacculaires rompus responsables d’hémorragie méningée.',
    ],
    diagramType: 'neuro',
    reference: 'Neuroanatomie Clinique — Crossman & Neary / Rouvière',
  },

  // 3ème année
  {
    id: 'L3-PHARM-01',
    year: 3,
    subject: 'Pharmacologie Générale',
    specialty: 'Pharmacologie',
    chapter: 'Pharmacocinétique',
    title: 'Paramètres pharmacocinétiques : biodisponibilité, demi-vie et clairance',
    durationMin: 18,
    objectives: [
      'Définir biodisponibilité absolue, volume de distribution (Vd) et demi-vie plasmatique (T1/2).',
      'Calculer le délai d’obtention de l’état d’équilibre lors d’administrations répétées.',
    ],
    definitions: [
      { term: 'Biodisponibilité (F)', definition: 'Fraction de la dose administrée atteignant la circulation générale sous forme inchangée (F = 100 % par voie IV).' },
      { term: 'Demi-vie (T1/2)', definition: 'Temps nécessaire pour que la concentration plasmatique diminue de moitié ; T1/2 = (0,693 × Vd) / Cl.' },
    ],
    contentSections: [
      {
        heading: '1. Effet de premier passage hépatique',
        body: 'Un médicament absorbé par voie orale rejoint la veine porte puis le foie avant la circulation systémique. Un fort effet de premier passage réduit la biodisponibilité orale (ex. propranolol, trinitrine, morphine).',
      },
      {
        heading: '2. État d’équilibre et élimination',
        body: 'En administration répétée à posologie fixe, l’état d’équilibre (steady-state) est atteint au bout d’environ 5 demi-vies (97 % du plateau). De même, l’élimination quasi complète après arrêt demande environ 5 à 7 demi-vies.',
      },
    ],
    summary:
      'État d’équilibre = 5 × T1/2. Élimination complète ≈ 5 à 7 × T1/2. La dose de charge dépend de Vd ; la dose d’entretien dépend de la clairance.',
    highYieldPoints: [
      'Les inducteurs enzymatiques (rifampicine, carbamazépine, phénytoïne) accélèrent le métabolisme hépatique et diminuent l’efficacité des AVK ou contraceptifs oraux.',
      'Les inhibiteurs enzymatiques (érythromycine, fluconazole, ritonavir) augmentent le risque de surdosage.',
    ],
    diagramType: 'none',
    reference: 'Pharmacologie Fondamentale et Clinique — Katzung / Collège de Pharmacologie',
  },
  {
    id: 'L3-PATH-01',
    year: 3,
    subject: 'Anatomie Pathologique',
    specialty: 'Pathologie',
    chapter: 'Processus inflammatoire et tumoral',
    title: 'L’inflammation aiguë, granulomateuse et critères de malignité',
    durationMin: 16,
    objectives: [
      'Décrire les phases vasculo-exsudative, cellulaire et de détersion/cicatrisation de l’inflammation aiguë.',
      'Reconnaître les caractéristiques du granulome épithélioïde et gigantocellulaire tuberculeux.',
    ],
    definitions: [
      { term: 'Nécrose caséeuse', definition: 'Nécrose acellulaire éosinophile caractéristique de la tuberculose, associée à un granulome épithélioïde et gigantocellulaire (cellules de Langhans).' },
    ],
    contentSections: [
      {
        heading: '1. Dynamique de l’inflammation aiguë',
        body: 'La phase vasculo-exsudative associe vasodilatation artériolaire, augmentation de la perméabilité capillaire (œdème inflammatoire riche en protéines) et diapédèse des polynucléaires neutrophiles.',
      },
      {
        heading: '2. Critères histologiques de malignité tumorale',
        body: 'Le carcinome invasif franchit la membrane basale (à la différence du carcinome in situ). Les atypies cytonucléaires incluent l’anisocaryose, l’hyperchromatisme, l’augmentation du rapport nucléo-cytoplasmique et les mitoses anormales.',
      },
    ],
    summary:
      'Inflammation aiguë = PNN. Tuberculose = granulome épithélio-gigantocellulaire + nécrose caséeuse. Carcinome in situ = ne franchit pas la membrane basale.',
    highYieldPoints: [
      'La sarcoïdose forme des granulomes épithélioïdes et gigantocellulaires SANS nécrose caséeuse.',
      'Les carcinomes dérivent des tissus épithéliaux ; les sarcomes dérivent des tissus mésenchymateux.',
    ],
    diagramType: 'none',
    reference: 'Anatomie Pathologique — Robbins / CoPath',
  },
  {
    id: 'L3-MICRO-01',
    year: 3,
    subject: 'Microbiologie Clinique',
    specialty: 'Microbiologie',
    chapter: 'Bactériologie systématique',
    title: 'Staphylocoques, streptocoques et mécanismes de résistance aux bêta-lactamines',
    durationMin: 17,
    objectives: [
      'Différencier Staphylococcus aureus des streptocoques par les tests de catalase et coagulase.',
      'Expliquer le mécanisme du SARM (modification des PLP) vs production de bêta-lactamases.',
    ],
    definitions: [
      { term: 'Catalase', definition: 'Enzyme présente chez les staphylocoques (catalase +) et absente chez les streptocoques et entérocoques (catalase -).' },
    ],
    contentSections: [
      {
        heading: '1. Orientation diagnostique des cocci Gram positif',
        body: 'En amas + catalase (+) : staphylocoques ; S. aureus est coagulase (+). En chaînettes ou diplocoques + catalase (-) : streptocoques ; Streptococcus pneumoniae est optochine sensible et présente une hémolyse alpha.',
      },
      {
        heading: '2. Résistance à la méticilline (SARM)',
        body: 'Le SARM acquiert le gène mecA codant pour une protéine liant la pénicilline modifiée (PLP2a) de faible affinité pour toutes les bêta-lactamines (sauf céftaroline/céftobiprole). Les glycopeptides (vancomycine) restent le traitement de référence des infections graves à SARM.',
      },
    ],
    summary:
      'Cocci Gram+ : amas = Staph (catalase +), S. aureus (coagulase +). Chaînettes = Strepto (catalase -). SARM = gène mecA → PLP2a.',
    highYieldPoints: [
      'Streptococcus pyogenes (groupe A) est sensible à la bacitracine et responsable d’angine aiguë avec risque de RAA et GNA.',
    ],
    diagramType: 'none',
    reference: 'Bactériologie Médicale — E. Pilly / Murray',
  },
  {
    id: 'L3-IMMU-01',
    year: 3,
    subject: 'Immunologie',
    specialty: 'Immunologie',
    chapter: 'Hypersensibilités',
    title: 'Classification de Gell et Coombs et anaphylaxie',
    durationMin: 15,
    objectives: [
      'Identifier les 4 types d’hypersensibilité selon leurs médiateurs immunologiques et délais d’apparition.',
      'Reconnaître la physiopathologie et le traitement d’urgence du choc anaphylactique.',
    ],
    definitions: [
      { term: 'Type I (Immédiate)', definition: 'Médiée par les IgE fixées sur les mastocytes et basophiles, entraînant une dégranulation rapide (histamine, tryptase).' },
    ],
    contentSections: [
      {
        heading: '1. Les quatre types d’hypersensibilité',
        body: 'Type I : IgE (asthme allergique, choc anaphylactique). Type II : cytotoxique médiée par IgG/IgM dirigées contre des antigènes cellulaires (anémie hémolytique auto-immune). Type III : complexes immuns circulants (maladie sérique, glomérulonéphrite lupique). Type IV : cellulaire retardée médiée par les lymphocytes T (IDR à la tuberculine, eczéma de contact).',
      },
      {
        heading: '2. Prise en charge de l’anaphylaxie',
        body: 'L’adrénaline intramusculaire (face antéro-externe de la cuisse : 0,01 mg/kg, max 0,5 mg chez l’adulte) est le traitement de première intention immédiat, avant les corticoïdes ou antihistaminiques.',
      },
    ],
    summary:
      'I = IgE ; II = IgG/IgM anti-cellules ; III = Complexes immuns ; IV = Lymphocytes T (retardée). Anaphylaxie = Adrénaline IM en urgence.',
    highYieldPoints: [
      'Le dosage de la tryptase sérique entre 30 min et 2 h après la réaction confirme une dégranulation mastocytaire.',
    ],
    diagramType: 'none',
    reference: 'Immunologie Fondamentale et Clinique — Abbas / ASSIM',
  },

  // 4ème année
  {
    id: 'L4-CARD-01',
    year: 4,
    subject: 'Cardiologie',
    specialty: 'Cardiologie',
    chapter: 'Insuffisance coronaire',
    title: 'Syndromes coronariens aigus avec sus-décalage du ST (SCA ST+)',
    durationMin: 22,
    objectives: [
      'Identifier les critères ECG diagnostiques d’un SCA ST+ et localiser le territoire coronaire.',
      'Appliquer la stratégie de reperfusion urgente (angioplastie primaire vs fibrinolyse).',
    ],
    definitions: [
      { term: 'Sus-décalage ST significatif', definition: 'Élévation du segment ST au point J dans ≥ 2 dérivations contiguës : ≥ 2 mm en V2–V3 chez l’homme (≥ 1,5 mm chez la femme) et ≥ 1 mm dans les autres dérivations.' },
    ],
    contentSections: [
      {
        heading: '1. Diagnostic et topographie ECG',
        body: 'Antéro-septal : V1–V3 (IVA). Antérieur étendu : V1–V6, DI, aVL. Inférieur : DII, DIII, aVF (coronaire droite dans 80 % des cas ; rechercher systématiquement V3R–V4R pour extension au ventricule droit et V7–V9 pour le basal).',
      },
      {
        heading: '2. Stratégie de reperfusion urgente',
        body: 'Le traitement repose sur la double antiagrégation plaquettaire (aspirine + inhibiteur P2Y12), anticoagulation, et reperfusion immédiate : angioplastie coronaire primaire si réalisable dans les 120 minutes suivant le diagnostic ECG ; sinon fibrinolyse intraveineuse (en l’absence de contre-indication) suivie de transfert vers un centre de coronarographie.',
      },
    ],
    summary:
      'Ne jamais attendre le résultat de la troponine pour déclencher la reperfusion devant un SCA ST+ typique. Toujours enregistrer V3R, V4R et V7–V9 dans l’IDM inférieur.',
    highYieldPoints: [
      'En cas d’extension au ventricule droit (V4R+), les dérivés nitrés sont contre-indiqués car ils provoquent une hypotension sévère.',
      'Un bloc de branche gauche récent avec douleur thoracique typique doit être géré comme un équivalent ST+.',
    ],
    diagramType: 'cardiac',
    reference: 'Recommandations ESC / Collège National des Enseignants de Cardiologie',
  },
  {
    id: 'L4-PNEU-01',
    year: 4,
    subject: 'Pneumologie',
    specialty: 'Pneumologie',
    chapter: 'Infections respiratoires',
    title: 'Tuberculose pulmonaire : diagnostic et programme thérapeutique en Algérie',
    durationMin: 20,
    objectives: [
      'Poser le diagnostic bactériologique d’une tuberculose pulmonaire commune.',
      'Prescrire le schéma thérapeutique antituberculeux de 1ère ligne et surveiller sa toxicité.',
    ],
    definitions: [
      { term: 'Schéma 2RHZE / 4RH', definition: 'Phase intensive de 2 mois associant Rifampicine, Isoniazide, Pyrazinamide et Éthambutol, suivie de 4 mois de Rifampicine et Isoniazide.' },
    ],
    contentSections: [
      {
        heading: '1. Présentation et confirmation diagnostique',
        body: 'Toute toux chronique > 2–3 semaines avec fièvre vespérale, sueurs nocturnes et amaigrissement doit faire pratiquer une radiographie thoracique (infiltrats ou cavernes des sommets / segments apicaux des lobes inférieurs) et 3 examens des crachats à la recherche de BAAR (coloration de Ziehl-Neelsen) + test moléculaire GeneXpert (détection Mycobacterium tuberculosis et résistance à la rifampicine).',
      },
      {
        heading: '2. Surveillance des antituberculeux',
        body: 'Rifampicine (R) : inducteur enzymatique puissant, coloration orangée des sécrétions, hépatotoxicité. Isoniazide (H) : hépatotoxicité, neuropathie périphérique prévenue par vitamine B6. Pyrazinamide (Z) : hépatotoxicité majeure, hyperuricémie. Éthambutol (E) : névrite optique rétrobulbaire (surveillance vision des couleurs rouge-vert).',
      },
    ],
    summary:
      'Diagnostic de certitude = preuve bactériologique (BAAR / culture / GeneXpert). Traitement standard = 2RHZE / 4RH en prise unique à jeun le matin.',
    highYieldPoints: [
      'Faire un bilan hépatique (transaminases) et une numération avant d’instaurer le traitement ; arrêter H et Z si transaminases > 5N (ou > 3N avec ictère).',
    ],
    diagramType: 'respiratory',
    reference: 'Manuel de la Lutte Antituberculeuse — Ministère de la Santé (Algérie) / E. Pilly',
  },
  {
    id: 'L4-GAST-01',
    year: 4,
    subject: 'Gastro-entérologie',
    specialty: 'Gastro-entérologie',
    chapter: 'Hépatologie',
    title: 'Cirrhose hépatique, hypertension portale et complications aiguës',
    durationMin: 19,
    objectives: [
      'Calculer et interpréter le score de Child-Pugh.',
      'Conduire la prise en charge d’une hémorragie digestive par rupture de varices œsophagiennes et d’une infection du liquide d’ascite.',
    ],
    definitions: [
      { term: 'Infection spontanée du liquide d’ascite (ISLA)', definition: 'Taux de polynucléaires neutrophiles ≥ 250 éléments/mm³ dans le liquide d’ascite, sans foyer chirurgical intra-abdominal.' },
    ],
    contentSections: [
      {
        heading: '1. Diagnostic et gravité (Child-Pugh)',
        body: 'La cirrhose associe fibrose annulaire et nodules de régénération. Le score de Child-Pugh (A, B, C) repose sur 5 critères : encéphalopathie, ascite, bilirubine, albuminémie et TP/INR.',
      },
      {
        heading: '2. Rupture de varices œsophagiennes (VO)',
        body: 'Urgence vitale : stabilisation hémodynamique prudente (cible Hb 7–8 g/dL pour ne pas majorer la pression portale), drogue vasoactive immédiate (terlipressine ou octréotide), antibioprophylaxie systématique (céfotaxime ou norfloxacine) et ligature élastique per-endoscopique dans les 12 heures.',
      },
    ],
    summary:
      'Ascite infectée = PNN ≥ 250/mm³ → Céfotaxime IV + Albumine. Rupture VO = Vasoactif + Antibioprophylaxie + Ligature endoscopique.',
    highYieldPoints: [
      'En prévention primaire de la rupture de VO de grande taille, les bêtabloquants non cardiosélectifs (propranolol, carvédilol) ou la ligature sont indiqués.',
    ],
    diagramType: 'none',
    reference: 'Hépato-Gastro-Entérologie — CDU-HGE',
  },
  {
    id: 'L4-NEPH-01',
    year: 4,
    subject: 'Néphrologie',
    specialty: 'Néphrologie',
    chapter: 'Insuffisance rénale',
    title: 'Insuffisance rénale aiguë (IRA) : classification KDIGO et orientation étiologique',
    durationMin: 18,
    objectives: [
      'Distinguer une IRA fonctionnelle (prérénale) d’une nécrose tubulaire aiguë (organique).',
      'Reconnaître les critères d’épuration extrarénale en urgence.',
    ],
    definitions: [
      { term: 'Critères KDIGO d’IRA', definition: 'Augmentation de la créatininémie ≥ 26,5 µmol/L en 48h, ou ≥ 1,5× la valeur de base en 7 jours, ou diurèse < 0,5 mL/kg/h pendant ≥ 6h.' },
    ],
    contentSections: [
      {
        heading: '1. Démarche devant une IRA',
        body: 'Toujours éliminer d’abord un obstacle sur les voies urinaires par une échographie rénale et vésicale (IRA obstructive = globe vésical ou dilatation pyélocalicielle). Ensuite, différencier IRA fonctionnelle (Na+ urinaire < 20 mmol/L, FENa < 1 %, rapport U/P urée > 10) de l’IRA organique par nécrose tubulaire aiguë (Na+ u > 40 mmol/L, FENa > 2 %).',
      },
      {
        heading: '2. Indications d’hémodialyse en urgence',
        body: 'Mnémonique AEIOU : Acidose métabolique sévère réfractaire (pH < 7,15), Électrolytes (hyperkaliémie menaçante > 6,5 mmol/L ou signes ECG), Intoxications dialysables (lithium, méthanol, éthylène glycol), Surcharge hydrosodée avec OAP réfractaire aux diurétiques, Urémie symptomatique (péricardite ou encéphalopathie urémique).',
      },
    ],
    summary:
      '1er réflexe = éliminer l’obstacle (échographie). IRA fonctionnelle = urines concentrées, pauvres en sodium (FENa < 1 %). Dialyse urgente = hyperkaliémie avec signes ECG, OAP anurique, acidose réfractaire.',
    highYieldPoints: [
      'La première anomalie ECG de l’hyperkaliémie est l’apparition d’ondes T amples, pointues et symétriques ; le gluconate de calcium IV protège le myocarde immédiatement sans baisser la kaliémie.',
    ],
    diagramType: 'nephron',
    reference: 'Néphrologie — Collège Universitaire des Enseignants de Néphrologie (CUEN)',
  },

  // 5ème année
  {
    id: 'L5-NEUR-01',
    year: 5,
    subject: 'Neurologie',
    specialty: 'Neurologie',
    chapter: 'Pathologie neurovasculaire',
    title: 'Accidents vasculaires cérébraux (AVC) à la phase aiguë',
    durationMin: 20,
    objectives: [
      'Distinguer en imagerie immédiate un AVC ischémique d’un AVC hémorragique.',
      'Connaître les fenêtres et contre-indications de la thrombolyse et de la thrombectomie.',
    ],
    definitions: [
      { term: 'AVC ischémique', definition: 'Infarcissement cérébral secondaire à l’occlusion d’une artère encéphalique (80–85 % des AVC).' },
    ],
    contentSections: [
      {
        heading: '1. Urgence diagnostique et imagerie',
        body: 'Tout déficit neurologique focal d’installation brutale impose une imagerie cérébrale en urgence (IRM cérébrale avec séquences diffusion/FLAIR/T2*/ARM, ou à défaut scanner cérébral sans injection pour éliminer une hémorragie intracérébrale).',
      },
      {
        heading: '2. Revascularisation et respect de la pression artérielle',
        body: 'La thrombolyse IV par altéplase (rt-PA) est indiquée dans les 4h30 suivant le début des symptômes (après élimination des contre-indications et contrôle de la PA < 185/110 mmHg). Une thrombectomie mécanique est associée en cas d’occlusion proximale (carotide interne, M1) jusqu’à 6h (voire 24h selon pénombre). En l’absence de thrombolyse, respecter la PA jusqu’à 220/120 mmHg.',
      },
    ],
    summary:
      'Imagerie urgente obligatoire avant tout antiagrégant. Thrombolyse IV ≤ 4h30 (PA < 185/110). Ne pas faire baisser brutalement la PA dans l’AVC ischémique non thrombolysé.',
    highYieldPoints: [
      'La glycémie capillaire doit être systématiquement vérifiée devant tout déficit aigu pour écarter une hypoglycémie trompeuse.',
    ],
    diagramType: 'neuro',
    reference: 'Neurologie — Collège des Enseignants de Neurologie (CEN)',
  },
  {
    id: 'L5-ENDO-01',
    year: 5,
    subject: 'Endocrinologie',
    specialty: 'Endocrinologie',
    chapter: 'Diabétologie',
    title: 'Acidocétose diabétique : physiopathologie et protocole de réanimation',
    durationMin: 18,
    objectives: [
      'Poser le diagnostic biologique de l’acidocétose diabétique.',
      'Appliquer les étapes hiérarchisées de réhydratation, insulinothérapie et supplémentation potassique.',
    ],
    definitions: [
      { term: 'Triade de l’acidocétose', definition: 'Hyperglycémie (> 2,5 g/L ou 13,9 mmol/L), cétose (cétonémie ≥ 3 mmol/L ou cétonurie ≥ ++), et acidose métabolique (pH < 7,30 et/ou HCO3- < 15–18 mmol/L) à trou anionique élevé.' },
    ],
    contentSections: [
      {
        heading: '1. Mécanisme et tableau clinique',
        body: 'La carence absolue ou relative en insuline associée à l’excès d’hormones de contre-régulation stimule la lipolyse, produisant des corps cétoniques acides. Cliniquement : syndrome polyuro-polydipsique, déshydratation, dyspnée ample de Kussmaul, haleine acétonique, douleurs abdominales et vomissements.',
      },
      {
        heading: '2. Prise en charge thérapeutique',
        body: '1) Réhydratation par sérum salé isotonique NaCl 0,9 % dès la 1ère heure. 2) Insulinothérapie IV à la seringue électrique (0,1 UI/kg/h) UNIQUEMENT après vérification d’une kaliémie ≥ 3,3 mmol/L (si K+ < 3,3, supplémenter en KCl avant l’insuline). 3) Ajouter du glucosé 5 % ou 10 % lorsque la glycémie descend sous 2,5 g/L pour maintenir l’insuline jusqu’à disparition de la cétose.',
      },
    ],
    summary:
      'Priorité 1 = Remplissage (NaCl 0,9 %). Priorité 2 = Vérifier K+ avant insuline. Ne jamais arrêter l’insuline IV tant que la cétose persiste.',
    highYieldPoints: [
      'Une pseudo-hyponatrémie osmotique existe : calculer la natrémie corrigée = Na mesurée + 1,6 × [(glycémie en g/L - 1) / 1] × 1,6 (ou + 0,3 mmol par mmol/L de glucose au-dessus de 5,5).',
    ],
    diagramType: 'endocrine',
    reference: 'Endocrinologie, Diabétologie et Maladies Métaboliques — CEEDMM',
  },
  {
    id: 'L5-PED-01',
    year: 5,
    subject: 'Pédiatrie',
    specialty: 'Pédiatrie',
    chapter: 'Urgences hydro-électrolytiques',
    title: 'Déshydratation aiguë du nourrisson : évaluation et réhydratation',
    durationMin: 18,
    objectives: [
      'Estimer le pourcentage de perte de poids et reconnaître les signes de gravité hémodynamique.',
      'Conduire la réhydratation orale par SRO vs réhydratation intraveineuse.',
    ],
    definitions: [
      { term: 'Déshydratation sévère (≥ 10 %)', definition: 'Perte ≥ 10 % du poids corporel avec signes de choc hypovolémique (tachycardie, temps de recoloration cutanée > 3 s, marbrures, troubles de conscience).' },
    ],
    contentSections: [
      {
        heading: '1. Évaluation clinique',
        body: 'Le critère le plus fiable de gravité est le pourcentage de perte de poids : < 5 % (légère), 5–9 % (modérée), ≥ 10 % (sévère). Rechercher pli cutané persistant, fontanelle antérieure déprimée, yeux cernés, sécheresse des muqueuses et oligurie.',
      },
      {
        heading: '2. Réhydratation',
        body: 'En l’absence de choc et de vomissements incoercibles, les Solutés de Réhydratation Orale (SRO) donnés par petites gorgées répétées suffisent dans la majorité des gastro-entérites. En cas de choc ou d’échec des SRO : remplissage vasculaire immédiat par NaCl 0,9 % (20 mL/kg en bolus) puis réhydratation IV adaptée.',
      },
    ],
    summary:
      'SRO = traitement de choix des déshydratations légères à modérées. Choc hypovolémique = bolus NaCl 0,9 % 20 mL/kg IV rapide.',
    highYieldPoints: [
      'Dans une déshydratation hypernatrémique (> 150 mmol/L), la correction doit être progressive sur 48h pour prévenir l’œdème cérébral.',
    ],
    diagramType: 'none',
    reference: 'Pédiatrie — Collège National des Pédiatres Universitaires / OMS',
  },
  {
    id: 'L5-GYN-01',
    year: 5,
    subject: 'Gynécologie-Obstétrique',
    specialty: 'Gynécologie-obstétrique',
    chapter: 'Pathologie de la grossesse',
    title: 'Pré-éclampsie, critères de sévérité et prise en charge de l’éclampsie',
    durationMin: 19,
    objectives: [
      'Définir la pré-éclampsie et identifier les signes de gravité materno-fœtale (HELLP, éclampsie).',
      'Prescrire le sulfate de magnésium et les antihypertenseurs adaptés à la grossesse.',
    ],
    definitions: [
      { term: 'Pré-éclampsie', definition: 'HTA gravidique (PAS ≥ 140 et/ou PAD ≥ 90 mmHg après 20 SA) associée à une protéinurie significative (≥ 0,3 g/24h) ou à une atteinte d’organe maternel.' },
    ],
    contentSections: [
      {
        heading: '1. Signes de gravité et syndrome HELLP',
        body: 'Critères sévères : PA ≥ 160/110 mmHg, céphalées en casque, phosphènes, acouphènes, réflexes ostéotendineux vifs, douleur épigastrique en barre (signe de Chaussier), oligurie, thrombopénie < 100 000/mm³, insuffisance rénale ou HELLP syndrome (Hemolysis, Elevated Liver enzymes, Low Platelets).',
      },
      {
        heading: '2. Traitement urgent',
        body: 'Antihypertenseur IV en cas d’HTA sévère (nicardipine ou labétalol ; IEC/ARA2 formellement contre-indiqués pendant la grossesse). Sulfate de magnésium IV pour la prévention et le traitement de la crise d’éclampsie (surveillance de la fréquence respiratoire, des ROT et de la diurèse). Le traitement curatif définitif reste la naissance du fœtus et du placenta.',
      },
    ],
    summary:
      'Pré-éclampsie = après 20 SA + protéinurie/dysfonction d’organe. Éclampsie = Sulfate de Magnésium IV. Antihypertenseurs autorisés = nicardipine, labétalol, alpha-méthyldopa.',
    highYieldPoints: [
      'L’antidote du surdosage en sulfate de magnésium (abolition des ROT, bradypnée < 12/min) est le gluconate de calcium IV.',
    ],
    diagramType: 'none',
    reference: 'Gynécologie-Obstétrique — CNGOF',
  },

  // 6ème année
  {
    id: 'L6-URG-01',
    year: 6,
    subject: 'Urgences & Réanimation',
    specialty: 'Urgences et Réanimation',
    chapter: 'Défaillances circulatoires',
    title: 'États de choc : classification hémodynamique et prise en charge initiale',
    durationMin: 20,
    objectives: [
      'Distinguer les 4 grands mécanismes d’état de choc (hypovolémique, cardiogénique, obstructif, distributif).',
      'Adapter l’expansion volémique et les amines vasopressives selon l’étiologie.',
    ],
    definitions: [
      { term: 'État de choc', definition: 'Insuffisance circulatoire aiguë entraînant une hypoperfusion tissulaire généralisée et une dysoxie cellulaire (hyperlactatémie > 2 mmol/L).' },
    ],
    contentSections: [
      {
        heading: '1. Profils hémodynamiques',
        body: 'Choc hypovolémique et cardiogénique : débit cardiaque bas et résistances vasculaires systémiques (RVS) élevées ; PVC basse dans l’hypovolémie, PVC élevée dans le cardiogénique. Choc obstructif (tamponnade, EP massive, pneumothorax compressif) : obstacle au remplissage ou à l’éjection. Choc distributif (septique, anaphylactique) : vasoplégie avec RVS basses et débit initialement élevé ou normal.',
      },
      {
        heading: '2. Principes thérapeutiques',
        body: 'Choc septique : remplissage par cristalloïdes (30 mL/kg dans les 3 premières heures), hémocultures puis antibiothérapie probabiliste IV dans l’heure, et noradrénaline en première intention pour maintenir une PAM ≥ 65 mmHg.',
      },
    ],
    summary:
      'Choc = hypoperfusion tissulaire (marbrures, oligurie, lactates élevés), pas uniquement une hypotension. Choc septique = cristalloïdes + antibiothérapie urgente + noradrénaline (PAM ≥ 65 mmHg).',
    highYieldPoints: [
      'La tamponnade cardiaque réalise une triade de Beck : hypotension artérielle, turgescence jugulaire et assourdissement des bruits du cœur.',
    ],
    diagramType: 'cardiac',
    reference: 'Médecine Intensive – Réanimation — CNERM / Surviving Sepsis Campaign',
  },
  {
    id: 'L6-CHIR-01',
    year: 6,
    subject: 'Chirurgie Viscérale',
    specialty: 'Chirurgie',
    chapter: 'Urgences abdominales',
    title: 'Occlusions intestinales aiguës : mécanismes, diagnostic et gravité',
    durationMin: 18,
    objectives: [
      'Différencier cliniquement et radiologiquement une occlusion du grêle d’une occlusion colique.',
      'Reconnaître une occlusion par strangulation nécessitant une chirurgie en urgence absolue.',
    ],
    definitions: [
      { term: 'Syndrome occlusif', definition: 'Association de douleurs abdominales, vomissements, arrêt des matières et des gaz, et météorisme abdominal.' },
    ],
    contentSections: [
      {
        heading: '1. Grêle vs Côlon & Obstruction vs Strangulation',
        body: 'L’occlusion du grêle donne des vomissements précoces et un arrêt des matières et des gaz parfois plus tardif (niveaux hydro-aériques centraux plus larges que hauts). L’occlusion colique donne un météorisme important, un arrêt précoce des matières et des gaz et des vomissements tardifs (niveaux périphériques plus hauts que larges).',
      },
      {
        heading: '2. Signes de souffrance ischémique (strangulation)',
        body: 'Début brutal, douleur intense continue sans rémission, fièvre, défense abdominale, hyperleucocytose, hyperlactatémie et absence de rehaussement pariétal au scanner injecté : urgence chirurgicale immédiate (risque de nécrose et perforation).',
      },
    ],
    summary:
      'Strangulation (bride, volvulus, hernie étranglée) = urgence chirurgicale immédiate. Toujours examiner les orifices herniaires devant tout syndrome occlusif !',
    highYieldPoints: [
      'Le volvulus du sigmoïde survient volontiers chez le sujet âgé constipé et réalise une image en « grain de café » ou en arceau.',
    ],
    diagramType: 'none',
    reference: 'Chirurgie Digestive — Collège Français de Chirurgie Générale et Digestive',
  },
  {
    id: 'L6-MED-01',
    year: 6,
    subject: 'Médecine Interne',
    specialty: 'Médecine interne',
    chapter: 'Connectivites',
    title: 'Lupus érythémateux systémique (LES) : critères et atteinte rénale',
    durationMin: 18,
    objectives: [
      'Identifier les principales manifestations cliniques et auto-anticorps du LES.',
      'Connaître la stratégie thérapeutique de fond par hydroxychloroquine.',
    ],
    definitions: [
      { term: 'Anticorps anti-ADN natif et anti-Sm', definition: 'Auto-anticorps hautement spécifiques du lupus érythémateux systémique ; les anti-ADN natifs corrèlent avec l’activité lupique et l’atteinte rénale.' },
    ],
    contentSections: [
      {
        heading: '1. Tableau clinico-biologique',
        body: 'Atteinte préférentielle de la femme jeune : érythème malaire en aile de papillon photosensible, polyarthrite non destructrice, sérites (pleurésie, péricardite), cytopénies auto-immunes, glomérulonéphrite lupique (classe III/IV proliférative). Baisse du complément sérique (C3, C4, CH50) en poussée.',
      },
      {
        heading: '2. Traitement',
        body: 'Photoprotection et hydroxychloroquine systématique chez tous les patients (sauf contre-indication), avec surveillance ophtalmologique. Corticothérapie et immunosuppresseurs (mycophénolate mofétil, cyclophosphamide) dans les formes viscérales sévères.',
      },
    ],
    summary:
      'AAN positifs dans > 95 % des cas (très sensibles). Anti-Sm et anti-ADN natifs = spécifiques. Hydroxychloroquine = traitement de fond systématique.',
    highYieldPoints: [
      'Rechercher systématiquement un syndrome des antiphospholipides (SAPL) associé devant des thromboses ou fausses couches à répétition.',
    ],
    diagramType: 'none',
    reference: 'Médecine Interne — CEMI',
  },
  {
    id: 'L6-HEM-01',
    year: 6,
    subject: 'Hématologie',
    specialty: 'Hématologie',
    chapter: 'Pathologie érythrocytaire',
    title: 'Orientation diagnostique devant une anémie (microcytaire, normocytaire, macrocytaire)',
    durationMin: 17,
    objectives: [
      'Interpréter le VGM et le taux de réticulocytes devant toute anémie.',
      'Distinguer une carence martiale d’une anémie inflammatoire ou d’une thalassémie.',
    ],
    definitions: [
      { term: 'Anémie régénérative', definition: 'Taux de réticulocytes > 120 000/mm³ (ou > 150 000/mm³), orientant vers une hémorragie aiguë ou une hémolyse.' },
    ],
    contentSections: [
      {
        heading: '1. Anémies microcytaires (VGM < 80 fL)',
        body: 'Trois causes principales : carence martiale (ferritine basse — test clé de première intention), anémie inflammatoire (ferritine normale ou élevée, CRP élevée), et thalassémies (ferritine normale, électrophorèse de l’hémoglobine montrant HbA2 > 3,5 % dans la bêta-thalassémie mineure).',
      },
      {
        heading: '2. Anémies macrocytaires (VGM > 100 fL)',
        body: 'Si arégénérative : carence en vitamine B12 (maladie de Biermer), carence en folates, hypothyroïdie, alcoolisme chronique ou myélodysplasie.',
      },
    ],
    summary:
      '1er bilan devant microcytose = Ferritinémie. Ferritine basse = carence en fer (toujours rechercher un saignement digestif chez l’homme ou la femme ménopausée).',
    highYieldPoints: [
      'Une supplémentation martiale orale dure habituellement 3 à 6 mois afin de corriger l’hémoglobine puis reconstituer les réserves (ferritine).',
    ],
    diagramType: 'none',
    reference: 'Hématologie — Société Française d’Hématologie (SFH)',
  },

  // 7ème année
  {
    id: 'L7-RES-01',
    year: 7,
    subject: 'Synthèse Résidanat',
    specialty: 'Cardiologie',
    chapter: 'Cardio-Vasculaire & Urgences',
    title: 'Hypertension artérielle : diagnostic, bilan OMS et choix thérapeutique',
    durationMin: 20,
    objectives: [
      'Confirmer une HTA en mesure ambulatoire (MAPA / automesure).',
      'Adapter les classes antihypertensives aux comorbidités et repérer les HTA secondaires.',
    ],
    definitions: [
      { term: 'HTA au cabinet', definition: 'PAS ≥ 140 mmHg et/ou PAD ≥ 90 mmHg confirmée lors de consultations répétées (ou ≥ 135/85 mmHg en automesure).' },
    ],
    contentSections: [
      {
        heading: '1. Bilan initial et recherche d’HTA secondaire',
        body: 'Bilan minimum : créatininémie + DFG, ionogramme sanguin (kaliémie), glycémie à jeun, bilan lipidique, bandelette urinaire (protéinurie/hématurie) et ECG 12 dérivations. Suspecter une HTA secondaire si HTA du sujet jeune (< 30–40 ans), HTA sévère résistante ou hypokaliémie (hyperaldostéronisme primaire, sténose de l’artère rénale, phéochromocytome).',
      },
      {
        heading: '2. Stratégie pharmacologique',
        body: 'Les 5 classes majeures (bithérapie d’emblée dans la majorité des cas) : IEC ou ARA2, inhibiteurs calciques dihydropyridiniques, diurétiques thiazidiques ou apparentés, et bêtabloquants (en indication cardiologique spécifique). Ne jamais associer IEC + ARA2.',
      },
    ],
    summary:
      'Bilan OMS systématique + ECG. Hypokaliémie + HTA = hyperaldostéronisme. Jamais d’association IEC + ARA2. Grossesse = contre-indication formelle aux IEC/ARA2.',
    highYieldPoints: [
      'Devant une HTA maligne ou une dissection aortique suspectée, contrôler les 2 bras et réaliser une imagerie aortique en urgence.',
    ],
    diagramType: 'cardiac',
    reference: 'Guide Algérien de Prise en Charge de l’HTA / ESC Guidelines',
  },
  {
    id: 'L7-RES-02',
    year: 7,
    subject: 'Synthèse Résidanat',
    specialty: 'Infectiologie',
    chapter: 'Urgences infectieuses',
    title: 'Méningites purulentes aiguës communautaires : conduite urgente',
    durationMin: 18,
    objectives: [
      'Poser l’indication d’une antibiothérapie immédiate avant ponction lombaire en cas de purpura fulminans.',
      'Interpréter l’analyse cyto-biochimique du LCS et prescrire la dexaméthasone.',
    ],
    definitions: [
      { term: 'Méningite bactérienne typique', definition: 'LCS trouble ou purulent, hyperprotéinorachie (> 1 g/L), hypoglycorachie (< 40 % de la glycémie), pléiocytose à prédominance de PNN (> 50 %).' },
    ],
    contentSections: [
      {
        heading: '1. Urgence absolue : purpura fulminans',
        body: 'Tout purpura fébrile comportant au moins un élément nécrotique ou ecchymotique de diamètre ≥ 3 mm impose l’injection IMMÉDIATE d’une C3G injectable (ceftriaxone ou céfotaxime) avant même le transfert et avant la ponction lombaire.',
      },
      {
        heading: '2. Antibiothérapie et corticothérapie',
        body: 'Chez l’adulte sans signe de focalisation ni trouble de conscience majeur : ponction lombaire immédiate puis C3G à dose méningée (ceftriaxone 75–100 mg/kg/j ou céfotaxime 200–300 mg/kg/j), associée à la dexaméthasone IV avant ou avec la 1ère dose d’antibiotique (pneumocoque/méningocoque). Ajouter l’amoxicilline si suspicion de Listeria (âge > 50 ans, grossesse, immunodépression, rhombencéphalite).',
      },
    ],
    summary:
      'Purpura fulminans = C3G immédiate avant tout examen. LCS bactérien = PNN + hypoglycorachie + hyperprotéinorachie. Listeriose (sujet âgé / femme enceinte) = ajouter Amoxicilline.',
    highYieldPoints: [
      'L’isolement gouttelettes et la prophylaxie de l’entourage (rifampicine 2 jours ou ciprofloxacine dose unique) s’appliquent au méningocoque.',
    ],
    diagramType: 'neuro',
    reference: 'E. Pilly — Maladies Infectieuses et Tropicales / SPILF',
  },
  {
    id: 'L7-RES-03',
    year: 7,
    subject: 'Synthèse Résidanat',
    specialty: 'Endocrinologie',
    chapter: 'Urgences endocriniennes',
    title: 'Insuffisance surrénalienne aiguë : reconnaissance et traitement vital',
    durationMin: 16,
    objectives: [
      'Reconnaître une décompensation surrénalienne aiguë sans attendre les dosages hormonaux.',
      'Instaurer le traitement d’urgence par hémisuccinate d’hydrocortisone et réhydratation.',
    ],
    definitions: [
      { term: 'Profil biologique évocateur', definition: 'Hyponatrémie + hyperkaliémie + hypoglycémie + hémoconcentration + natriurèse conservée.' },
    ],
    contentSections: [
      {
        heading: '1. Signes d’alerte',
        body: 'Asthénie intense, hypotension voire choc réfractaire aux amines, douleurs abdominales pseudo-chirurgicales, nausées, vomissements, confusion. Souvent déclenchée par une infection, un stress chirurgical ou l’arrêt brutal d’une corticothérapie.',
      },
      {
        heading: '2. Conduite à tenir',
        body: 'Ne JAMAIS attendre le résultat du cortisol plasmatique pour traiter : prélèvement sanguin rapide puis injection immédiate de 100 mg d’hémisuccinate d’hydrocortisone en IVD (suivie de 100 à 200 mg/24h en continu ou fractionné) + remplissage par NaCl 0,9 % + G5 % (jamais de potassium au départ !).',
      },
    ],
    summary:
      'Hyponatrémie + Hyperkaliémie + Hypoglycémie + Choc = Insuffisance surrénalienne aiguë. Traitement immédiat = Hémisuccinate d’hydrocortisone IV + NaCl 0,9 % + glucose.',
    highYieldPoints: [
      'L’insuffisance corticotrope (secondaire à une corticothérapie prolongée) ne donne habituellement pas d’hyperkaliémie ni de mélanodermie, car l’aldostérone reste préservée.',
    ],
    diagramType: 'endocrine',
    reference: 'Endocrinologie — CEEDMM',
  },
  {
    id: 'L7-RES-04',
    year: 7,
    subject: 'Synthèse Résidanat',
    specialty: 'Pédiatrie',
    chapter: 'Prévention et calendrier algérien',
    title: 'Détresse respiratoire aiguë de l’enfant et bronchiolite du nourrisson',
    durationMin: 17,
    objectives: [
      'Évaluer la gravité d’une bronchiolite aiguë et poser les critères d’hospitalisation.',
      'Différencier laryngite aiguë sous-glottique, épiglottite et corps étranger inhalé.',
    ],
    definitions: [
      { term: 'Score de Silverman', definition: 'Score néonatal évaluant 5 critères de lutte respiratoire (balancement thoraco-abdominal, tirage intercostal, entonnoir xiphoïdien, battement des ailes du nez, geignement expiratoire) côté de 0 à 10.' },
    ],
    contentSections: [
      {
        heading: '1. Bronchiolite aiguë du nourrisson',
        body: 'Infection virale (VRS le plus souvent) chez le nourrisson de moins de 2 ans : rhinite suivie de polypnée, freinage expiratoire, sibilants et crépitants. Traitement essentiellement symptomatique : désobstruction rhinopharyngée (DRP) au sérum physiologique, fractionnement des repas, oxygénothérapie si SpO2 < 90–92 %. Pas de corticothérapie ni de bronchodilatateurs systématiques lors d’un 1er épisode.',
      },
      {
        heading: '2. Corps étranger bronchique',
        body: 'Syndrome de pénétration brutal (quinte de toux suffocante + cyanose chez un enfant en bonne santé en train de manger ou jouer) → bronchoscopie rigide d’extraction.',
      },
    ],
    summary:
      'Bronchiolite : DRP + hydratation + O2 si SpO2 < 92 %. Hospitaliser systématiquement les nourrissons < 6 semaines ou anciens prématurés.',
    highYieldPoints: [
      'En cas d’épiglottite aiguë (enfant assis penché en avant, hypersialorrhée, dysphagie, voix étouffée), ne jamais allonger l’enfant ni utiliser d’abaisse-langue.',
    ],
    diagramType: 'respiratory',
    reference: 'Pédiatrie Algérienne / CNPU',
  },
];
