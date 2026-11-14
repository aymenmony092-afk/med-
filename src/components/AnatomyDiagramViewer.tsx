import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  CheckCircle2,
  Eye,
  EyeOff,
  HelpCircle,
  Maximize2,
  Minimize2,
  Move,
  RotateCcw,
  Target,
  XCircle,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import type { MedicalLesson } from '../types/med';

export type AnatomyBoardId =
  | 'plexus_brachial'
  | 'willis'
  | 'cardiac'
  | 'nephron'
  | 'respiratory';

export interface AnatomyHotspot {
  id: string;
  number: number;
  label: string;
  shortLabel: string;
  x: number;
  y: number;
  lx: number;
  ly: number;
  align: 'start' | 'end' | 'middle';
  category: string;
  description: string;
  clinicalPearl: string;
}

export interface AnatomyBoard {
  id: AnatomyBoardId;
  title: string;
  shortTitle: string;
  specialty: string;
  yearTag: string;
  subtitle: string;
  reference: string;
  hotspots: AnatomyHotspot[];
}

export const ANATOMY_BOARDS: AnatomyBoard[] = [
  {
    id: 'plexus_brachial',
    title: 'Plexus brachial (C5–T1) & Branches terminales',
    shortTitle: 'Plexus brachial',
    specialty: 'Anatomie',
    yearTag: '1ère Année · Résidanat',
    subtitle:
      'Organisation en racines, troncs primaires, divisions, faisceaux et nerfs terminaux du membre supérieur.',
    reference: 'Rouvière / Kamina — Anatomie clinique du membre supérieur',
    hotspots: [
      {
        id: 'pb-c5c6',
        number: 1,
        label: 'Racines C5 & C6',
        shortLabel: 'Racines C5–C6',
        x: 118,
        y: 138,
        lx: 30,
        ly: 92,
        align: 'start',
        category: 'Racines spinales',
        description:
          'Rameaux antérieurs des nerfs spinaux C5 et C6 émergeant entre les muscles scalènes antérieur et moyen.',
        clinicalPearl:
          'Une lésion haute C5–C6 entraîne une paralysie de Duchenne-Erb (bras pendant en rotation médiale).',
      },
      {
        id: 'pb-c7',
        number: 2,
        label: 'Racine C7',
        shortLabel: 'Racine C7',
        x: 118,
        y: 256,
        lx: 28,
        ly: 234,
        align: 'start',
        category: 'Racines spinales',
        description:
          'Racine médiane du plexus brachial qui se prolonge seule pour constituer le tronc moyen.',
        clinicalPearl:
          'Le réflexe tricipital explore principalement la racine C7 via le nerf radial.',
      },
      {
        id: 'pb-c8t1',
        number: 3,
        label: 'Racines C8 & T1',
        shortLabel: 'Racines C8–T1',
        x: 118,
        y: 378,
        lx: 30,
        ly: 432,
        align: 'start',
        category: 'Racines spinales',
        description:
          'Racines inférieures du plexus, proches du dôme pleural et du ganglion stellaire sympathique.',
        clinicalPearl:
          'Un syndrome de Pancoast-Tobias (apex pulmonaire) associe atteinte C8–T1 et syndrome de Claude Bernard-Horner.',
      },
      {
        id: 'pb-tronc-sup',
        number: 4,
        label: 'Tronc supérieur (C5–C6)',
        shortLabel: 'Tronc sup.',
        x: 245,
        y: 158,
        lx: 205,
        ly: 68,
        align: 'middle',
        category: 'Troncs primaires',
        description:
          'Formé par la réunion des racines C5 et C6. Donne le nerf suprascapulaire et le nerf subclavier.',
        clinicalPearl:
          'Le point d’Erb correspond à la jonction C5–C6 en sus-claviculaire.',
      },
      {
        id: 'pb-faisceau-lat',
        number: 5,
        label: 'Faisceau latéral',
        shortLabel: 'Faisceau latéral',
        x: 525,
        y: 146,
        lx: 525,
        ly: 68,
        align: 'middle',
        category: 'Faisceaux',
        description:
          'Union des divisions antérieures des troncs supérieur et moyen, en dehors de l’artère axillaire.',
        clinicalPearl:
          'Donne le nerf musculo-cutané et la racine latérale du nerf médian.',
      },
      {
        id: 'pb-faisceau-post',
        number: 6,
        label: 'Faisceau postérieur',
        shortLabel: 'Faisceau post.',
        x: 525,
        y: 256,
        lx: 525,
        ly: 312,
        align: 'middle',
        category: 'Faisceaux',
        description:
          'Réunion des 3 divisions postérieures des troncs supérieur, moyen et inférieur derrière l’artère axillaire.',
        clinicalPearl:
          'Se termine uniquement en nerf axillaire (C5–C6) et nerf radial (C5–T1).',
      },
      {
        id: 'pb-faisceau-med',
        number: 7,
        label: 'Faisceau médial',
        shortLabel: 'Faisceau médial',
        x: 525,
        y: 378,
        lx: 525,
        ly: 462,
        align: 'middle',
        category: 'Faisceaux',
        description:
          'Prolonge la division antérieure du tronc inférieur en dedans de l’artère axillaire.',
        clinicalPearl:
          'Donne la racine médiale du nerf médian, le nerf ulnaire et les nerfs cutanés médiaux.',
      },
      {
        id: 'pb-musculo',
        number: 8,
        label: 'Nerf musculo-cutané (C5–C7)',
        shortLabel: 'N. musculo-cutané',
        x: 742,
        y: 108,
        lx: 934,
        ly: 92,
        align: 'end',
        category: 'Branche terminale',
        description:
          'Perfore le muscle coraco-brachial et innerve les fléchisseurs du coude (biceps brachial, brachial).',
        clinicalPearl:
          'Sa lésion abolit le réflexe bicipital et entraîne une hypoesthésie du bord latéral de l’avant-bras.',
      },
      {
        id: 'pb-axillaire',
        number: 9,
        label: 'Nerf axillaire (C5–C6)',
        shortLabel: 'N. axillaire',
        x: 710,
        y: 196,
        lx: 934,
        ly: 184,
        align: 'end',
        category: 'Branche terminale',
        description:
          'Traverse l’espace axillaire latéral (quadrilatère de Velpeau) et contourne le col chirurgical de l’humérus.',
        clinicalPearl:
          'Menacé dans la luxation antéro-interne de l’épaule et la fracture du col chirurgical (anesthésie du moignon de l’épaule).',
      },
      {
        id: 'pb-radial',
        number: 10,
        label: 'Nerf radial (C5–T1)',
        shortLabel: 'N. radial',
        x: 742,
        y: 264,
        lx: 934,
        ly: 274,
        align: 'end',
        category: 'Branche terminale',
        description:
          'Chemine dans le sillon du nerf radial à la face postérieure de la diaphyse humérale.',
        clinicalPearl:
          'Lésé dans la fracture du 1/3 moyen de l’humérus : main tombante en col de cygne et déficit d’extension des doigts.',
      },
      {
        id: 'pb-median',
        number: 11,
        label: 'Nerf médian (C6–T1)',
        shortLabel: 'N. médian',
        x: 742,
        y: 344,
        lx: 934,
        ly: 364,
        align: 'end',
        category: 'Branche terminale',
        description:
          'Né de la fourche du médian en avant de l’artère axillaire ; traverse le canal carpien au poignet.',
        clinicalPearl:
          'Syndrome du canal carpien : paresthésies des 3 premiers doigts et de la moitié radiale du 4e ; signe de Tinel et Phalen.',
      },
      {
        id: 'pb-ulnaire',
        number: 12,
        label: 'Nerf ulnaire (C8–T1)',
        shortLabel: 'N. ulnaire',
        x: 742,
        y: 422,
        lx: 934,
        ly: 454,
        align: 'end',
        category: 'Branche terminale',
        description:
          'Passe dans le sillon du nerf ulnaire (gouttière épitrochléo-olécranienne) puis le canal de Guyon.',
        clinicalPearl:
          'Signe de Froment positif (déficit de l’adducteur du pouce) et griffe cubitale des 4e et 5e doigts.',
      },
    ],
  },
  {
    id: 'willis',
    title: 'Polygone de Willis & Vascularisation cérébrale',
    shortTitle: 'Polygone de Willis',
    specialty: 'Neurologie / Anatomie',
    yearTag: '2e & 5e Années · Résidanat',
    subtitle:
      'Anastomose artérielle de la base du crâne unissant les systèmes carotidien interne et vertébro-basilaire.',
    reference: 'Kamina — Neuroanatomie · Référentiel CEN Neurologie',
    hotspots: [
      {
        id: 'pw-acoa',
        number: 1,
        label: 'Artère communicante antérieure (ACoA)',
        shortLabel: 'A. communicante ant.',
        x: 480,
        y: 132,
        lx: 480,
        ly: 54,
        align: 'middle',
        category: 'Anastomose antérieure',
        description:
          'Court pont artériel reliant les deux artères cérébrales antérieures en avant du chiasma optique.',
        clinicalPearl:
          'Localisation la plus fréquente des anévrismes sacculaires intracrâniens responsables d’hémorragie méningée.',
      },
      {
        id: 'pw-aca',
        number: 2,
        label: 'Artère cérébrale antérieure (ACA)',
        shortLabel: 'A. cérébrale ant.',
        x: 425,
        y: 162,
        lx: 160,
        ly: 96,
        align: 'end',
        category: 'Système carotidien',
        description:
          'Vascularise la face médiale des lobes frontaux et pariétaux (lobule paracentral — membre inférieur).',
        clinicalPearl:
          'Un infarctus de l’ACA provoque une hémiparésie controlatérale à prédominance crurale et un syndrome frontal.',
      },
      {
        id: 'pw-acm',
        number: 3,
        label: 'Artère cérébrale moyenne / Sylvienne (ACM)',
        shortLabel: 'A. cérébrale moyenne',
        x: 300,
        y: 238,
        lx: 145,
        ly: 215,
        align: 'end',
        category: 'Système carotidien',
        description:
          'Branche terminale principale de la carotide interne, irriguant la convexité latérale et les noyaux gris.',
        clinicalPearl:
          'Territoire le plus touché dans les AVC ischémiques : hémiplégie brachio-faciale controlatérale, aphasie si hémisphère dominant.',
      },
      {
        id: 'pw-aci',
        number: 4,
        label: 'Artère carotide interne (ACI)',
        shortLabel: 'Carotide interne',
        x: 374,
        y: 256,
        lx: 155,
        ly: 315,
        align: 'end',
        category: 'Axe carotidien',
        description:
          'Pénètre dans le crâne par le canal carotidien, donne l’artère ophtalmique puis se divise en ACA et ACM.',
        clinicalPearl:
          'Une occlusion de l’ACI peut associer une cécité monoculaire transitoire (amaurose fugace) à un déficit hémisphérique.',
      },
      {
        id: 'pw-chiasma',
        number: 5,
        label: 'Chiasma optique (Repère central)',
        shortLabel: 'Chiasma optique',
        x: 480,
        y: 254,
        lx: 790,
        ly: 120,
        align: 'start',
        category: 'Repère anatomique',
        description:
          'Situé au centre du polygone artériel, au-dessus de la selle turcique et de la glande hypophyse.',
        clinicalPearl:
          'Sa compression par un adénome hypophysaire provoque une hémianopsie bitemporale.',
      },
      {
        id: 'pw-acop',
        number: 6,
        label: 'Artère communicante postérieure (ACoP)',
        shortLabel: 'A. communicante post.',
        x: 572,
        y: 294,
        lx: 805,
        ly: 230,
        align: 'start',
        category: 'Anastomose latérale',
        description:
          'Relie la carotide interne à l’artère cérébrale postérieure, longeant le nerf oculomoteur commun (III).',
        clinicalPearl:
          'Un anévrisme de l’ACoP se révèle classiquement par une paralysie douloureuse du nerf III avec mydriase.',
      },
      {
        id: 'pw-acp',
        number: 7,
        label: 'Artère cérébrale postérieure (ACP)',
        shortLabel: 'A. cérébrale post.',
        x: 615,
        y: 356,
        lx: 805,
        ly: 332,
        align: 'start',
        category: 'Système vertébro-basilaire',
        description:
          'Naît de la bifurcation du tronc basilaire et irrigue le lobe occipital et la face inférieure du lobe temporal.',
        clinicalPearl:
          'L’infarctus de l’ACP entraîne une hémianopsie latérale homonyme (HLH) controlatérale avec épargne maculaire.',
      },
      {
        id: 'pw-basilaire',
        number: 8,
        label: 'Tronc basilaire (Artère basilaire)',
        shortLabel: 'Tronc basilaire',
        x: 480,
        y: 416,
        lx: 795,
        ly: 422,
        align: 'start',
        category: 'Système vertébro-basilaire',
        description:
          'Formé par la réunion des deux artères vertébrales ; chemine sur la face antérieure du pont.',
        clinicalPearl:
          'Son occlusion aiguë est une urgence vitale majeure pouvant causer un locked-in syndrome ou un coma.',
      },
      {
        id: 'pw-pica',
        number: 9,
        label: 'Artère cérébelleuse postéro-inférieure (PICA)',
        shortLabel: 'PICA',
        x: 374,
        y: 492,
        lx: 165,
        ly: 486,
        align: 'end',
        category: 'Système vertébro-basilaire',
        description:
          'Branche de l’artère vertébrale vascularisant la partie latérale du bulbe et le cervelet inférieur.',
        clinicalPearl:
          'Son occlusion provoque le syndrome de Wallenberg (syndrome alterne sensitif + dysphagie + CBH homolatéral).',
      },
      {
        id: 'pw-vertebrale',
        number: 10,
        label: 'Artères vertébrales (D & G)',
        shortLabel: 'A. vertébrales',
        x: 525,
        y: 526,
        lx: 790,
        ly: 522,
        align: 'start',
        category: 'Axe vertébro-basilaire',
        description:
          'Branches des artères subclavières qui montent dans les foramens transversaires de C6 à C1.',
        clinicalPearl:
          'Une dissection vertébrale après traumatisme cervical peut déclencher un AVC du tronc cérébral chez le sujet jeune.',
      },
    ],
  },
  {
    id: 'cardiac',
    title: 'Anatomie cardiaque, Gros Vaisseaux & Coronaires',
    shortTitle: 'Cœur & Coronaires',
    specialty: 'Cardiologie / Anatomie',
    yearTag: '2e, 4e & 7e Années',
    subtitle:
      'Cavités cardiaques, appareils valvulaires, crosse aortique et vascularisation coronaire épicardique.',
    reference: 'Netter / ESC — Anatomie cardiaque et syndromes coronariens',
    hotspots: [
      {
        id: 'cd-vcs',
        number: 1,
        label: 'Veine cave supérieure (VCS)',
        shortLabel: 'Veine cave sup.',
        x: 344,
        y: 122,
        lx: 135,
        ly: 96,
        align: 'end',
        category: 'Retour veineux',
        description:
          'Draine le sang veineux de la tête, du cou et des membres supérieurs vers la partie supérieure de l’oreillette droite.',
        clinicalPearl:
          'La compression tumorale (cancer bronchique) donne un syndrome cave supérieur avec œdème en pèlerine.',
      },
      {
        id: 'cd-aorte',
        number: 2,
        label: 'Crosse de l’aorte',
        shortLabel: 'Crosse aortique',
        x: 472,
        y: 112,
        lx: 765,
        ly: 84,
        align: 'start',
        category: 'Gros vaisseaux',
        description:
          'Fait suite à l’aorte ascendante et donne le TABC, la carotide commune gauche et la subclavière gauche.',
        clinicalPearl:
          'L’isthme aortique (en aval de la subclavière gauche) est le siège électif des ruptures traumatiques.',
      },
      {
        id: 'cd-tp',
        number: 3,
        label: 'Tronc artériel pulmonaire',
        shortLabel: 'Tronc pulmonaire',
        x: 506,
        y: 196,
        lx: 790,
        ly: 162,
        align: 'start',
        category: 'Gros vaisseaux',
        description:
          'Émerge du ventricule droit et se bifurque sous la crosse aortique en artères pulmonaires droite et gauche.',
        clinicalPearl:
          'Siège des embolies pulmonaires massives bilatérales responsables d’un cœur pulmonaire aigu.',
      },
      {
        id: 'cd-od',
        number: 4,
        label: 'Oreillette droite (OD)',
        shortLabel: 'Oreillette droite',
        x: 332,
        y: 266,
        lx: 130,
        ly: 235,
        align: 'end',
        category: 'Cavités droites',
        description:
          'Reçoit les veines caves et le sinus coronaire. Contient le nœud sinusal de Keith et Flack.',
        clinicalPearl:
          'L’hypertrophie auriculaire droite se traduit sur l’ECG par des ondes P amples (> 2,5 mm) en DII.',
      },
      {
        id: 'cd-og',
        number: 5,
        label: 'Oreillette gauche (OG)',
        shortLabel: 'Oreillette gauche',
        x: 576,
        y: 244,
        lx: 800,
        ly: 238,
        align: 'start',
        category: 'Cavités gauches',
        description:
          'Cavité postérieure recevant les 4 veines pulmonaires oxygénées.',
        clinicalPearl:
          'Sa dilatation dans le rétrécissement mitral favorise la fibrillation auriculaire et les thrombus de l’auricule gauche.',
      },
      {
        id: 'cd-mitrale',
        number: 6,
        label: 'Valve mitrale (bicuspide)',
        shortLabel: 'Valve mitrale',
        x: 534,
        y: 306,
        lx: 800,
        ly: 314,
        align: 'start',
        category: 'Appareil valvulaire',
        description:
          'Sépare l’oreillette gauche du ventricule gauche ; possède 2 feuillets (antérieur et postérieur) et des cordages.',
        clinicalPearl:
          'Le rétrécissement mitral post-rhumatismal reste fréquent en pratique clinique algérienne (roulement diastolique).',
      },
      {
        id: 'cd-vd',
        number: 7,
        label: 'Ventricule droit (VD)',
        shortLabel: 'Ventricule droit',
        x: 416,
        y: 392,
        lx: 135,
        ly: 446,
        align: 'end',
        category: 'Cavités droites',
        description:
          'Cavité antérieure à paroi mince (~3–4 mm) propulsant le sang vers la circulation pulmonaire à basse pression.',
        clinicalPearl:
          'L’infarctus du VD (dérivations V3R–V4R) contre-indique les dérivés nitrés qui aggravent la précharge.',
      },
      {
        id: 'cd-vg',
        number: 8,
        label: 'Ventricule gauche (VG) & Apex',
        shortLabel: 'Ventricule gauche',
        x: 574,
        y: 422,
        lx: 800,
        ly: 468,
        align: 'start',
        category: 'Cavités gauches',
        description:
          'Paroi musculaire épaisse (10–12 mm) assurant l’éjection systémique via la valve aortique.',
        clinicalPearl:
          'Le choc de pointe est normalement palpé au 5e espace intercostal gauche sur la ligne médio-claviculaire.',
      },
      {
        id: 'cd-cd',
        number: 9,
        label: 'Artère coronaire droite (CD)',
        shortLabel: 'Coronaire droite',
        x: 368,
        y: 332,
        lx: 130,
        ly: 342,
        align: 'end',
        category: 'Vascularisation coronaire',
        description:
          'Chemine dans le sillon atrio-ventriculaire droit ; irrigue le VD, la paroi inférieure du VG et le nœud AV (85 %).',
        clinicalPearl:
          'Son occlusion cause un SCA ST+ inférieur (DII, DIII, aVF) souvent compliqué de BAV.',
      },
      {
        id: 'cd-iva',
        number: 10,
        label: 'Artère interventriculaire antérieure (IVA)',
        shortLabel: 'Artère IVA',
        x: 492,
        y: 362,
        lx: 790,
        ly: 392,
        align: 'start',
        category: 'Vascularisation coronaire',
        description:
          'Branche du tronc commun gauche descendant dans le sillon interventriculaire antérieur jusqu’à l’apex.',
        clinicalPearl:
          'Vascularise la paroi antérieure et les 2/3 antérieurs du septum : SCA ST+ antérieur (V1 à V4).',
      },
    ],
  },
  {
    id: 'nephron',
    title: 'Néphron, Appareil Juxtaglomérulaire & Diurétiques',
    shortTitle: 'Néphron & Glomérule',
    specialty: 'Néphrologie / Physiologie',
    yearTag: '2e & 4e Années · Résidanat',
    subtitle:
      'Unité fonctionnelle rénale : barrière de filtration glomérulaire, segments tubulaires et cibles pharmacologiques.',
    reference: 'Collège Universitaire des Enseignants de Néphrologie (CUEN)',
    hotspots: [
      {
        id: 'np-aff',
        number: 1,
        label: 'Artériole afférente',
        shortLabel: 'Artériole afférente',
        x: 102,
        y: 162,
        lx: 48,
        ly: 84,
        align: 'start',
        category: 'Pôle vasculaire',
        description:
          'Apporte le sang au floculus glomérulaire ; son tonus est dilaté par les prostaglandines vasodilatatrices.',
        clinicalPearl:
          'Les AINS inhibent les prostaglandines, vasoconstrictent l’artériole afférente et abaissent le DFG.',
      },
      {
        id: 'np-eff',
        number: 2,
        label: 'Artériole efférente',
        shortLabel: 'Artériole efférente',
        x: 112,
        y: 274,
        lx: 48,
        ly: 374,
        align: 'start',
        category: 'Pôle vasculaire',
        description:
          'Draine le sang hors du glomérule ; maintient la pression hydrostatique de filtration sous l’effet de l’angiotensine II.',
        clinicalPearl:
          'Les IEC et ARA2 dilatent l’artériole efférente et diminuent l’hyperpression intraglomérulaire (néphroprotection).',
      },
      {
        id: 'np-glom',
        number: 3,
        label: 'Floculus & Capsule de Bowman',
        shortLabel: 'Glomérule / Bowman',
        x: 176,
        y: 218,
        lx: 230,
        ly: 84,
        align: 'middle',
        category: 'Corpuscule rénal',
        description:
          'Barrière à 3 couches (endothélium fenestré, membrane basale glomérulaire, podocytes) filtrant ~120 mL/min.',
        clinicalPearl:
          'L’altération des podocytes ou de la MBG entraîne une protéinurie glomérulaire (> 3 g/24 h = syndrome néphrotique).',
      },
      {
        id: 'np-tcp',
        number: 4,
        label: 'Tube contourné proximal (TCP)',
        shortLabel: 'TCP (65 % Na+)',
        x: 342,
        y: 172,
        lx: 365,
        ly: 84,
        align: 'middle',
        category: 'Tubule proximal',
        description:
          'Réabsorbe 65 % du Na+ et de l’eau, 100 % du glucose et acides aminés (SGLT2), et 85 % des bicarbonates.',
        clinicalPearl:
          'Une dysfonction du TCP réalise un syndrome de Fanconi (glycosurie normoglycémique, aminoacidurie, acidose tubulaire type 2).',
      },
      {
        id: 'np-desc',
        number: 5,
        label: 'Branche descendante de l’anse de Henlé',
        shortLabel: 'Anse descendante',
        x: 392,
        y: 356,
        lx: 225,
        ly: 468,
        align: 'end',
        category: 'Anse de Henlé',
        description:
          'Segment mince très perméable à l’eau (aquaporines-1) et pratiquement imperméable au NaCl.',
        clinicalPearl:
          'Concentrant l’urine par sortie passive d’eau vers la médullaire hyperosmolaire.',
      },
      {
        id: 'np-asc',
        number: 6,
        label: 'Branche ascendante large de Henlé',
        shortLabel: 'Anse ascendante (NKCC2)',
        x: 500,
        y: 356,
        lx: 500,
        ly: 495,
        align: 'middle',
        category: 'Anse de Henlé',
        description:
          'Imperméable à l’eau ; réabsorbe activement 25 % du NaCl via le cotransporteur apical Na+-K+-2Cl- (NKCC2).',
        clinicalPearl:
          'Cible des diurétiques de l’anse (Furosémide) — créent le gradient corticopapillaire nécessaire à la concentration.',
      },
      {
        id: 'np-macula',
        number: 7,
        label: 'Macula densa (Appareil juxtaglomérulaire)',
        shortLabel: 'Macula densa',
        x: 500,
        y: 220,
        lx: 510,
        ly: 90,
        align: 'middle',
        category: 'Régulation JG',
        description:
          'Cellules spécialisées détectant la concentration luminale en NaCl pour moduler la sécrétion de rénine.',
        clinicalPearl:
          'Une baisse d’apport en NaCl à la macula densa active le système rénine-angiotensine-aldostérone.',
      },
      {
        id: 'np-tcd',
        number: 8,
        label: 'Tube contourné distal (TCD)',
        shortLabel: 'TCD (NCC)',
        x: 616,
        y: 162,
        lx: 655,
        ly: 84,
        align: 'start',
        category: 'Tubule distal',
        description:
          'Réabsorbe 5 à 8 % du NaCl via le cotransporteur Na+-Cl- (NCC) et réabsorbe activement le calcium (PTH).',
        clinicalPearl:
          'Cible des diurétiques thiazidiques (Hydrochlorothiazide) qui favorisent la réabsorption du Ca2+ (hypocalciurie).',
      },
      {
        id: 'np-collecteur',
        number: 9,
        label: 'Tube collecteur cortical & médullaire',
        shortLabel: 'Tube collecteur',
        x: 752,
        y: 318,
        lx: 915,
        ly: 274,
        align: 'end',
        category: 'Ajustement final',
        description:
          'Cellules principales (ENaC sous contrôle de l’aldostérone ; AQP2 sous contrôle de l’ADH) et cellules intercalaires (H+).',
        clinicalPearl:
          'Cible de la spironolactone/amiloride (épargneurs de K+) et du diabète insipide néphrogénique.',
      },
    ],
  },
  {
    id: 'respiratory',
    title: 'Arbre Trachéo-Bronchique, Poumons & Plèvre',
    shortTitle: 'Arbre bronchique',
    specialty: 'Pneumologie / Anatomie',
    yearTag: '2e, 4e & 7e Années',
    subtitle:
      'Voies aériennes de conduction, asymétrie des bronches souches, scissures lobaires et espaces pleuraux.',
    reference: 'Kamina — Anatomie du thorax · Référentiel CEP Pneumologie',
    hotspots: [
      {
        id: 'rs-larynx',
        number: 1,
        label: 'Larynx & Cartilage thyroïde',
        shortLabel: 'Larynx (C4–C6)',
        x: 480,
        y: 84,
        lx: 230,
        ly: 68,
        align: 'end',
        category: 'Voies aériennes supérieures',
        description:
          'Carrefour aéro-digestif situé en regard de C4–C6, contenant les cordes vocales et le cartilage cricoïde.',
        clinicalPearl:
          'Un œdème sous-glottique (laryngite aiguë de l’enfant) donne une dyspnée inspiratoire avec tirage et stridor.',
      },
      {
        id: 'rs-trachee',
        number: 2,
        label: 'Trachée (C6–T5)',
        shortLabel: 'Trachée',
        x: 480,
        y: 162,
        lx: 730,
        ly: 98,
        align: 'start',
        category: 'Conduction centrale',
        description:
          'Conduit fibro-cartilagineux long de 11–12 cm formé de 16 à 20 anneaux en C ouverts en arrière sur le muscle trachéal.',
        clinicalPearl:
          'La sonde d’intubation doit se situer à 3–5 cm au-dessus de la carène pour éviter une intubation sélective.',
      },
      {
        id: 'rs-carene',
        number: 3,
        label: 'Carène trachéale (T4–T5)',
        shortLabel: 'Carène (T4–T5)',
        x: 480,
        y: 234,
        lx: 745,
        ly: 176,
        align: 'start',
        category: 'Bifurcation',
        description:
          'Éperon cartilagineux marquant la division de la trachée en deux bronches souches en regard de l’angle sternal de Louis.',
        clinicalPearl:
          'Un élargissement de l’angle carinaire (> 90°) à l’endoscopie ou sur scanner évoque une adénopathie sous-carinaire.',
      },
      {
        id: 'rs-bsd',
        number: 4,
        label: 'Bronche souche droite',
        shortLabel: 'Bronche souche D',
        x: 422,
        y: 266,
        lx: 205,
        ly: 168,
        align: 'end',
        category: 'Arbre bronchique',
        description:
          'Plus courte (~2,5 cm), plus large et plus verticale (dans le prolongement de la trachée) que la gauche.',
        clinicalPearl:
          'Site le plus fréquent d’inhalation de corps étranger et d’intubation sélective accidentelle.',
      },
      {
        id: 'rs-bsg',
        number: 5,
        label: 'Bronche souche gauche',
        shortLabel: 'Bronche souche G',
        x: 544,
        y: 274,
        lx: 785,
        ly: 256,
        align: 'start',
        category: 'Arbre bronchique',
        description:
          'Plus longue (~5 cm), plus étroite et plus horizontale ; passe sous la crosse aortique avant de pénétrer le hile gauche.',
        clinicalPearl:
          'En rapport direct avec l’oreillette gauche et le nerf récurrent gauche.',
      },
      {
        id: 'rs-lsd',
        number: 6,
        label: 'Lobe supérieur droit (LSD)',
        shortLabel: 'Lobe sup. droit',
        x: 312,
        y: 232,
        lx: 145,
        ly: 248,
        align: 'end',
        category: 'Segmentation pulmonaire',
        description:
          'Comprend les segments apical, dorsal et ventral ; limité en bas par la petite scissure horizontale.',
        clinicalPearl:
          'Site électif de réactivation de la tuberculose pulmonaire post-primaire (segments apicaux et dorsaux bien ventilés).',
      },
      {
        id: 'rs-lmd',
        number: 7,
        label: 'Lobe moyen droit (LMD)',
        shortLabel: 'Lobe moyen droit',
        x: 294,
        y: 356,
        lx: 145,
        ly: 364,
        align: 'end',
        category: 'Segmentation pulmonaire',
        description:
          'Propre au poumon droit (3 lobes à droite vs 2 à gauche), compris entre la petite et la grande scissure.',
        clinicalPearl:
          'À la radiographie de face, un comblement du lobe moyen efface le bord droit du cœur (signe de la silhouette).',
      },
      {
        id: 'rs-lig',
        number: 8,
        label: 'Lobe inférieur gauche (LIG)',
        shortLabel: 'Lobe inf. gauche',
        x: 682,
        y: 410,
        lx: 810,
        ly: 404,
        align: 'start',
        category: 'Segmentation pulmonaire',
        description:
          'Séparé du lobe supérieur gauche (et de la lingula) par la grande scissure oblique.',
        clinicalPearl:
          'Les pneumopathies basales gauches effacent la coupole diaphragmatique gauche mais respectent le bord du cœur.',
      },
      {
        id: 'rs-plevre',
        number: 9,
        label: 'Feuillets & Cavité pleurale',
        shortLabel: 'Cavité pleurale',
        x: 214,
        y: 318,
        lx: 135,
        ly: 462,
        align: 'end',
        category: 'Enveloppe séreuse',
        description:
          'Espace virtuel entre plèvre viscérale et plèvre pariétale maintenu à pression négative (-5 cmH2O).',
        clinicalPearl:
          'Une brèche pleurale entraîne un pneumothorax ; une ponction pleurale se fait au bord supérieur de la côte inférieure.',
      },
      {
        id: 'rs-diaph',
        number: 10,
        label: 'Coupole diaphragmatique',
        shortLabel: 'Diaphragme',
        x: 642,
        y: 492,
        lx: 800,
        ly: 504,
        align: 'start',
        category: 'Musculature ventilatoire',
        description:
          'Muscle inspiratoire principal en dôme, innervé par les nerfs phréniques (C3–C4–C5).',
        clinicalPearl:
          'La coupole droite est normalement 1 à 2 cm plus haute que la gauche en raison du foie sous-jacent.',
      },
    ],
  },
];

