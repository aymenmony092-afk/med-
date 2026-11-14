import type { ClinicalCase } from '../types/med';

export const CLINICAL_CASES: ClinicalCase[] = [
  {
    id: 'CC-CARD-01',
    title: 'Douleur thoracique rétrosternale constrictive chez un fumeur hypertendu',
    specialty: 'Cardiologie',
    yearLevel: 4,
    difficulty: 'Moyen',
    patientPresentation: 'Homme de 58 ans, admis aux urgences médicales à 07h30 pour une douleur thoracique évoluant depuis 90 minutes.',
    medicalHistory: [
      'Hypertension artérielle connue sous amlodipine 5 mg/j',
      'Tabagisme actif estimé à 35 paquets-années',
      'Dyslipidémie non traitée',
    ],
    symptoms: [
      'Douleur médio-thoracique constrictive en étau, irradiant vers le bras gauche et la mâchoire',
      'Sueurs profuses et angoisse importante',
      'Nausées sans vomissements',
    ],
    clinicalExam: {
      vitals: 'PA 145/85 mmHg · FC 96 bpm · SpO2 97 % AA · FR 20/min · T° 36,9 °C',
      findings: [
        'Auscultation cardiaque régulière sans souffle ni frottement',
        'Champs pulmonaires libres sans râles crépitants (Killip I)',
        'Pouls périphériques perçus et symétriques aux deux membres supérieurs',
      ],
    },
    labResults: [
      { parameter: 'ECG 12 dérivations (réalisé à H+5 min)', value: 'Sus-décalage ST ≥ 3 mm en V1, V2, V3, V4 + miroir en DII-DIII-aVF', normalRange: 'Isoélectrique', status: 'eleve' },
      { parameter: 'Troponine Ic (H0)', value: 'En attente / 0,18 ng/mL', normalRange: '< 0,04 ng/mL', status: 'eleve' },
      { parameter: 'Créatininémie', value: '88 µmol/L', normalRange: '60 – 110 µmol/L', status: 'normal' },
      { parameter: 'Kaliémie', value: '4,2 mmol/L', normalRange: '3,5 – 5,0 mmol/L', status: 'normal' },
    ],
    diagnosticQuestions: [
      {
        question: 'Quel est le diagnostic le plus probable et le territoire coronaire impliqué ?',
        choices: [
          'SCA ST+ antérieur par occlusion probable de l’artère interventriculaire antérieure (IVA)',
          'Péricardite aiguë virale bénigne',
          'Dissection aortique aiguë type B',
          'Embolie pulmonaire massive',
        ],
        correctIndex: 0,
        rationale:
          'Une douleur angineuse prolongée avec sus-décalage ST convexe localisé en V1–V4 et miroir inférieur signe un SCA ST+ antérieur par occlusion de l’IVA.',
      },
      {
        question: 'Quelle décision thérapeutique prioritaire devez-vous prendre immédiatement ?',
        choices: [
          'Attendre le contrôle de la troponine à H3 avant toute décision',
          'Déclencher une reperfusion coronaire immédiate (angioplastie primaire < 120 min ou fibrinolyse) + DAPT + anticoagulation',
          'Administrer uniquement un bêtabloquant oral et renvoyer en consultation',
          'Réaliser une épreuve d’effort en urgence',
        ],
        correctIndex: 1,
        rationale:
          'Dans le SCA ST+, « Time is Muscle » : la décision de reperfusion repose uniquement sur la clinique et l’ECG sans attendre le dosage de troponine.',
      },
    ],
    differentialDiagnosis: [
      'Dissection aortique aiguë (toujours vérifier symétrie des pouls et TA)',
      'Péricardite aiguë (sus-décalage diffus concave sans miroir)',
      'Embolie pulmonaire',
      'Spasme œsophagien / RGO',
    ],
    correctDiagnosis: 'Syndrome Coronarien Aigu avec sus-décalage du segment ST (SCA ST+) antérieur (territoire IVA)',
    explanation:
      'L’association d’une douleur thoracique typique > 20 minutes chez un patient à haut risque cardiovasculaire et d’un sus-décalage ST systématisé en V1–V4 avec image en miroir confirme un SCA ST+ antérieur.',
    managementPrinciples: [
      'Double antiagrégation plaquettaire : Aspirine 150–300 mg + inhibiteur P2Y12 (prasugrel, ticagrélor ou clopidogrel selon protocole).',
      'Anticoagulation parentérale (héparine non fractionnée ou énoxaparine).',
      'Reperfusion urgente par angioplastie primaire si délai < 120 min, sinon fibrinolyse IV immédiate en l’absence de contre-indication.',
      'Prévention secondaire ultérieure (BASIC : Bêtabloquant, Antiagrégants, Statine haute intensité, IEC, Contrôle des facteurs de risque).',
    ],
    reference: 'Simulation pédagogique · ESC Guidelines STEMI / CNEC Cardiologie',
  },
  {
    id: 'CC-ENDO-01',
    title: 'Dyspnée ample, vomissements et haleine acétonique chez une jeune patiente',
    specialty: 'Endocrinologie',
    yearLevel: 5,
    difficulty: 'Moyen',
    patientPresentation: 'Jeune femme de 21 ans, amenée aux urgences pour asthénie majeure, douleurs abdominales diffuses et polypnée depuis 24 heures.',
    medicalHistory: [
      'Diabète de type 1 diagnostiqué à l’âge de 14 ans',
      'Arrêt volontaire de son schéma basal-bolus depuis 48 heures suite à une gastro-entérite',
    ],
    symptoms: [
      'Polyurie et polydipsie intenses les jours précédents',
      'Nausées, vomissements alimentaires puis bilieux',
      'Respiration profonde et rapide sans signe auscultatoire pulmonaire',
    ],
    clinicalExam: {
      vitals: 'PA 95/60 mmHg · FC 118 bpm · FR 28/min · SpO2 99 % AA · T° 37,2 °C',
      findings: [
        'Signes de déshydratation extracellulaire (plis cutanés, yeux cernés, tachycardie)',
        'Dyspnée de Kussmaul avec odeur acétonique de l’haleine',
        'Abdomen sensible de manière diffuse sans défense ni contracture',
      ],
    },
    labResults: [
      { parameter: 'Glycémie veineuse', value: '4,35 g/L (24,1 mmol/L)', normalRange: '0,70 – 1,10 g/L', status: 'eleve' },
      { parameter: 'pH artériel', value: '7,14', normalRange: '7,38 – 7,42', status: 'bas' },
      { parameter: 'Bicarbonates (HCO3-)', value: '9 mmol/L', normalRange: '22 – 26 mmol/L', status: 'bas' },
      { parameter: 'Cétonémie capillaire', value: '5,4 mmol/L', normalRange: '< 0,6 mmol/L', status: 'eleve' },
      { parameter: 'Kaliémie (K+)', value: '3,9 mmol/L', normalRange: '3,5 – 5,0 mmol/L', status: 'normal' },
      { parameter: 'Natrémie mesurée', value: '131 mmol/L', normalRange: '135 – 145 mmol/L', status: 'bas' },
    ],
    diagnosticQuestions: [
      {
        question: 'Quel est l’état acido-basique exact présenté par cette patiente ?',
        choices: [
          'Acidose métabolique sévère compensée partiellement par une hyperventilation (Kussmaul)',
          'Acidose respiratoire décompensée',
          'Alcalose métabolique par vomissements',
          'État hyperosmolaire pur sans cétose',
        ],
        correctIndex: 0,
        rationale:
          'pH < 7,38 avec HCO3- effondrés (9 mmol/L) et cétonémie > 3 mmol/L définissent une acidocétose diabétique sévère avec hyperventilation compensatrice.',
      },
      {
        question: 'Quelle conduite est indispensable concernant la kaliémie (3,9 mmol/L) lors de l’initiation de l’insuline ?',
        choices: [
          'Ne jamais donner de potassium car la kaliémie est normale',
          'Débuter une supplémentation potassique (KCl) dès l’initiation de l’insuline IV car celle-ci fait entrer le K+ dans les cellules',
          'Attendre une hyperkaliémie avant de surveiller l’ECG',
          'Administrer du furosémide en bolus',
        ],
        correctIndex: 1,
        rationale:
          'Le pool potassique total est effondré malgré une kaliémie initiale normale ; l’insuline et la correction de l’acidose entraînent une hypokaliémie rapide potentiellement mortelle si le K+ n’est pas supplémenté.',
      },
    ],
    differentialDiagnosis: [
      'Coma hyperosmolaire (habituellement sujet âgé DT2, glycémie > 6 g/L sans cétose franche)',
      'Acidose lactique',
      'Urgence chirurgicale abdominale (appendicite ou péritonite, pouvant aussi être facteur déclenchant)',
    ],
    correctDiagnosis: 'Acidocétose diabétique sévère par interruption de l’insulinothérapie',
    explanation:
      'L’arrêt de l’insuline chez une patiente DT1 provoque une cétogenèse massive et une diurèse osmotique conduisant à une déshydratation et une acidose métabolique à trou anionique élevé.',
    managementPrinciples: [
      'Réhydratation IV immédiate par sérum salé isotonique NaCl 0,9 % (1 L sur la 1ère heure puis adapté).',
      'Insulinothérapie rapide IVSE à 0,1 UI/kg/h (sans bolus initial nécessaire, uniquement si K+ ≥ 3,3 mmol/L).',
      'Supplémentation en KCl systématique dès que la kaliémie est < 5,2 mmol/L et la diurèse vérifiée.',
      'Relais ou adjonction de sérum glucosé G5 % lorsque la glycémie atteint ≤ 2,5 g/L pour maintenir l’insuline jusqu’à négativation de la cétose.',
    ],
    reference: 'Simulation pédagogique · CEEDMM Diabétologie',
  },
  {
    id: 'CC-INF-01',
    title: 'Syndrome méningé fébrile et purpura chez un jeune adulte',
    specialty: 'Infectiologie',
    yearLevel: 6,
    difficulty: 'Difficile',
    patientPresentation: 'Étudiant de 20 ans, résidant en cité universitaire, amené pour céphalées intenses, fièvre élevée et troubles de la vigilance apparus en 8 heures.',
    medicalHistory: ['Aucun antécédent médical connu', 'Pas de voyage récent'],
    symptoms: [
      'Céphalées holocrâniennes intolérables avec photophobie',
      'Vomissements en jet',
      'Fièvre à 39,8 °C avec frissons',
    ],
    clinicalExam: {
      vitals: 'PA 90/55 mmHg · FC 124 bpm · FR 24/min · SpO2 96 % · Glasgow 13/15 (somnolent)',
      findings: [
        'Raideur de nuque franche avec signe de Kernig positif',
        'Présence de 4 taches purpuriques ecchymotiques > 4 mm sur les membres inférieurs ne s’effaçant pas à la vitropression',
        'Marbrures aux genoux',
      ],
    },
    labResults: [
      { parameter: 'CRP', value: '210 mg/L', normalRange: '< 5 mg/L', status: 'eleve' },
      { parameter: 'Leucocytes', value: '22 400 /mm³ (90 % PNN)', normalRange: '4 000 – 10 000 /mm³', status: 'eleve' },
      { parameter: 'Plaquettes', value: '92 000 /mm³', normalRange: '150 000 – 400 000 /mm³', status: 'bas' },
      { parameter: 'Lactates artériels', value: '4,1 mmol/L', normalRange: '< 2,0 mmol/L', status: 'eleve' },
    ],
    diagnosticQuestions: [
      {
        question: 'Quel est le geste thérapeutique IMMÉDIAT à réaliser avant même la ponction lombaire ?',
        choices: [
          'Attendre le scanner cérébral puis la ponction lombaire avant tout antibiotique',
          'Injecter immédiatement une C3G injectable (ceftriaxone 2 g IV ou IM) + remplissage vasculaire',
          'Prescrire du paracétamol seul et surveiller 6 heures',
          'Réaliser un fond d’œil avant tout traitement',
        ],
        correctIndex: 1,
        rationale:
          'La présence d’un purpura extensif/nécrotique ≥ 3 mm avec fièvre et signes de choc définit un purpura fulminans (méningococcémie probable). C’est une urgence absolue : antibiothérapie C3G immédiate avant tout examen complémentaire.',
      },
    ],
    differentialDiagnosis: [
      'Méningite à pneumocoque avec bactériémie',
      'Endocardite infectieuse aiguë avec emboles septiques',
      'Hémorragie méningée fébrile',
    ],
    correctDiagnosis: 'Purpura fulminans probablement à Neisseria meningitidis (méningocoque) avec choc septique débutant',
    explanation:
      'Le contexte de collectivité jeune, l’évolution suraiguë, le syndrome méningé fébrile et les éléments purpuriques nécrotiques ≥ 3 mm caractérisent le purpura fulminans.',
    managementPrinciples: [
      'Injection immédiate de ceftriaxone (ou céfotaxime) IV/IM dès la suspicion clinique.',
      'Expansion volémique par cristalloïdes et amines vasopressives (noradrénaline) si persistance de l’hypotension.',
      'Dexaméthasone IV associée et ponction lombaire différée dès stabilisation hémodynamique et correction des troubles de l’hémostase.',
      'Isolement respiratoire gouttelettes, déclaration obligatoire et antibioprophylaxie des sujets contacts.',
    ],
    reference: 'Simulation pédagogique · E. Pilly / SPILF',
  },
  {
    id: 'CC-PNEU-01',
    title: 'Dyspnée aiguë et douleur basithoracique après immobilisation',
    specialty: 'Pneumologie',
    yearLevel: 4,
    difficulty: 'Moyen',
    patientPresentation: 'Femme de 49 ans consultant aux urgences pour essoufflement brutal apparu au lever ce matin.',
    medicalHistory: [
      'Fracture de cheville plâtrée depuis 14 jours sans prophylaxie anticoagulante',
      'Obésité modérée (IMC 31 kg/m²)',
    ],
    symptoms: [
      'Dyspnée aiguë de repos',
      'Douleur thoracique latéro-basale droite majorée à l’inspiration profonde',
      'Légère hémoptysie',
    ],
    clinicalExam: {
      vitals: 'PA 118/72 mmHg · FC 114 bpm · FR 26/min · SpO2 89 % AA · T° 37,6 °C',
      findings: [
        'Auscultation pulmonaire quasi normale',
        'Tachycardie sinusale régulière',
        'Mollet gauche œdématié et douloureux à la dorsiflexion après retrait de l’attelle',
      ],
    },
    labResults: [
      { parameter: 'ECG', value: 'Tachycardie sinusale 114/min, aspect S1Q3, ondes T négatives en V1–V3', normalRange: 'Normal', status: 'eleve' },
      { parameter: 'Gaz du sang (air ambiant)', value: 'PaO2 58 mmHg · PaCO2 30 mmHg · pH 7,47', normalRange: 'PaO2 80–100 · PaCO2 35–45', status: 'bas' },
      { parameter: 'D-dimères', value: 'Non nécessaires si probabilité forte (ou 3 400 ng/mL)', normalRange: '< 500 ng/mL', status: 'eleve' },
    ],
    diagnosticQuestions: [
      {
        question: 'Quel examen d’imagerie confirme formellement le diagnostic chez cette patiente stable ?',
        choices: [
          'Angioscanner thoracique des artères pulmonaires',
          'Spirométrie avec test de réversibilité',
          'Radiographie thoracique de profil seule',
          'Bronchoscopie souple',
        ],
        correctIndex: 0,
        rationale:
          'Avec une probabilité clinique élevée (score de Wells ou Genève élevé), on réalise directement un angioscanner thoracique (sans perdre de temps avec les D-dimères) qui visualise le thrombus artériel pulmonaire.',
      },
    ],
    differentialDiagnosis: [
      'Pneumothorax spontané',
      'Pneumopathie aiguë communautaire',
      'Péricardite ou SCA',
    ],
    correctDiagnosis: 'Embolie pulmonaire aiguë compliquant une thrombose veineuse profonde post-traumatique',
    explanation:
      'L’hypoxémie + hypocapnie (effet shunt), la tachycardie sinusale, l’aspect S1Q3 et le contexte d’immobilisation plâtrée rendent la probabilité clinique d’embolie pulmonaire élevée.',
    managementPrinciples: [
      'Oxygénothérapie nasale pour SpO2 ≥ 94 %.',
      'Anticoagulation curative immédiate dès la suspicion forte (HBPM, fondaparinux ou AOD / HNF selon fonction rénale).',
      'Évaluation du risque de mortalité précoce (score sPESI, troponine, dilatation VD à l’ETT/scanner).',
    ],
    reference: 'Simulation pédagogique · ESC Guidelines Embolie Pulmonaire',
  },
  {
    id: 'CC-GYN-01',
    title: 'Métrorragies noirâtres et douleur pelvienne à 7 semaines d’aménorrhée',
    specialty: 'Gynécologie-obstétrique',
    yearLevel: 5,
    difficulty: 'Moyen',
    patientPresentation: 'Femme de 28 ans, nullipare, consultant pour douleurs pelviennes latéralisées à droite et métrorragies peu abondantes couleur sépia.',
    medicalHistory: [
      'Retard de règles de 3 semaines (7 SA)',
      'Antécédent de salpingite aiguë traitée il y a 2 ans',
      'Tabagisme occasionnel',
    ],
    symptoms: [
      'Douleur en fosse iliaque droite d’intensité croissante',
      'Saignements noirâtres peu abondants',
      'Sensation de lipothymie au lever',
    ],
    clinicalExam: {
      vitals: 'PA 102/65 mmHg · FC 104 bpm · T° 37,0 °C',
      findings: [
        'Sensibilité en fosse iliaque droite sans contracture franche',
        'Toucher vaginal : utérus peu augmenté de volume, douleur vive au cul-de-sac latéral droit et à la mobilisation utérine',
      ],
    },
    labResults: [
      { parameter: 'β-hCG plasmatique quantitative', value: '3 200 UI/L', normalRange: '< 5 UI/L hors grossesse', status: 'eleve' },
      { parameter: 'Échographie pelvienne endovaginale', value: 'Vacuité utérine, masse latéro-utérine droite hétérogène de 28 mm, lame d’épanchement dans le cul-de-sac de Douglas', normalRange: 'Sac intra-utérin visible si β-hCG > 1 500 UI/L', status: 'eleve' },
      { parameter: 'Hémoglobine', value: '10,8 g/dL', normalRange: '12,0 – 16,0 g/dL', status: 'bas' },
    ],
    diagnosticQuestions: [
      {
        question: 'Quel est le diagnostic retenu devant cette triade clinico-échographique ?',
        choices: [
          'Grossesse extra-utérine (GEU) tubaire droite en voie de fissuration/rupture',
          'Fausse couche spontanée complète intra-utérine',
          'Appendicite aiguë simple sur grossesse évolutive',
          'Kyste fonctionnel ovarien bénin isolé',
        ],
        correctIndex: 0,
        rationale:
          'Vacuité utérine avec β-hCG > 1 500–2 000 UI/L, masse latéro-utérine et hémopéritoine au Douglas signent une grossesse extra-utérine.',
      },
    ],
    differentialDiagnosis: [
      'Grossesse intra-utérine très précoce ou arrêtée',
      'Torsion d’annexe',
      'Rupture de kyste hémorragique du corps jaune',
    ],
    correctDiagnosis: 'Grossesse extra-utérine (GEU) droite avec hémopéritoine débutant',
    explanation:
      'L’antécédent de salpingite altère la muqueuse tubaire et représente un facteur de risque majeur de GEU.',
    managementPrinciples: [
      'Voie veineuse de bon calibre, bilan pré-opératoire, groupe Rhésus (prévention allo-immunisation anti-D si Rh négatif !).',
      'Traitement chirurgical par cœlioscopie (salpingotomie ou salpingectomie) indiqué devant les signes de fissuration/hémopéritoine et le taux d’hCG.',
    ],
    reference: 'Simulation pédagogique · CNGOF Grossesse Extra-Utérine',
  },
  {
    id: 'CC-PED-01',
    title: 'Diarrhée profuse, oligurie et somnolence chez un nourrisson de 8 mois',
    specialty: 'Pédiatrie',
    yearLevel: 5,
    difficulty: 'Moyen',
    patientPresentation: 'Nourrisson de 8 mois (poids habituel 8,5 kg) amené aux urgences pédiatriques pour diarrhée aqueuse abondante et vomissements depuis 48 heures.',
    medicalHistory: ['Né à terme, vaccinations à jour', 'Pas de pathologie chronique'],
    symptoms: [
      '8 à 10 selles liquides par jour',
      'Refus du biberon et des solutés oraux par vomissements répétés',
      'Couches sèches depuis plus de 8 heures',
    ],
    clinicalExam: {
      vitals: 'Poids mesuré : 7,6 kg (perte de 900 g ≈ 10,6 %) · FC 172 bpm · PA 72/44 mmHg · TRC 4 secondes · T° 38,1 °C',
      findings: [
        'Nourrisson hypotonique, geignard, yeux très cernés',
        'Fontanelle antérieure nettement déprimée et pli cutané abdominal persistant',
        'Extrémités fraîches avec marbrures des membres inférieurs',
      ],
    },
    labResults: [
      { parameter: 'Natrémie', value: '138 mmol/L', normalRange: '135 – 145 mmol/L', status: 'normal' },
      { parameter: 'Kaliémie', value: '3,4 mmol/L', normalRange: '3,5 – 5,0 mmol/L', status: 'bas' },
      { parameter: 'Bicarbonates', value: '14 mmol/L', normalRange: '22 – 26 mmol/L', status: 'bas' },
      { parameter: 'Créatininémie', value: '75 µmol/L', normalRange: '20 – 45 µmol/L chez le nourrisson', status: 'eleve' },
    ],
    diagnosticQuestions: [
      {
        question: 'Comment classez-vous cette déshydratation et quelle est la mesure immédiate ?',
        choices: [
          'Déshydratation modérée (5 %) : retour à domicile avec SRO',
          'Déshydratation sévère (≥ 10 %) avec choc hypovolémique : remplissage IV immédiat par NaCl 0,9 % 20 mL/kg',
          'Hyperhydratation cellulaire : restriction hydrique stricte',
          'Antibiothérapie probabiliste par ciprofloxacine seule',
        ],
        correctIndex: 1,
        rationale:
          'Perte de poids > 10 %, tachycardie extrême, TRC > 3 secondes et marbrures signent un choc hypovolémique imposant un bolus IV de NaCl 0,9 % à 20 mL/kg.',
      },
    ],
    differentialDiagnosis: [
      'Invagination intestinale aiguë (rechercher rectorragies, accès de pâleur)',
      'Syndrome hémolytique et urémique (SHU)',
      'Acidocétose inaugurale du nourrisson',
    ],
    correctDiagnosis: 'Déshydratation aiguë sévère isonatrémique (≥ 10 %) compliquée de choc hypovolémique sur gastro-entérite aiguë',
    explanation:
      'Les pertes digestives massives chez le nourrisson entraînent rapidement un choc hypovolémique et une acidose métabolique par pertes de bicarbonates et hypoperfusion.',
    managementPrinciples: [
      'Remplissage vasculaire en urgence : NaCl 0,9 % 20 mL/kg en 15–20 min (renouvelable si persistance des signes de choc).',
      'Réhydratation IV de maintenance + correction du déficit sur 24h avec apport potassique après reprise de la diurèse.',
      'Reprise précoce de l’alimentation et des SRO dès disparition des vomissements.',
    ],
    reference: 'Simulation pédagogique · Pédiatrie Urgences / OMS',
  },
];
