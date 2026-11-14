export interface LabReferenceItem {
  category: string;
  parameter: string;
  normalRange: string;
  unit: string;
  clinicalNote: string;
}

export const LAB_REFERENCES: LabReferenceItem[] = [
  { category: 'Hématologie (NFS)', parameter: 'Hémoglobine (Homme)', normalRange: '13,0 – 17,5', unit: 'g/dL', clinicalNote: 'Anémie si < 13 g/dL chez l’homme adulte (OMS)' },
  { category: 'Hématologie (NFS)', parameter: 'Hémoglobine (Femme)', normalRange: '12,0 – 16,0', unit: 'g/dL', clinicalNote: 'Anémie si < 12 g/dL (< 11 g/dL chez la femme enceinte)' },
  { category: 'Hématologie (NFS)', parameter: 'VGM (Volume Globulaire Moyen)', normalRange: '80 – 100', unit: 'fL', clinicalNote: '< 80 microcytose ; > 100 macrocytose' },
  { category: 'Hématologie (NFS)', parameter: 'Leucocytes', normalRange: '4 000 – 10 000', unit: '/mm³', clinicalNote: 'Hyperleucocytose > 10 000 ; neutropénie si PNN < 1 500/mm³' },
  { category: 'Hématologie (NFS)', parameter: 'Plaquettes', normalRange: '150 000 – 400 000', unit: '/mm³', clinicalNote: 'Risque hémorragique spontané majeur si < 20 000/mm³' },
  { category: 'Ionogramme & Rénal', parameter: 'Natrémie (Na+)', normalRange: '135 – 145', unit: 'mmol/L', clinicalNote: 'Hyponatrémie sévère si < 120 mmol/L ou symptomatique' },
  { category: 'Ionogramme & Rénal', parameter: 'Kaliémie (K+)', normalRange: '3,5 – 5,0', unit: 'mmol/L', clinicalNote: 'Urgence vitale ECG si K+ > 6,0 mmol/L (ondes T amples, QRS larges)' },
  { category: 'Ionogramme & Rénal', parameter: 'Calcémie corrigée', normalRange: '2,20 – 2,60', unit: 'mmol/L (88 – 104 mg/L)', clinicalNote: 'Corriger selon l’albuminémie : Ca corr = Ca + 0,02 × (40 - Alb)' },
  { category: 'Ionogramme & Rénal', parameter: 'Créatininémie', normalRange: '60 – 110 (H) · 45 – 90 (F)', unit: 'µmol/L', clinicalNote: 'Évaluer le DFG par CKD-EPI plutôt que la créatinine isolée' },
  { category: 'Ionogramme & Rénal', parameter: 'Urée sanguine', normalRange: '2,5 – 7,5', unit: 'mmol/L (0,15 – 0,45 g/L)', clinicalNote: 'Élévation dissociée possible dans l’insuffisance rénale fonctionnelle' },
  { category: 'Métabolisme', parameter: 'Glycémie à jeun', normalRange: '0,70 – 1,10', unit: 'g/L (3,9 – 6,1 mmol/L)', clinicalNote: 'Diabète si ≥ 1,26 g/L (7,0 mmol/L) à deux reprises' },
  { category: 'Métabolisme', parameter: 'HbA1c', normalRange: '4,0 – 5,6', unit: '%', clinicalNote: 'Diabète si ≥ 6,5 % ; objectif habituel < 7 % sous traitement' },
  { category: 'Hépatique & Pancréatique', parameter: 'ASAT / ALAT', normalRange: '< 40', unit: 'UI/L', clinicalNote: 'Cytolyse hépatique si > N ; ALAT plus spécifique du foie' },
  { category: 'Hépatique & Pancréatique', parameter: 'Bilirubine totale', normalRange: '< 17', unit: 'µmol/L (< 10 mg/L)', clinicalNote: 'Ictère clinique visible généralement au-delà de 35–50 µmol/L' },
  { category: 'Hépatique & Pancréatique', parameter: 'Lipasémie', normalRange: '< 3N (N < 60)', unit: 'UI/L', clinicalNote: 'Pancréatite aiguë : douleur typique + lipasémie ≥ 3× la normale' },
  { category: 'Gazométrie Artérielle', parameter: 'pH artériel', normalRange: '7,38 – 7,42', unit: '—', clinicalNote: 'Acidémie < 7,38 ; alcalémie > 7,42' },
  { category: 'Gazométrie Artérielle', parameter: 'PaO2', normalRange: '80 – 100', unit: 'mmHg', clinicalNote: 'Insuffisance respiratoire si PaO2 < 60 mmHg en air ambiant' },
  { category: 'Gazométrie Artérielle', parameter: 'PaCO2', normalRange: '35 – 45', unit: 'mmHg', clinicalNote: 'Hypercapnie > 45 mmHg (hypoventilation alvéolaire)' },
  { category: 'Gazométrie Artérielle', parameter: 'Bicarbonates (HCO3-)', normalRange: '22 – 26', unit: 'mmol/L', clinicalNote: 'Paramètre métabolique de l’équilibre acido-basique' },
  { category: 'Inflammation & Hémostase', parameter: 'CRP', normalRange: '< 5', unit: 'mg/L', clinicalNote: 'Marqueur sensible de l’inflammation aiguë (cinétique rapide)' },
  { category: 'Inflammation & Hémostase', parameter: 'TP (Taux de Prothrombine)', normalRange: '70 – 100', unit: '%', clinicalNote: 'Explore la voie extrinsèque (facteurs VII, X, V, II, fibrinogène)' },
  { category: 'Inflammation & Hémostase', parameter: 'INR (hors AVK)', normalRange: '0,9 – 1,2', unit: '—', clinicalNote: 'Cible usuelle sous AVK : 2,0 – 3,0 (2,5 – 3,5 selon prothèse)' },
];