export function resolveBoardIdForLesson(
  lessonId?: string,
  diagramType?: MedicalLesson['diagramType']
): AnatomyBoardId {
  if (lessonId === 'L1-ANAT-01') return 'plexus_brachial';
  if (lessonId === 'L2-ANAT-02' || lessonId === 'L5-NEUR-01' || lessonId === 'L7-RES-02') {
    return 'willis';
  }
  switch (diagramType) {
    case 'anatomy':
      return 'plexus_brachial';
    case 'neuro':
      return 'willis';
    case 'cardiac':
      return 'cardiac';
    case 'nephron':
      return 'nephron';
    case 'respiratory':
      return 'respiratory';
    default:
      return 'plexus_brachial';
  }
}

interface AnatomyDiagramViewerProps {
  initialBoardId?: AnatomyBoardId;
  showBoardSelector?: boolean;
  compact?: boolean;
}

type ViewerMode = 'study' | 'masked' | 'quiz';

const BoardIllustration: React.FC<{ boardId: AnatomyBoardId }> = ({ boardId }) => {
  if (boardId === 'plexus_brachial') {
    return (
      <g>
        {/* Scalene & Clavicle anatomical landmarks */}
        <rect
          x="85"
          y="78"
          width="74"
          height="356"
          rx="18"
          className="fill-blue-50/70 dark:fill-blue-950/30 stroke-blue-200 dark:stroke-blue-900"
          strokeDasharray="6 4"
          strokeWidth="1.5"
        />
        <text
          x="122"
          y="456"
          textAnchor="middle"
          className="fill-slate-500 dark:fill-slate-400 text-[11px] font-medium"
        >
          Défilé interscalénique
        </text>
        <line
          x1="360"
          y1="66"
          x2="360"
          y2="460"
          className="stroke-slate-300 dark:stroke-slate-700"
          strokeWidth="2"
          strokeDasharray="8 6"
        />
        <text
          x="360"
          y="482"
          textAnchor="middle"
          className="fill-slate-500 dark:fill-slate-400 text-[11px] font-medium"
        >
          Clavicule (Divisions)
        </text>

        {/* Axillary artery backdrop */}
        <path
          d="M 410 264 L 665 264"
          className="stroke-rose-400/50 dark:stroke-rose-500/40"
          strokeWidth="18"
          strokeLinecap="round"
        />
        <text
          x="530"
          y="268"
          textAnchor="middle"
          className="fill-rose-800 dark:fill-rose-200 text-[10px] font-semibold"
        >
          Artère axillaire
        </text>

        {/* Roots C5-T1 */}
        <path d="M 96 116 L 175 116 L 235 154" fill="none" stroke="#0B63CE" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 96 184 L 175 184 L 235 162" fill="none" stroke="#0B63CE" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 96 256 L 285 256" fill="none" stroke="#0D9488" strokeWidth="7" strokeLinecap="round" />
        <path d="M 96 334 L 175 334 L 235 374" fill="none" stroke="#0284C7" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 96 410 L 175 410 L 235 382" fill="none" stroke="#0284C7" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />

        <text x="84" y="120" textAnchor="end" className="fill-slate-700 dark:fill-slate-300 text-[12px] font-bold">C5</text>
        <text x="84" y="188" textAnchor="end" className="fill-slate-700 dark:fill-slate-300 text-[12px] font-bold">C6</text>
        <text x="84" y="260" textAnchor="end" className="fill-slate-700 dark:fill-slate-300 text-[12px] font-bold">C7</text>
        <text x="84" y="338" textAnchor="end" className="fill-slate-700 dark:fill-slate-300 text-[12px] font-bold">C8</text>
        <text x="84" y="414" textAnchor="end" className="fill-slate-700 dark:fill-slate-300 text-[12px] font-bold">T1</text>

        {/* Trunks */}
        <path d="M 235 158 L 320 158" fill="none" stroke="#0B63CE" strokeWidth="10" strokeLinecap="round" />
        <path d="M 280 256 L 320 256" fill="none" stroke="#0D9488" strokeWidth="10" strokeLinecap="round" />
        <path d="M 235 378 L 320 378" fill="none" stroke="#0284C7" strokeWidth="10" strokeLinecap="round" />

        {/* Anterior & Posterior Divisions */}
        <path d="M 320 158 C 380 158 410 146 475 146" fill="none" stroke="#0B63CE" strokeWidth="6" />
        <path d="M 320 256 C 380 256 410 152 475 152" fill="none" stroke="#0D9488" strokeWidth="5.5" />
        <path d="M 320 158 C 385 182 415 248 475 248" fill="none" stroke="#F59E0B" strokeWidth="5" strokeDasharray="7 4" />
        <path d="M 320 256 L 475 256" fill="none" stroke="#F59E0B" strokeWidth="5.5" strokeDasharray="7 4" />
        <path d="M 320 378 C 385 352 415 264 475 264" fill="none" stroke="#F59E0B" strokeWidth="5" strokeDasharray="7 4" />
        <path d="M 320 378 L 475 378" fill="none" stroke="#0284C7" strokeWidth="6.5" />

        {/* Cords (Faisceaux) */}
        <path d="M 475 148 L 585 148" fill="none" stroke="#0B63CE" strokeWidth="11" strokeLinecap="round" />
        <path d="M 475 256 L 585 256" fill="none" stroke="#D97706" strokeWidth="11" strokeLinecap="round" />
        <path d="M 475 378 L 585 378" fill="none" stroke="#0284C7" strokeWidth="11" strokeLinecap="round" />

        {/* Terminal Branches */}
        <path d="M 585 144 C 655 120 700 108 770 108" fill="none" stroke="#0B63CE" strokeWidth="6.5" strokeLinecap="round" />
        <path d="M 585 250 C 645 215 690 196 765 196" fill="none" stroke="#D97706" strokeWidth="6" strokeLinecap="round" />
        <path d="M 585 260 C 660 264 705 264 770 264" fill="none" stroke="#B45309" strokeWidth="7.5" strokeLinecap="round" />

        {/* Median nerve M-fork */}
        <path d="M 585 152 C 630 196 655 325 695 344" fill="none" stroke="#0D9488" strokeWidth="6" strokeLinecap="round" />
        <path d="M 585 372 C 630 356 655 344 695 344 L 770 344" fill="none" stroke="#0D9488" strokeWidth="7" strokeLinecap="round" />

        {/* Ulnar nerve */}
        <path d="M 585 384 C 650 412 700 422 770 422" fill="none" stroke="#0284C7" strokeWidth="6.5" strokeLinecap="round" />
      </g>
    );
  }

  if (boardId === 'willis') {
    return (
      <g>
        {/* Subtle brain base silhouette */}
        <ellipse
          cx="480"
          cy="280"
          rx="255"
          ry="215"
          className="fill-slate-100/80 dark:fill-slate-900/70 stroke-slate-300 dark:stroke-slate-700"
          strokeWidth="1.5"
        />
        <path
          d="M 480 78 C 405 78 335 110 295 162 C 260 210 250 280 280 345 C 315 415 390 458 480 458 C 570 458 645 415 680 345 C 710 280 700 210 665 162 C 625 110 555 78 480 78 Z"
          className="fill-rose-50/40 dark:fill-rose-950/15 stroke-slate-300/80 dark:stroke-slate-700/80"
          strokeWidth="1"
          strokeDasharray="5 5"
        />

        {/* Optic Chiasm */}
        <path
          d="M 432 222 Q 480 256 528 222 M 432 288 Q 480 254 528 288"
          fill="none"
          stroke="#F59E0B"
          strokeWidth="10"
          strokeLinecap="round"
          opacity="0.7"
        />
        <ellipse cx="480" cy="254" rx="22" ry="12" className="fill-amber-200 dark:fill-amber-700 stroke-amber-600" strokeWidth="1.5" />

        {/* Anterior Cerebral Arteries & ACoA */}
        <path d="M 380 250 C 405 200 422 155 446 132 L 452 72" fill="none" stroke="#DC2626" strokeWidth="7" strokeLinecap="round" />
        <path d="M 580 250 C 555 200 538 155 514 132 L 508 72" fill="none" stroke="#DC2626" strokeWidth="7" strokeLinecap="round" />
        <path d="M 446 132 L 514 132" fill="none" stroke="#EF4444" strokeWidth="6.5" strokeLinecap="round" />

        {/* Middle Cerebral Arteries */}
        <path d="M 380 252 C 330 245 275 232 215 198" fill="none" stroke="#DC2626" strokeWidth="8.5" strokeLinecap="round" />
        <path d="M 580 252 C 630 245 685 232 745 198" fill="none" stroke="#DC2626" strokeWidth="8.5" strokeLinecap="round" />

        {/* Internal Carotids */}
        <circle cx="380" cy="254" r="14" fill="#B91C1C" stroke="#FECACA" strokeWidth="2.5" />
        <circle cx="580" cy="254" r="14" fill="#B91C1C" stroke="#FECACA" strokeWidth="2.5" />

        {/* Posterior Communicating Arteries */}
        <path d="M 384 266 C 398 308 422 336 452 346" fill="none" stroke="#EF4444" strokeWidth="5.5" strokeLinecap="round" />
        <path d="M 576 266 C 562 308 538 336 508 346" fill="none" stroke="#EF4444" strokeWidth="5.5" strokeLinecap="round" />

        {/* Posterior Cerebral Arteries */}
        <path d="M 480 356 C 430 344 360 356 285 398" fill="none" stroke="#DC2626" strokeWidth="7.5" strokeLinecap="round" />
        <path d="M 480 356 C 530 344 600 356 675 398" fill="none" stroke="#DC2626" strokeWidth="7.5" strokeLinecap="round" />

        {/* Basilar Artery + Pontine branches */}
        <path d="M 480 356 L 480 472" fill="none" stroke="#B91C1C" strokeWidth="11" strokeLinecap="round" />
        {[382, 405, 428, 450].map((py) => (
          <g key={py}>
            <line x1="480" y1={py} x2="438" y2={py + 4} stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="480" y1={py} x2="522" y2={py + 4} stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        ))}

        {/* Vertebral Arteries & PICA */}
        <path d="M 418 556 C 432 518 455 492 480 472" fill="none" stroke="#B91C1C" strokeWidth="7.5" strokeLinecap="round" />
        <path d="M 542 556 C 528 518 505 492 480 472" fill="none" stroke="#B91C1C" strokeWidth="7.5" strokeLinecap="round" />
        <path d="M 432 518 C 390 505 362 490 330 468" fill="none" stroke="#F87171" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M 528 518 C 570 505 598 490 630 468" fill="none" stroke="#F87171" strokeWidth="4.5" strokeLinecap="round" />
      </g>
    );
  }

  if (boardId === 'cardiac') {
    return (
      <g>
        {/* SVC & IVC */}
        <path d="M 326 64 L 326 218 L 368 218 L 368 64" className="fill-blue-600/85 stroke-blue-800" strokeWidth="2" />
        <path d="M 332 340 L 332 456 L 368 456 L 368 340" className="fill-blue-600/80 stroke-blue-800" strokeWidth="2" />

        {/* Aortic Arch + 3 supra-aortic trunks */}
        <path d="M 430 62 L 430 105 M 472 56 L 472 95 M 514 62 L 514 106" stroke="#DC2626" strokeWidth="14" strokeLinecap="round" />
        <path
          d="M 454 252 C 446 185 415 135 450 106 C 492 78 552 108 552 162 L 552 462"
          fill="none"
          stroke="#DC2626"
          strokeWidth="36"
          strokeLinecap="round"
        />
        <path
          d="M 454 252 C 446 185 415 135 450 106 C 492 78 552 108 552 162 L 552 462"
          fill="none"
          stroke="#EF4444"
          strokeWidth="22"
          strokeLinecap="round"
          opacity="0.45"
        />

        {/* Pulmonary Trunk */}
        <path
          d="M 465 292 C 468 228 485 186 558 176 L 642 176"
          fill="none"
          stroke="#2563EB"
          strokeWidth="28"
          strokeLinecap="round"
        />
        <path d="M 485 192 L 385 178" fill="none" stroke="#2563EB" strokeWidth="20" strokeLinecap="round" />

        {/* Cardiac Muscle Mass & Chambers */}
        <path
          d="M 320 220 C 276 250 282 340 326 392 C 378 456 508 510 598 482 C 668 460 666 322 612 246 C 566 196 382 182 320 220 Z"
          className="fill-rose-100 dark:fill-rose-950/60 stroke-rose-700 dark:stroke-rose-500"
          strokeWidth="3.5"
        />

        {/* Right Atrium */}
        <ellipse cx="348" cy="274" rx="46" ry="56" className="fill-blue-200/80 dark:fill-blue-900/60 stroke-blue-700" strokeWidth="2" />
        {/* Left Atrium */}
        <ellipse cx="570" cy="248" rx="46" ry="42" className="fill-rose-200/85 dark:fill-rose-900/60 stroke-rose-700" strokeWidth="2" />

        {/* Right Ventricle */}
        <path
          d="M 342 322 C 335 390 390 448 482 456 L 478 320 Z"
          className="fill-blue-300/75 dark:fill-blue-800/60 stroke-blue-700"
          strokeWidth="2"
        />
        {/* Left Ventricle */}
        <path
          d="M 498 312 L 502 464 C 578 476 630 434 616 346 C 606 302 558 290 498 312 Z"
          className="fill-rose-300/80 dark:fill-rose-800/60 stroke-rose-800"
          strokeWidth="2.5"
        />

        {/* Mitral Valve */}
        <path d="M 526 292 L 542 322 M 564 288 L 550 320" stroke="#F59E0B" strokeWidth="5" strokeLinecap="round" />

        {/* Coronary Arteries */}
        <path d="M 426 266 C 392 300 356 348 345 388" fill="none" stroke="#B91C1C" strokeWidth="5.5" strokeLinecap="round" />
        <path d="M 476 268 C 490 315 496 382 518 446" fill="none" stroke="#DC2626" strokeWidth="6" strokeLinecap="round" />
        <path d="M 484 298 C 538 308 584 328 618 358" fill="none" stroke="#EF4444" strokeWidth="4.5" strokeLinecap="round" />
      </g>
    );
  }

  if (boardId === 'nephron') {
    return (
      <g>
        {/* Cortex / Medulla boundary */}
        <rect x="30" y="65" width="900" height="205" rx="10" className="fill-amber-50/50 dark:fill-amber-950/15" />
        <rect x="30" y="270" width="900" height="260" rx="10" className="fill-sky-50/50 dark:fill-sky-950/20" />
        <line x1="36" y1="270" x2="924" y2="270" className="stroke-slate-300 dark:stroke-slate-700" strokeDasharray="8 6" strokeWidth="1.5" />
        <text x="54" y="258" className="fill-amber-700 dark:fill-amber-300 text-[11px] font-semibold">Cortex rénal (300 mOsm/L)</text>
        <text x="54" y="290" className="fill-sky-700 dark:fill-sky-300 text-[11px] font-semibold">Médullaire rénale (jusqu’à 1200 mOsm/L)</text>

        {/* Afferent & Efferent Arterioles */}
        <path d="M 55 152 C 92 152 118 175 142 195" fill="none" stroke="#DC2626" strokeWidth="13" strokeLinecap="round" />
        <path d="M 142 240 C 115 262 88 280 55 280" fill="none" stroke="#EF4444" strokeWidth="8.5" strokeLinecap="round" />

        {/* Bowman's Capsule */}
        <path
          d="M 155 158 C 102 158 102 278 155 278 C 198 278 214 252 222 228 L 254 228 L 254 208 L 222 208 C 214 182 198 158 155 158 Z"
          className="fill-teal-100/80 dark:fill-teal-900/50 stroke-teal-700 dark:stroke-teal-400"
          strokeWidth="3.5"
        />

        {/* Glomerular Capillary Tuft */}
        <path
          d="M 136 196 C 156 176 188 184 182 212 C 176 238 140 232 156 208 C 174 184 202 216 174 246 C 155 262 135 244 142 224"
          fill="none"
          stroke="#DC2626"
          strokeWidth="6.5"
          strokeLinecap="round"
        />

        {/* Proximal Convoluted Tubule (TCP) */}
        <path
          d="M 254 218 C 280 156 320 156 342 208 C 364 256 392 210 392 268"
          fill="none"
          stroke="#0D9488"
          strokeWidth="20"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Descending Thin Limb of Henle */}
        <path
          d="M 392 268 L 392 426 C 392 468 500 468 500 426"
          fill="none"
          stroke="#0EA5E9"
          strokeWidth="11"
          strokeLinecap="round"
        />

        {/* Thick Ascending Limb of Henle */}
        <path
          d="M 500 426 L 500 202"
          fill="none"
          stroke="#0B63CE"
          strokeWidth="19"
          strokeLinecap="round"
        />

        {/* Macula Densa cluster */}
        <rect x="486" y="206" width="28" height="28" rx="6" className="fill-amber-300 dark:fill-amber-600 stroke-amber-700" strokeWidth="2" />

        {/* Distal Convoluted Tubule (TCD) */}
        <path
          d="M 500 202 C 525 148 568 148 594 186 C 618 220 660 150 715 178 C 742 192 752 214 752 246"
          fill="none"
          stroke="#2563EB"
          strokeWidth="16"
          strokeLinecap="round"
        />

        {/* Collecting Duct */}
        <path d="M 752 150 L 752 486" fill="none" stroke="#1D4ED8" strokeWidth="24" strokeLinecap="round" />
        <path d="M 702 330 L 752 350 M 804 286 L 752 308 M 804 398 L 752 418" fill="none" stroke="#1D4ED8" strokeWidth="10" strokeLinecap="round" />
      </g>
    );
  }

  // respiratory
  return (
    <g>
      {/* Right Lung (3 lobes) */}
      <path
        d="M 418 175 C 330 155 232 225 208 332 C 188 420 205 492 272 496 C 345 500 398 468 422 438 C 435 375 436 250 418 175 Z"
        className="fill-rose-100/85 dark:fill-rose-950/50 stroke-rose-500"
        strokeWidth="3"
      />
      {/* Pleural outline around Right Lung */}
      <path
        d="M 424 166 C 325 144 222 216 196 332 C 175 426 196 502 272 506 C 350 510 406 476 430 444"
        fill="none"
        stroke="#0D9488"
        strokeWidth="2.5"
        strokeDasharray="6 4"
      />
      {/* Right fissures */}
      <path d="M 218 308 Q 315 304 418 312" fill="none" stroke="#BE123C" strokeWidth="2.2" strokeDasharray="5 3" />
      <path d="M 414 312 Q 338 396 286 494" fill="none" stroke="#BE123C" strokeWidth="2.2" strokeDasharray="5 3" />

      {/* Left Lung (2 lobes + cardiac notch) */}
      <path
        d="M 542 175 C 630 155 728 225 752 332 C 772 420 755 492 688 496 C 625 500 578 466 565 446 C 588 408 585 362 544 342 C 532 275 530 218 542 175 Z"
        className="fill-rose-100/85 dark:fill-rose-950/50 stroke-rose-500"
        strokeWidth="3"
      />
      {/* Left oblique fissure */}
      <path d="M 556 276 Q 652 342 732 456" fill="none" stroke="#BE123C" strokeWidth="2.2" strokeDasharray="5 3" />

      {/* Larynx */}
      <path
        d="M 454 62 L 506 62 L 500 108 L 460 108 Z"
        className="fill-sky-200 dark:fill-sky-900 stroke-blue-700"
        strokeWidth="2.5"
      />
      {/* Trachea + Cartilage rings */}
      <rect x="462" y="108" width="36" height="122" rx="4" className="fill-sky-100 dark:fill-sky-950 stroke-blue-700" strokeWidth="2.5" />
      {[122, 138, 154, 170, 186, 202, 218].map((ry) => (
        <line key={ry} x1="464" y1={ry} x2="496" y2={ry} stroke="#0B63CE" strokeWidth="3" strokeLinecap="round" />
      ))}

      {/* Carina & Main Bronchi */}
      <path d="M 480 230 L 408 278 L 320 238" fill="none" stroke="#0B63CE" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 408 278 L 306 364" fill="none" stroke="#0B63CE" strokeWidth="10" strokeLinecap="round" />
      <path d="M 408 278 L 336 422" fill="none" stroke="#0B63CE" strokeWidth="9" strokeLinecap="round" />

      <path d="M 480 230 L 566 284 L 642 252" fill="none" stroke="#0B63CE" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 566 284 L 672 406" fill="none" stroke="#0B63CE" strokeWidth="10" strokeLinecap="round" />

      {/* Diaphragm Domes */}
      <path
        d="M 190 508 Q 315 446 462 496 Q 608 456 765 516"
        fill="none"
        stroke="#0D9488"
        strokeWidth="8"
        strokeLinecap="round"
      />
    </g>
  );
};

