import React, { useMemo, useState } from 'react';
import { AlertCircle, ExternalLink, Repeat2, Search } from 'lucide-react';
import type { QCMQuestion, SpecialtyName, StudySessionRecord } from '../types/med';

type University = 'Batna' | 'Oran' | 'Alger';
const UNIVERSITIES: University[] = ['Batna', 'Oran', 'Alger'];
const YEARS = Array.from({ length: 19 }, (_, index) => 2026 - index);

const SOURCES: Record<University, Array<{ label: string; url: string; note: string }>> = {
  Batna: [
    { label: 'Faculté de médecine — Université Batna 2', url: 'https://med-fac.univ-batna2.dz/', note: 'Source institutionnelle à consulter pour les annonces et documents.' },
    { label: 'Catalogue de la Bibliothèque centrale de Batna', url: 'https://pmb.univ-batna.dz/opac_bcu/index.php?id=100&l_typdoc=&lvl=categ_see&nbr_lignes=2637&page=18', note: 'Référence à des recueils imprimés d’annales ; les sujets numériques 2008–2026 restent à collecter et vérifier.' },
    { label: 'Préparation officielle du concours — 2021', url: 'https://med-fac.univ-batna2.dz/news/pr%C3%A9paration-au-concours-de-r%C3%A9sidanat?page=1', note: 'Publication institutionnelle relative à l’organisation du concours.' },
    { label: 'BMset — canal Résidanat Batna', url: 'https://t.me/s/bmse_t/499', note: 'Piste communautaire : annonce de QCM corrigés de préparation ciblant le système digestif. Ce post ne prouve pas qu’il s’agit d’une annale officielle ; ne pas importer comme sujet historique.' },
    { label: 'Avis officiel — Résidanat Batna octobre 2023', url: 'https://med-fac.univ-batna2.dz/sites/default/files/medecine-fac/files/concours_de_residanat_session_2023_1.pdf', note: 'PDF institutionnel confirmé : annonce 150 QCM en 4 heures pour médecine et pharmacie. C’est un avis d’organisation, pas le sujet avec les questions.' },
    { label: 'Programme officiel Résidanat Pharmacie Batna 2020/2021', url: 'https://pharmacie.univ-batna2.dz/sites/default/files/pharmacie/files/programme_residanat.pdf', note: 'Programme institutionnel du concours de pharmacie, utile pour la classification du programme ; ce n’est pas une annale.' },
    { label: 'Étude psychométrique des QCM Batna — session octobre 2025', url: 'https://latunisiemedicale.org/index.php/tunismed/fr/article/view/6612', note: 'Étude scientifique indique l’analyse de 150 QCM issus de l’examen d’octobre 2025. Ne contient pas le texte intégral des questions.' },
    { label: 'BMset — exemple communautaire Résidanat Batna 2022/2023', url: 'https://t.me/s/bmse_t/641', note: 'Un post Telegram présente une question attribuée au Résidanat Batna 2022/2023. À conserver comme piste à corroborer ; publication communautaire, pas le PDF officiel du sujet.' },
    { label: 'BMset — préparation Résidanat Batna 2025', url: 'https://t.me/s/bmse_t/539', note: 'QCM corrigés annoncés comme sélectionnés du programme de 3e/4e année 2025. Ressource de préparation, pas une annale officielle démontrée.' },
  ],
  Oran: [
    { label: 'Faculté de médecine Oran 1', url: 'https://facmed.univ-oran1.dz/', note: 'Site institutionnel de la faculté.' },
    { label: 'Sujets de Résidanat — 2014, 2016, 2021, 2022', url: 'https://sites.google.com/view/faculte-de-medecine-oran/accueil', note: 'Index de documents de sujets ; vérifier chaque fichier avant import.' },
    { label: 'Concours — Session octobre 2026', url: 'https://facmed.univ-oran1.dz/33-concours-d-acc%C3%A8s-au-r%C3%A9sidanat/901-concours-d-acc%C3%A8s-au-r%C3%A9sidanat%20session-octobre-2026.html', note: 'Page officielle de la session 2026 ; sujet complet non confirmé sur cette page.' },
    { label: 'Règlement intérieur du concours', url: 'https://facmed.univ-oran1.dz/images/Reglement_int%C3%A9rieur_du_concours_de_r%C3%A9sidanat.pdf', note: 'Règlement officiel, pas une annale.' },
    { label: 'Résidanat Oran — canal Telegram communautaire', url: 'https://t.me/s/residanat_oran', note: 'Piste de collecte : publications contenant des liens Drive de sujets récents et de banques thématiques. Vérifier chaque PDF, sa faculté et son année avant import.' },
    { label: 'Les 3 derniers sujets — Drive partagé par Résidanat Oran', url: 'https://drive.google.com/file/d/1JiyU0i-17GcLlI7yvx5HcdFJK5EwugCp/view', note: 'Lien de sujets partagé par la chaîne Telegram ; années, faculté et intégrité des pages à vérifier avant import.' },
    { label: 'QCM avec sources retrouvées — Drive Oran', url: 'https://drive.google.com/file/d/1OovvkZmiaaN6Jlf44r4OkBoc_utm9-u0/view', note: 'Collection QCM avec certaines sources signalées ; ce n’est pas un sujet d’examen complet garanti.' },
    { label: 'Dermatologie — source Résidanat décembre 2022', url: 'https://drive.google.com/file/d/1J4b4ayIvVcqoX-WwA3SrhUZo5ni3gD1X/view', note: 'Banque thématique présentée comme source décembre 2022 ; vérifier les questions/page et l’origine avant classification historique.' },
    { label: 'Biochimie — source Résidanat décembre 2022', url: 'https://drive.google.com/file/d/1IAy1zdigmm8_dAv8UripR1Vn9tQ_1j7N/view', note: 'Banque thématique annoncée comme source décembre 2022 ; vérifier le PDF avant extraction.' },
    { label: 'Microbiologie et Hémobiologie — Résidanat décembre 2022', url: 'https://drive.google.com/file/d/1MEqTu13W0g9VmGbXJOVuunHJ_e-9S7qe/view', note: 'Ressource thématique partagée comme source de décembre 2022 ; vérifier chaque item et la provenance.' },
    { label: 'Questions Résidanat Oran 2024 — collecte individuelle et sources', url: 'https://t.me/s/drykm_medicine/1480', note: 'Témoignage d’un lauréat : collection personnelle de questions vues au concours 2024 et tableau de sources. Les auteurs signalent eux-mêmes que certaines sources/questions restent à compléter ou corriger.' },
    { label: 'Sources Résidanat Oran 2024 — PDF récapitulatif', url: 'https://t.me/s/drykm_medicine/1478', note: 'Publication d’un lauréat avec PDF des sources QCM 2024 ; utile pour remonter aux références originales, pas à importer directement comme annale intégrale.' },
    { label: 'MBset Oran — simulation Résidanat 2025', url: 'https://t.me/s/drykm_medicine?after=1756', note: 'Publication communautaire signalant une simulation Oran 2025. À classer en entraînement, sauf preuve qu’un item provient du sujet officiel.' },
    { label: 'Drykm-MEDICINE — ressources Résidanat Oran', url: 'https://t.me/s/drykm_medicine', note: 'Piste de collecte secondaire : relais de PDFs et ressources attribuées à Oran. Les banques thématiques et fiches de préparation ne sont pas automatiquement des annales.' },
  ],
  Alger: [
    { label: 'Annales Résidanat — Faculté d’Alger', url: 'https://app.qsmqcs.com/residanat/alger', note: 'Index d’annales classées par année et épreuve.' },
    { label: 'Épreuves Résidanat Alger 2008', url: 'https://residanat-algerie.blogspot.com/2009/10/epreuves-2008-alger.html', note: 'Publication ancienne qui référence le sujet complet 2008 et ses parties.' },
    { label: 'Sujets de Résidanat — Alger', url: 'https://www.ency-education.net/medecine-residanat/1', note: 'Index d’épreuves historiques par année ; contrôler les fichiers sources.' },
    { label: 'ZED Résidanat Alger — index Telegram des sujets 2002–2024', url: 'https://t.me/s/ZED_RSD_ALG', note: 'Le canal publie un index de liens Drive pour les sujets Alger 2002–2024, dont 2008, 2022 (février et décembre), 2023 et 2024. Chaque fichier doit être ouvert et contrôlé individuellement avant import.' },
    { label: 'Sujet Alger 2008 — PDF partagé sur Drive', url: 'https://drive.google.com/file/d/11bdqCd_NzE0dZXvqBefeIbQKyRbOGcTd/view?usp=drivesdk', note: 'Lien direct référencé par le canal ZED ; le contenu PDF et les pages restent à vérifier avant extraction.' },
    { label: 'Sujet Alger 2022 décembre — PDF partagé sur Drive', url: 'https://drive.google.com/file/d/108FtzaY5GJxLGVuZT4jKXLhpdcAxpspS/view?usp=drivesdk', note: 'Lien direct référencé par le canal ZED ; le contenu PDF et les pages restent à vérifier avant extraction.' },
    { label: 'Sujet Alger 2024 — PDF partagé sur Drive', url: 'https://drive.google.com/file/d/179apwaNABqLl0YypHChWbB4DRh7OjWQj/view?usp=drivesdk', note: 'Lien direct référencé par le canal ZED ; le contenu PDF et les pages restent à vérifier avant extraction.' },
    { label: 'Résidanat Alger 2025 The_DR — canal Telegram', url: 'https://t.me/s/Residanat_2024', note: 'Canal animé par une résidente ; partage de drives, résumés et sources de préparation. Ressources utiles pour recherche, mais à ne pas confondre avec des sujets officiels.' },
    { label: 'Sujets biologie + externat Alger 2025 — canal Telegram', url: 'https://t.me/s/focus2025exalg18', note: 'Piste communautaire avec un Drive et des liens vers des sujets ; vérifier la provenance de chaque document.' },
    { label: 'Sujet Résidanat Alger 2023 — copie avec corrigé proposé', url: 'https://pdfcoffee.com/sujet-residanat-2023-corrige-propose-pdf-free.html', note: 'Copie téléversée par un utilisateur, annoncée comme session Alger octobre 2023 ; corrigé proposé non officiel et authenticité à contrôler avec une autre source.' },
  ],
};