export interface TerminologyItem {
  term: string;
  root: string;
  definition: string;
}

export const MEDICAL_TERMINOLOGY: TerminologyItem[] = [
  { term: 'Bradycardie', root: 'brady- (lent) + cardie (cœur)', definition: 'Fréquence cardiaque inférieure à 60 battements par minute chez l’adulte au repos.' },
  { term: 'Tachypnée', root: 'tachy- (rapide) + -pnée (respiration)', definition: 'Accélération de la fréquence respiratoire (> 20 cycles/min chez l’adulte).' },
  { term: 'Dyspnée', root: 'dys- (difficile) + -pnée (respiration)', definition: 'Perception consciente et pénible d’une gêne respiratoire.' },
  { term: 'Orthopnée', root: 'ortho- (droit) + -pnée', definition: 'Dyspnée survenant en décubitus dorsal et améliorée par la position assise ou semi-assise.' },
  { term: 'Hématémèse', root: 'hémato- (sang) + -émèse (vomissement)', definition: 'Rejet de sang rouge ou noirâtre par la bouche lors d’un effort de vomissement (origine sus-mésocolique).' },
  { term: 'Méléna', root: 'melas (noir)', definition: 'Émission par l’anus de selles noires, poisseuses et nauséabondes correspondant à du sang digéré.' },
  { term: 'Rectorragie', root: 'recto- + -rragie (jaillissement)', definition: 'Émission de sang rouge vif par l’anus, témoignant le plus souvent d’un saignement digestif bas.' },
  { term: 'Anurie', root: 'a- (absence) + -urie (urine)', definition: 'Diurèse inférieure à 100 mL/24 heures (ou arrêt complet de la miction).' },
  { term: 'Oligurie', root: 'oligo- (peu) + -urie', definition: 'Diminution de la diurèse inférieure à 500 mL/24 heures chez l’adulte (< 0,5 mL/kg/h).' },
  { term: 'Céphalée', root: 'képhalê (tête)', definition: 'Douleur ressentie au niveau de la boîte crânienne, quelle qu’en soit l’étiologie.' },
  { term: 'Parésie / Plégie', root: '-parésie (faiblesse) / -plégie (paralysie)', definition: 'Déficit moteur partiel (parésie) ou complet (plégie) d’un ou plusieurs membres.' },
  { term: 'Aphasie', root: 'a- (privation) + phasis (parole)', definition: 'Trouble acquis du langage consécutif à une lésion cérébrale (aires de Broca ou de Wernicke).' },
  { term: 'Splénomégalie', root: 'spléno- (rate) + -mégalie (grand)', definition: 'Augmentation pathologique du volume de la rate, devenant palpable sous le rebord costal gauche.' },
  { term: 'Cholestase', root: 'cholé- (bile) + -stase (arrêt)', definition: 'Diminution ou arrêt de la sécrétion ou de l’écoulement biliaire vers le duodénum.' },
  { term: 'Ictère', root: 'ikteros (jaunisse)', definition: 'Coloration jaune des téguments et des muqueuses due à l’élévation de la bilirubinémie.' },
  { term: 'Cyanose', root: 'kyanos (bleu)', definition: 'Coloration bleutée des téguments et muqueuses apparaissant lorsque l’hémoglobine réduite dépasse 5 g/dL.' },
  { term: 'Pancytopénie', root: 'pan- (tout) + cyto- (cellule) + -pénie (baisse)', definition: 'Diminution simultanée des trois lignées sanguines : anémie, leucopénie et thrombopénie.' },
  { term: 'Adénopathie', root: 'adéno- (ganglion) + -pathie', definition: 'Hypertrophie pathologique d’un ganglion lymphatique (> 1 cm en général).' },
];