export const AnatomyDiagramViewer: React.FC<AnatomyDiagramViewerProps> = ({
  initialBoardId = 'plexus_brachial',
  showBoardSelector = true,
  compact = false,
}) => {
  const [boardId, setBoardId] = useState<AnatomyBoardId>(initialBoardId);
  const [mode, setMode] = useState<ViewerMode>('study');
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [wheelZoomEnabled, setWheelZoomEnabled] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const [selectedHotspotId, setSelectedHotspotId] = useState<string | null>(null);
  const [revealedIds, setRevealedIds] = useState<string[]>([]);

  // Quiz state
  const [quizQueue, setQuizQueue] = useState<string[]>([]);
  const [quizIndex, setQuizIndex] = useState<number>(0);
  const [quizScore, setQuizScore] = useState<{ correct: number; attempts: number }>({
    correct: 0,
    attempts: 0,
  });
  const [quizFeedback, setQuizFeedback] = useState<{
    status: 'correct' | 'wrong';
    clickedLabel: string;
    clickedNumber: number;
  } | null>(null);
  const [quizSolvedIds, setQuizSolvedIds] = useState<string[]>([]);

  const dragOrigin = useRef<{ startX: number; startY: number; panX: number; panY: number } | null>(
    null
  );
  const movedDuringDrag = useRef<boolean>(false);

  useEffect(() => {
    setBoardId(initialBoardId);
  }, [initialBoardId]);

  const board = useMemo(
    () => ANATOMY_BOARDS.find((b) => b.id === boardId) ?? ANATOMY_BOARDS[0],
    [boardId]
  );

  // Reset per-board interaction state when changing board
  useEffect(() => {
    setSelectedHotspotId(board.hotspots[0]?.id ?? null);
    setRevealedIds([]);
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setQuizFeedback(null);
    setQuizSolvedIds([]);
    setQuizScore({ correct: 0, attempts: 0 });
    setQuizIndex(0);
    setQuizQueue(board.hotspots.map((h) => h.id));
  }, [board]);

  const activeHotspot = useMemo(
    () => board.hotspots.find((h) => h.id === selectedHotspotId) ?? board.hotspots[0],
    [board, selectedHotspotId]
  );

  const currentQuizTarget = useMemo(() => {
    if (mode !== 'quiz' || quizQueue.length === 0) return null;
    const targetId = quizQueue[quizIndex];
    return board.hotspots.find((h) => h.id === targetId) ?? null;
  }, [mode, quizQueue, quizIndex, board]);

  const quizFinished = mode === 'quiz' && quizQueue.length > 0 && quizIndex >= quizQueue.length;

  const startQuiz = () => {
    const ids = [...board.hotspots.map((h) => h.id)];
    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ids[i], ids[j]] = [ids[j], ids[i]];
    }
    setQuizQueue(ids);
    setQuizIndex(0);
    setQuizScore({ correct: 0, attempts: 0 });
    setQuizFeedback(null);
    setQuizSolvedIds([]);
    setMode('quiz');
  };

  const handleModeChange = (nextMode: ViewerMode) => {
    if (nextMode === 'quiz') {
      startQuiz();
      return;
    }
    setMode(nextMode);
    setQuizFeedback(null);
    if (nextMode === 'masked') {
      setRevealedIds([]);
    }
  };

  const adjustZoom = (delta: number) => {
    setZoom((prev) => {
      const next = Math.min(3, Math.max(0.75, Number((prev + delta).toFixed(2))));
      return next;
    });
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('[data-hotspot="true"]')) return;
    setIsDragging(true);
    movedDuringDrag.current = false;
    dragOrigin.current = {
      startX: e.clientX,
      startY: e.clientY,
      panX: pan.x,
      panY: pan.y,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !dragOrigin.current) return;
    const dx = e.clientX - dragOrigin.current.startX;
    const dy = e.clientY - dragOrigin.current.startY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      movedDuringDrag.current = true;
    }
    setPan({
      x: dragOrigin.current.panX + dx,
      y: dragOrigin.current.panY + dy,
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    dragOrigin.current = null;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore if capture already released
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!wheelZoomEnabled && !isFullscreen && !e.ctrlKey) return;
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.15 : -0.15;
    adjustZoom(delta);
  };

  const handleHotspotClick = (hotspot: AnatomyHotspot) => {
    setSelectedHotspotId(hotspot.id);

    if (mode === 'masked') {
      setRevealedIds((prev) =>
        prev.includes(hotspot.id) ? prev : [...prev, hotspot.id]
      );
      return;
    }

    if (mode === 'quiz' && currentQuizTarget && quizFeedback?.status !== 'correct') {
      const isCorrect = hotspot.id === currentQuizTarget.id;
      setQuizScore((prev) => ({
        correct: prev.correct + (isCorrect ? 1 : 0),
        attempts: prev.attempts + 1,
      }));
      setQuizFeedback({
        status: isCorrect ? 'correct' : 'wrong',
        clickedLabel: hotspot.label,
        clickedNumber: hotspot.number,
      });
      if (isCorrect) {
        setQuizSolvedIds((prev) =>
          prev.includes(hotspot.id) ? prev : [...prev, hotspot.id]
        );
      }
    }
  };

  const isHotspotLabelVisible = (hotspotId: string): boolean => {
    if (mode === 'study') return true;
    if (mode === 'masked') return revealedIds.includes(hotspotId);
    return quizSolvedIds.includes(hotspotId);
  };

  const toggleSingleReveal = (id: string) => {
    setRevealedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const revealAll = () => setRevealedIds(board.hotspots.map((h) => h.id));
  const hideAll = () => setRevealedIds([]);

  const renderContent = (inModal: boolean) => (
    <div
      className={`rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden ${
        inModal ? 'h-full flex flex-col' : ''
      }`}
    >
      {/* Header & Board Selector */}
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs font-medium text-teal-700 dark:text-teal-300">
              Atlas interactif haute résolution · {board.specialty} · {board.yearTag}
            </p>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {board.title}
            </h3>
            {!compact && (
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-3xl">
                {board.subtitle}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsFullscreen((v) => !v)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 whitespace-nowrap"
            >
              {inModal ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" />
                  Fermer le plein écran
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5" />
                  Plein écran
                </>
              )}
            </button>
          </div>
        </div>

        {showBoardSelector && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {ANATOMY_BOARDS.map((b) => {
              const active = b.id === board.id;
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setBoardId(b.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                    active
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {b.shortTitle}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Mode & Zoom Toolbar */}
      <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        {/* Study / Mask / Quiz Modes */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => handleModeChange('study')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              mode === 'study'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Étiquettes visibles
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('masked')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              mode === 'masked'
                ? 'bg-teal-600 text-white'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <EyeOff className="w-3.5 h-3.5" />
            Masquer les étiquettes
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('quiz')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              mode === 'quiz'
                ? 'bg-amber-600 text-white'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            Auto-évaluation (Quiz)
          </button>

          {mode === 'masked' && (
            <div className="flex items-center gap-1.5 ml-1">
              <button
                type="button"
                onClick={revealAll}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 whitespace-nowrap"
              >
                Tout révéler
              </button>
              <button
                type="button"
                onClick={hideAll}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 whitespace-nowrap"
              >
                Tout masquer
              </button>
            </div>
          )}
        </div>

        {/* Zoom Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => adjustZoom(-0.25)}
            disabled={zoom <= 0.75}
            aria-label="Dézoomer"
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <input
            type="range"
            min={75}
            max={300}
            step={5}
            value={Math.round(zoom * 100)}
            onChange={(e) => setZoom(Number(e.target.value) / 100)}
            aria-label="Niveau de zoom"
            className="w-24 accent-blue-600 cursor-pointer"
          />
          <span className="text-xs font-mono tabular-nums font-semibold text-slate-700 dark:text-slate-200 w-12 text-center">
            {Math.round(zoom * 100)} %
          </span>
          <button
            type="button"
            onClick={() => adjustZoom(0.25)}
            disabled={zoom >= 3}
            aria-label="Zoomer"
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setWheelZoomEnabled((v) => !v)}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium whitespace-nowrap ${
              wheelZoomEnabled
                ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300'
            }`}
          >
            Molette
          </button>
          <button
            type="button"
            onClick={resetView}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            100 %
          </button>
        </div>
      </div>

      {/* Quiz Prompt Banner */}
      {mode === 'quiz' && (
        <div className="px-4 py-3 bg-amber-50/80 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-900/60 flex flex-wrap items-center justify-between gap-3">
          {!quizFinished && currentQuizTarget ? (
            <>
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-amber-800 dark:text-amber-300">
                  Auto-évaluation · Repère {quizIndex + 1} / {quizQueue.length} · Score :{' '}
                  <span className="font-mono tabular-nums font-bold">
                    {quizScore.correct} / {quizScore.attempts}
                  </span>
                </p>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Localisez sur le schéma : {currentQuizTarget.label}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {quizFeedback && (
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                      quizFeedback.status === 'correct'
                        ? 'text-emerald-700 dark:text-emerald-300'
                        : 'text-rose-700 dark:text-rose-300'
                    }`}
                  >
                    {quizFeedback.status === 'correct' ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Exact ! Repère {quizFeedback.clickedNumber} validé.
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4" />
                        Le repère {quizFeedback.clickedNumber} correspond à : {quizFeedback.clickedLabel}
                      </>
                    )}
                  </span>
                )}
                {quizFeedback?.status === 'correct' && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuizIndex((i) => i + 1);
                      setQuizFeedback(null);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 whitespace-nowrap"
                  >
                    Structure suivante
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="w-full flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Auto-évaluation terminée — Score final :{' '}
                  <span className="font-mono tabular-nums text-emerald-700 dark:text-emerald-300">
                    {quizScore.correct} / {quizScore.attempts}
                  </span>
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Toutes les structures du schéma ont été localisées.
                </p>
              </div>
              <button
                type="button"
                onClick={startQuiz}
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 whitespace-nowrap"
              >
                Recommencer le quiz
              </button>
            </div>
          )}
        </div>
      )}

      {/* Two-zone Stage + Inspector */}
      <div className={`grid lg:grid-cols-12 ${inModal ? 'flex-1 min-h-0' : ''}`}>
        {/* High-res Zoom/Pan SVG Stage */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onWheel={handleWheel}
          onDoubleClick={() => adjustZoom(0.5)}
          className={`lg:col-span-8 relative overflow-hidden select-none bg-slate-50 dark:bg-slate-950 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 ${
            inModal ? 'h-[58vh] lg:h-full' : compact ? 'h-[380px] sm:h-[440px]' : 'h-[430px] sm:h-[520px]'
          } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        >
          {/* Subtle coordinate grid backdrop */}
          <div
            className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20"
            style={{
              backgroundImage:
                'radial-gradient(circle, rgba(148,163,184,0.45) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />

          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: 'center center',
              transition: isDragging ? 'none' : 'transform 120ms ease-out',
            }}
          >
            <svg
              viewBox="0 0 960 580"
              className="w-full h-full max-w-none"
              role="img"
              aria-label={board.title}
            >
              <BoardIllustration boardId={board.id} />

              {/* Leader lines + Hotspot pins + Labels */}
              {board.hotspots.map((hs) => {
                const isSelected = activeHotspot?.id === hs.id;
                const labelVisible = isHotspotLabelVisible(hs.id);
                const isSolved = mode === 'quiz' && quizSolvedIds.includes(hs.id);
                const textAnchor = hs.align;
                const boxWidth = Math.min(230, Math.max(118, hs.shortLabel.length * 7.2 + 20));
                const boxX =
                  hs.align === 'start'
                    ? hs.lx - 6
                    : hs.align === 'end'
                    ? hs.lx - boxWidth + 6
                    : hs.lx - boxWidth / 2;

                return (
                  <g
                    key={hs.id}
                    data-hotspot="true"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleHotspotClick(hs);
                    }}
                    className="cursor-pointer"
                  >
                    {/* Leader line */}
                    <line
                      x1={hs.x}
                      y1={hs.y}
                      x2={hs.lx}
                      y2={hs.ly}
                      className={
                        isSelected
                          ? 'stroke-blue-600 dark:stroke-blue-400'
                          : 'stroke-slate-400 dark:stroke-slate-600'
                      }
                      strokeWidth={isSelected ? '2' : '1.4'}
                      strokeDasharray={labelVisible ? undefined : '4 3'}
                    />

                    {/* Pin circle */}
                    <circle
                      cx={hs.x}
                      cy={hs.y}
                      r={isSelected ? 15 : 13}
                      className={
                        isSolved
                          ? 'fill-emerald-600 stroke-white dark:stroke-slate-900'
                          : isSelected
                          ? 'fill-blue-600 stroke-white dark:stroke-slate-900'
                          : mode !== 'study' && !labelVisible
                          ? 'fill-amber-600 stroke-white dark:stroke-slate-900'
                          : 'fill-slate-900 dark:fill-slate-100 stroke-white dark:stroke-slate-900'
                      }
                      strokeWidth="2.5"
                    />
                    <text
                      x={hs.x}
                      y={hs.y + 4}
                      textAnchor="middle"
                      className={`text-[11px] font-bold font-mono ${
                        isSolved || isSelected || (mode !== 'study' && !labelVisible)
                          ? 'fill-white'
                          : 'fill-white dark:fill-slate-900'
                      }`}
                    >
                      {hs.number < 10 ? `0${hs.number}` : hs.number}
                    </text>

                    {/* Label box or Masked badge */}
                    {labelVisible ? (
                      <g>
                        <rect
                          x={boxX}
                          y={hs.ly - 13}
                          width={boxWidth}
                          height={24}
                          rx={6}
                          className={
                            isSelected
                              ? 'fill-blue-600 stroke-blue-700'
                              : 'fill-white/95 dark:fill-slate-900/95 stroke-slate-300 dark:stroke-slate-700'
                          }
                          strokeWidth="1.2"
                        />
                        <text
                          x={hs.lx}
                          y={hs.ly + 3}
                          textAnchor={textAnchor}
                          className={`text-[11px] font-semibold ${
                            isSelected
                              ? 'fill-white'
                              : 'fill-slate-800 dark:fill-slate-100'
                          }`}
                        >
                          {hs.shortLabel}
                        </text>
                      </g>
                    ) : (
                      <g>
                        <rect
                          x={
                            hs.align === 'start'
                              ? hs.lx - 4
                              : hs.align === 'end'
                              ? hs.lx - 52
                              : hs.lx - 28
                          }
                          y={hs.ly - 12}
                          width={56}
                          height={22}
                          rx={6}
                          className="fill-amber-50 dark:fill-amber-950/90 stroke-amber-400 dark:stroke-amber-700"
                          strokeWidth="1.2"
                        />
                        <text
                          x={
                            hs.align === 'start'
                              ? hs.lx + 24
                              : hs.align === 'end'
                              ? hs.lx - 24
                              : hs.lx
                          }
                          y={hs.ly + 3}
                          textAnchor="middle"
                          className="fill-amber-800 dark:fill-amber-300 text-[10px] font-mono font-bold"
                        >
                          #{hs.number < 10 ? `0${hs.number}` : hs.number} ?
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Stage bottom helper */}
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between pointer-events-none text-[11px] text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1 bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-md px-2 py-1">
              <Move className="w-3 h-3" />
              Cliquer-glisser pour déplacer · Double-clic pour zoomer
            </span>
            <span className="hidden sm:inline bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-md px-2 py-1">
              {mode === 'masked'
                ? `${revealedIds.length} / ${board.hotspots.length} révélées`
                : `${board.hotspots.length} repères anatomiques`}
            </span>
          </div>
        </div>

        {/* Right Side: Inspector + Numbered Structure Index */}
        <div
          className={`lg:col-span-4 flex flex-col bg-white dark:bg-slate-900 ${
            inModal ? 'overflow-y-auto' : 'max-h-[520px] overflow-y-auto'
          }`}
        >
          {/* Active structure detail card */}
          {activeHotspot && (
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono font-semibold text-blue-700 dark:text-blue-400">
                  Repère #{activeHotspot.number < 10 ? `0${activeHotspot.number}` : activeHotspot.number} · {activeHotspot.category}
                </span>
                {mode === 'masked' && (
                  <button
                    type="button"
                    onClick={() => toggleSingleReveal(activeHotspot.id)}
                    className="text-xs font-medium text-teal-700 dark:text-teal-300 hover:underline whitespace-nowrap"
                  >
                    {revealedIds.includes(activeHotspot.id) ? 'Masquer' : 'Révéler'}
                  </button>
                )}
              </div>

              {mode === 'quiz' && !quizSolvedIds.includes(activeHotspot.id) ? (
                <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-3 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    Nom de la structure masqué pendant l’auto-évaluation. Cliquez sur le repère demandé sur le schéma pour valider votre réponse.
                  </span>
                </div>
              ) : mode === 'masked' && !revealedIds.includes(activeHotspot.id) ? (
                <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-3 space-y-2">
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Étiquette masquée pour l’auto-évaluation. Formulez le nom de la structure #{activeHotspot.number}, puis cliquez pour vérifier :
                  </p>
                  <button
                    type="button"
                    onClick={() => toggleSingleReveal(activeHotspot.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-medium hover:bg-teal-700"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Révéler la réponse
                  </button>
                </div>
              ) : (
                <>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {activeHotspot.label}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {activeHotspot.description}
                  </p>
                  <div className="rounded-lg bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/70 dark:border-blue-900/50 p-2.5">
                    <p className="text-[11px] font-semibold text-blue-900 dark:text-blue-200">
                      Corrélation clinique & Résidanat
                    </p>
                    <p className="mt-0.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {activeHotspot.clinicalPearl}
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Structure directory */}
          <div className="p-3 space-y-1.5">
            <p className="px-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Index des structures ({board.hotspots.length})
            </p>
            {board.hotspots.map((hs) => {
              const selected = activeHotspot?.id === hs.id;
              const labelVisible = isHotspotLabelVisible(hs.id);
              return (
                <button
                  key={hs.id}
                  type="button"
                  onClick={() => handleHotspotClick(hs)}
                  className={`w-full text-left px-3 py-2 rounded-lg border text-xs flex items-center justify-between gap-2 transition-colors ${
                    selected
                      ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/30 text-blue-900 dark:text-blue-100'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <span className="font-mono tabular-nums font-bold text-slate-500 dark:text-slate-400 shrink-0">
                      {hs.number < 10 ? `0${hs.number}` : hs.number}
                    </span>
                    <span className="truncate font-medium">
                      {labelVisible ? hs.label : 'Structure masquée — cliquer pour révéler'}
                    </span>
                  </span>
                  {mode === 'quiz' && quizSolvedIds.includes(hs.id) && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-auto px-4 py-2.5 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
            Référence : {board.reference}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {renderContent(false)}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs p-3 sm:p-5 flex flex-col">
          {renderContent(true)}
        </div>
      )}
    </>
  );
};