interface Props {
  allQuestions: QCMQuestion[];
  onStartSession: (config: { title: string; mode: StudySessionRecord['mode']; questionIds: string[]; specialty?: SpecialtyName | 'Toutes'; immediateFeedback: boolean; timerMinutes: number }) => void;
}

const normalizeStem = (value: string) => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, ' ')
  .trim()
  .replace(/\s+/g, ' ');

export const ResidencyUniversityArchivesView: React.FC<Props> = ({ allQuestions, onStartSession }) => {
  const [university, setUniversity] = useState<University>('Batna');
  const [year, setYear] = useState(2026);
  const [search, setSearch] = useState('');

  const verified = useMemo(() => allQuestions.filter((q) => q.sourceType === 'ARCHIVE_VERIFIEE' && q.reference?.trim()), [allQuestions]);
  const selectedQuestions = useMemo(() => verified.filter((q) => q.university === university && q.examYear === year && (!search || q.stem.toLowerCase().includes(search.toLowerCase()))), [verified, university, year, search]);

  const repeatedGroups = useMemo(() => {
    const groups = new Map<string, QCMQuestion[]>();
    verified.forEach((question) => {
      const key = normalizeStem(question.stem);
      if (!key) return;
      const group = groups.get(key) || [];
      group.push(question);
      groups.set(key, group);
    });
    return [...groups.entries()]
      .filter(([, questions]) => questions.length > 1)
      .map(([key, questions]) => ({ key, questions, years: [...new Set(questions.map((q) => q.examYear).filter(Boolean))].sort((a,b) => Number(a)-Number(b)), universities: [...new Set(questions.map((q) => q.university).filter(Boolean))] }))
      .sort((a,b) => b.questions.length - a.questions.length);
  }, [verified]);

  const start = (questions: QCMQuestion[], title: string) => onStartSession({
    title, mode: 'residanat_complet', questionIds: questions.map((q) => q.id),
    specialty: 'Toutes', immediateFeedback: true, timerMinutes: 0,
  });

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Annales originales du Résidanat (2008–2026)</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Cette bibliothèque accepte uniquement les QCM extraits d’un sujet source vérifiable. Chaque question doit conserver sa faculté, son année et sa référence documentaire. Aucun QCM généré par IA n’est présenté comme une annale.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {UNIVERSITIES.map((item) => <button key={item} onClick={() => setUniversity(item)} className={`rounded-lg px-4 py-2 text-sm font-semibold ${university === item ? 'bg-blue-600 text-white' : 'border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'}`}>Université de {item}</button>)}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Année de session
            <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="mt-1 block w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100">{YEARS.map((y) => <option key={y} value={y}>{y}</option>)}</select>
          </label>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <span className="font-medium">QCM originaux vérifiés — {university} {year}</span>
            <div className="mt-1 rounded-lg border border-slate-200 dark:border-slate-700 p-3 text-sm">{selectedQuestions.length} question(s) intégrée(s) avec référence</div>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher une question dans cette session…" className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-2.5 pl-9 pr-3 text-sm text-slate-900 dark:text-slate-100" />
        </div>
        {selectedQuestions.length > 0 ? (
          <button onClick={() => start(selectedQuestions, `Annales originales — ${university} ${year}`)} className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white">Commencer les {selectedQuestions.length} QCM originaux</button>
        ) : <p className="text-sm text-amber-700 dark:text-amber-300">Aucun sujet original de cette faculté et de cette année n’est encore importé et vérifié dans la base locale.</p>}
      </section>

      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
        <div className="flex items-center gap-2"><Repeat2 className="h-5 w-5 text-blue-600" /><h2 className="font-semibold text-slate-900 dark:text-slate-100">Questions répétées dans les examens</h2></div>
        <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">Le système compare les énoncés des QCM originaux déjà importés. Une répétition n’est comptée que si le texte normalisé correspond exactement ; les formulations proches devront être validées avant d’être fusionnées.</p>
        {repeatedGroups.length ? <div className="space-y-3">{repeatedGroups.map((group) => <article key={group.key} className="rounded-xl border border-slate-200 dark:border-slate-700 p-3">
          <div className="flex flex-wrap items-center justify-between gap-2"><span className="text-xs font-semibold text-blue-700 dark:text-blue-300">{group.questions.length} occurrences détectées</span><span className="text-xs text-slate-500">{group.years.join(' · ')} | {group.universities.join(', ')}</span></div>
          <p className="mt-2 text-sm text-slate-800 dark:text-slate-100">{group.questions[0].stem}</p>
          <div className="mt-2 flex flex-wrap gap-2">{group.questions.map((q) => <a key={q.id} href={q.reference} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-1 text-xs text-blue-700 dark:text-blue-300">{q.university} {q.examYear} <ExternalLink className="h-3 w-3" /></a>)}</div>
        </article>)}</div> : <p className="rounded-lg bg-slate-50 dark:bg-slate-800 p-3 text-sm text-slate-600 dark:text-slate-300">Aucune répétition vérifiable détectée pour le moment. هذا لا يعني أن الأسئلة لم تتكرر؛ يعني فقط أن قاعدة الأسئلة الأصلية لم تُملأ بعد بما يكفي لإجراء المقارنة.</p>}
      </section>

      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
        <h2 className="font-semibold text-slate-900 dark:text-slate-100">Sources documentaires — {university}</h2>
        {SOURCES[university].map((source) => <div key={source.url} className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 py-3 last:border-0">
          <div><p className="text-sm font-medium text-slate-800 dark:text-slate-100">{source.label}</p><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{source.note}</p></div>
          <a href={source.url} target="_blank" rel="noreferrer" className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400">Ouvrir <ExternalLink className="h-3 w-3" /></a>
        </div>)}
      </section>

      <p className="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> Les archives publiques trouvées ne couvrent pas encore toutes les sessions 2008–2026, notamment pour Batna. Les questions manquantes ne seront pas inventées. Les corrections doivent être vérifiées séparément de l’énoncé original.</p>
    </div>
  );
};