export interface AbbreviationItem {
  abbr: string;
  full: string;
  context: string;
}

export const MEDICAL_ABBREVIATIONS: AbbreviationItem[] = [
  { abbr: 'HTA', full: 'Hypertension Artérielle', context: 'Cardiologie · PA ≥ 140/90 mmHg au cabinet' },
  { abbr: 'IDM / SCA', full: 'Infarctus du Myocarde / Syndrome Coronarien Aigu', context: 'Cardiologie · Urgence coronaire' },
  { abbr: 'OAP', full: 'Œdème Aigu du Poumon', context: 'Cardiologie / Urgences · Détresse respiratoire aiguë' },
  { abbr: 'AVC / AIT', full: 'Accident Vasculaire Cérébral / Accident Ischémique Transitoire', context: 'Neurologie' },
  { abbr: 'BPCO', full: 'Bronchopneumopathie Chronique Obstructive', context: 'Pneumologie · VEMS/CVF < 0,70 après BD' },
  { abbr: 'EP / TVP', full: 'Embolie Pulmonaire / Thrombose Veineuse Profonde', context: 'Maladie thromboembolique veineuse' },
  { abbr: 'IRC / IRA', full: 'Insuffisance Rénale Chronique / Aiguë', context: 'Néphrologie' },
  { abbr: 'IEC / ARA2', full: 'Inhibiteur de l’Enzyme de Conversion / Antagoniste des Récepteurs AT1', context: 'Pharmacologie cardiovasculaire' },
  { abbr: 'NFS', full: 'Numération Formule Sanguine (Hémogramme)', context: 'Hématologie' },
  { abbr: 'ECBU', full: 'Examen Cytobactériologique des Urines', context: 'Microbiologie / Urologie' },
  { abbr: 'TDM / IRM', full: 'Tomodensitométrie (Scanner) / Imagerie par Résonance Magnétique', context: 'Radiologie' },
  { abbr: 'ECG', full: 'Électrocardiogramme', context: 'Cardiologie · 12 dérivations standard' },
  { abbr: 'ETT', full: 'Échocardiographie Transthoracique', context: 'Cardiologie' },
  { abbr: 'FOGD', full: 'Fibroscopie Œso-Gastro-Duodénale', context: 'Gastro-entérologie' },
  { abbr: 'PL', full: 'Ponction Lombaire', context: 'Neurologie / Infectiologie' },
  { abbr: 'LCR / LCS', full: 'Liquide Céphalo-Rachidien / Cérébro-Spinal', context: 'Neurologie' },
  { abbr: 'GEU', full: 'Grossesse Extra-Utérine', context: 'Gynécologie-Obstétrique' },
  { abbr: 'HRP', full: 'Hématome Rétro-Placentaire', context: 'Obstétrique · Urgence du 3e trimestre' },
  { abbr: 'CIVD', full: 'Coagulation Intravasculaire Disséminée', context: 'Hématologie / Réanimation' },
  { abbr: 'ACR', full: 'Arrêt Cardio-Respiratoire', context: 'Urgences & Réanimation' },
  { abbr: 'EMD', full: 'Examen de Moyenne Durée', context: 'Évaluation universitaire algérienne' },
  { abbr: 'CHU', full: 'Centre Hospitalo-Universitaire', context: 'Système de santé algérien' },
];
