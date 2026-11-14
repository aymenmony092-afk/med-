import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Bookmark,
  Calculator,
  CheckCircle2,
  FlaskConical,
  Search,
  Stethoscope,
  XCircle,
} from 'lucide-react';
import { CLINICAL_CASES } from '../data/clinical_cases';
import {
  LAB_REFERENCES,
  MEDICAL_ABBREVIATIONS,
  MEDICAL_TERMINOLOGY,
} from '../data/medical_tools_data';
import type { ClinicalCase } from '../types/med';
import { MedicalDiagramSVG } from './MedicalBrandLogo';
import clinicalWardImg from '../assets/images/clinical_case_ward_1794659125157.jpg';

interface ClinicalCasesViewProps {
  activeCaseId: string | null;
  onSelectCase: (id: string | null) => void;
  completedCaseIds: string[];
  onMarkCaseCompleted: (id: string) => void;
  favoriteIds: Set<string>;
  onToggleFavoriteCase: (cc: ClinicalCase) => void;
}

export const ClinicalCasesView: React.FC<ClinicalCasesViewProps> = ({
  activeCaseId,
  onSelectCase,
  completedCaseIds,
  onMarkCaseCompleted,
  favoriteIds,
  onToggleFavoriteCase,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showSolution, setShowSolution] = useState(false);

  const activeCase = useMemo(
    () => CLINICAL_CASES.find((c) => c.id === activeCaseId) || null,
    [activeCaseId]
  );

  if (activeCase) {
    const isFav = favoriteIds.has(activeCase.id);
    const isDone = completedCaseIds.includes(activeCase.id);

    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-4">
          <button
            onClick={() => {
              onSelectCase(null);
              setSelectedAnswers({});
              setShowSolution(false);
            }}
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← Retour aux cas cliniques
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFavoriteCase(activeCase)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium ${
                isFav
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
                  : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              {isFav ? 'Favori enregistré' : 'Favori'}
            </button>
            <button
              onClick={() => onMarkCaseCompleted(activeCase.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${
                isDone ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              {isDone ? 'Cas validé' : 'Valider le cas'}
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-amber-200 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/30 p-3 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            <strong>Simulation pédagogique :</strong> ce cas clinique est un scénario éducatif structuré pour l’entraînement médical et ne constitue pas un dossier patient réel.
          </span>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 space-y-6">
          <div className="space-y-1">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {activeCase.specialty} · {activeCase.yearLevel}e Année · Difficulté : {activeCase.difficulty}
            </p>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{activeCase.title}</h1>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Présentation du patient
                </h2>
                <p className="mt-1 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {activeCase.patientPresentation}
                </p>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Antécédents</h2>
                <ul className="mt-1 space-y-1 text-sm text-slate-700 dark:text-slate-300">
                  {activeCase.medicalHistory.map((h, i) => (
                    <li key={i}>• {h}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Motif & Symptômes</h2>
                <ul className="mt-1 space-y-1 text-sm text-slate-700 dark:text-slate-300">
                  {activeCase.symptoms.map((s, i) => (
                    <li key={i}>• {s}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-5">
              <div>
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Examen clinique & Constantes
                </h2>
                <p className="mt-1 text-xs font-mono text-blue-700 dark:text-blue-300">
                  {activeCase.clinicalExam.vitals}
                </p>
                <ul className="mt-2 space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
                  {activeCase.clinicalExam.findings.map((f, i) => (
                    <li key={i}>• {f}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Lab results table */}
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Examens complémentaires & Biologie
            </h2>
            <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                    <th className="py-2.5 px-4">Paramètre</th>
                    <th className="py-2.5 px-4">Résultat</th>
                    <th className="py-2.5 px-4">Valeurs usuelles</th>
                    <th className="py-2.5 px-4">Interprétation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {activeCase.labResults.map((lr, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 px-4 font-medium text-slate-900 dark:text-slate-100">{lr.parameter}</td>
                      <td className="py-2.5 px-4 font-mono text-xs text-slate-800 dark:text-slate-200">{lr.value}</td>
                      <td className="py-2.5 px-4 font-mono text-xs text-slate-500 dark:text-slate-400">{lr.normalRange}</td>
                      <td className="py-2.5 px-4 text-xs font-semibold">
                        {lr.status === 'normal' && <span className="text-emerald-600 dark:text-emerald-400">Normal</span>}
                        {lr.status === 'eleve' && <span className="text-rose-600 dark:text-rose-400">▲ Élevé / Anormal</span>}
                        {lr.status === 'bas' && <span className="text-amber-600 dark:text-amber-400">▼ Bas</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Interactive Diagnostic Questions */}
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Questions diagnostiques et thérapeutiques
            </h2>
            {activeCase.diagnosticQuestions.map((dq, qIdx) => {
              const key = `${activeCase.id}-${qIdx}`;
              const chosen = selectedAnswers[key];
              const answered = chosen !== undefined;
              return (
                <div
                  key={key}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-3"
                >
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {qIdx + 1}. {dq.question}
                  </p>
                  <div className="space-y-2">
                    {dq.choices.map((ch, cIdx) => {
                      const isCorrect = cIdx === dq.correctIndex;
                      const isSel = chosen === cIdx;
                      let cls = 'border-slate-200 dark:border-slate-800 hover:border-blue-400';
                      if (answered) {
                        if (isCorrect) cls = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40';
                        else if (isSel) cls = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40';
                      }
                      return (
                        <button
                          key={cIdx}
                          onClick={() => setSelectedAnswers((prev) => ({ ...prev, [key]: cIdx }))}
                          className={`w-full text-left rounded-lg border p-3 text-sm flex items-center justify-between gap-2 ${cls}`}
                        >
                          <span className="text-slate-800 dark:text-slate-200">{ch}</span>
                          {answered && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                          {answered && isSel && !isCorrect && <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                  {answered && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
                      {dq.rationale}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => {
                setShowSolution((v) => !v);
                onMarkCaseCompleted(activeCase.id);
              }}
              className="px-4 py-2 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-700"
            >
              {showSolution ? 'Masquer la synthèse clinique' : 'Afficher diagnostic final & conduite à tenir'}
            </button>
          </div>

          {showSolution && (
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-6 space-y-4">
              <div>
                <p className="text-xs font-semibold text-teal-700 dark:text-teal-400">Diagnostic retenu</p>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                  {activeCase.correctDiagnosis}
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">{activeCase.explanation}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Diagnostics différentiels</h4>
                <ul className="mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-300">
                  {activeCase.differentialDiagnosis.map((d, i) => (
                    <li key={i}>• {d}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Principes de prise en charge</h4>
                <ul className="mt-1 space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
                  {activeCase.managementPrinciples.map((m, i) => (
                    <li key={i}>0{i + 1}. {m}</li>
                  ))}
                </ul>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{activeCase.reference}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden grid md:grid-cols-3 items-stretch">
        <div className="p-6 md:col-span-2 space-y-3 flex flex-col justify-center">
          <p className="text-xs font-medium text-teal-700 dark:text-teal-400">
            Simulations cliniques pédagogiques · Raisonnement médical
          </p>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Cas Cliniques Interactifs
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Entraînez votre raisonnement diagnostique pas à pas : motif d’admission, examen clinique, bilan biologique commenté, questions interactives, diagnostics différentiels et conduite à tenir.
          </p>
          <p className="text-xs text-amber-700 dark:text-amber-300">
            Avertissement : scénarios simulés à but exclusivement éducatif (ne constituent pas des dossiers patients réels).
          </p>
        </div>
        <div className="min-h-[180px] bg-slate-100 dark:bg-slate-800">
          <img
            src={clinicalWardImg}
            alt="Station d'examen clinique hospitalier avec moniteur ECG et stéthoscope"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {CLINICAL_CASES.map((cc) => {
          const isDone = completedCaseIds.includes(cc.id);
          return (
            <div
              key={cc.id}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex flex-col justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-medium text-blue-700 dark:text-blue-400">{cc.specialty}</span>
                  <span>{cc.yearLevel}e Année · {cc.difficulty}</span>
                </div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">{cc.title}</h2>
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">{cc.patientPresentation}</p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className={`text-xs font-medium ${isDone ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                  {isDone ? 'Cas résolu' : 'À explorer'}
                </span>
                <button
                  onClick={() => onSelectCase(cc.id)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700"
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                  Ouvrir le cas
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// MEDICAL TOOLS VIEW (8 Tools)
type ToolTab =
  | 'imc'
  | 'convert'
  | 'posologie'
  | 'labo'
  | 'terminologie'
  | 'abreviations'
  | 'anatomie'
  | 'formules';

export const MedicalToolsView: React.FC = () => {
  const [tab, setTab] = useState<ToolTab>('imc');

  // 1. BMI
  const [weightKg, setWeightKg] = useState(70);
  const [heightCm, setHeightCm] = useState(175);
  const bmi = heightCm > 0 ? weightKg / Math.pow(heightCm / 100, 2) : 0;
  const bmiLabel =
    bmi < 18.5
      ? 'Insuffisance pondérale'
      : bmi < 25
      ? 'Corpulence normale'
      : bmi < 30
      ? 'Surpoids'
      : bmi < 35
      ? 'Obésité modérée (classe I)'
      : bmi < 40
      ? 'Obésité sévère (classe II)'
      : 'Obésité massive (classe III)';

  // 2. Unit converter
  const [convType, setConvType] = useState<'glucose' | 'creatinine' | 'urea' | 'calcium' | 'temp'>('glucose');
  const [convVal, setConvVal] = useState(1.0);
  const [convDir, setConvDir] = useState<'toSI' | 'fromSI'>('toSI');

  const convertedOutput = useMemo(() => {
    switch (convType) {
      case 'glucose':
        return convDir === 'toSI'
          ? `${(convVal * 5.55).toFixed(2)} mmol/L (à partir de ${convVal} g/L)`
          : `${(convVal / 5.55).toFixed(2)} g/L (à partir de ${convVal} mmol/L)`;
      case 'creatinine':
        return convDir === 'toSI'
          ? `${(convVal * 8.84).toFixed(1)} µmol/L (à partir de ${convVal} mg/L)`
          : `${(convVal / 8.84).toFixed(2)} mg/L (à partir de ${convVal} µmol/L)`;
      case 'urea':
        return convDir === 'toSI'
          ? `${(convVal * 16.65).toFixed(2)} mmol/L (à partir de ${convVal} g/L)`
          : `${(convVal / 16.65).toFixed(2)} g/L (à partir de ${convVal} mmol/L)`;
      case 'calcium':
        return convDir === 'toSI'
          ? `${(convVal / 40).toFixed(2)} mmol/L (à partir de ${convVal} mg/L)`
          : `${(convVal * 40).toFixed(1)} mg/L (à partir de ${convVal} mmol/L)`;
      case 'temp':
        return convDir === 'toSI'
          ? `${(convVal * 1.8 + 32).toFixed(1)} °F (à partir de ${convVal} °C)`
          : `${(((convVal - 32) * 5) / 9).toFixed(1)} °C (à partir de ${convVal} °F)`;
    }
  }, [convType, convVal, convDir]);

  // 3. Dosage & IV drip
  const [doseWeight, setDoseWeight] = useState(15);
  const [mgPerKgDay, setMgPerKgDay] = useState(50);
  const [dosesPerDay, setDosesPerDay] = useState(3);
  const [ivVolumeMl, setIvVolumeMl] = useState(500);
  const [ivHours, setIvHours] = useState(8);

  const totalMgDay = doseWeight * mgPerKgDay;
  const mgPerDose = dosesPerDay > 0 ? totalMgDay / dosesPerDay : 0;
  const mlPerHour = ivHours > 0 ? ivVolumeMl / ivHours : 0;
  const dropsPerMin = (mlPerHour * 20) / 60; // 20 gouttes/mL standard

  // 4-6 Searchable tables
  const [toolSearch, setToolSearch] = useState('');
  const [anatomyDiagram, setAnatomyDiagram] = useState<'cardiac' | 'nephron' | 'respiratory'>('cardiac');

  // 8. Formulas (Cockcroft + Corrected Na + Anion Gap)
  const [age, setAge] = useState(60);
  const [sex, setSex] = useState<'H' | 'F'>('H');
  const [creatUmol, setCreatUmol] = useState(110);
  const [fWeight, setFWeight] = useState(70);
  const cockcroft =
    creatUmol > 0
      ? (((140 - age) * fWeight) / creatUmol) * (sex === 'H' ? 1.23 : 1.04)
      : 0;

  const [naMeasured, setNaMeasured] = useState(130);
  const [glyGPerL, setGlyGPerL] = useState(4.0);
  const naCorrected = naMeasured + 1.6 * Math.max(0, glyGPerL - 1);

  const [naVal, setNaVal] = useState(140);
  const [clVal, setClVal] = useState(102);
  const [hco3Val, setHco3Val] = useState(14);
  const anionGap = naVal - (clVal + hco3Val);

  const tabs: Array<{ id: ToolTab; label: string }> = [
    { id: 'imc', label: 'Calculateur IMC' },
    { id: 'convert', label: 'Convertisseur d’unités' },
    { id: 'posologie', label: 'Posologie & Débit IV' },
    { id: 'labo', label: 'Valeurs biologiques' },
    { id: 'terminologie', label: 'Terminologie' },
    { id: 'abreviations', label: 'Abréviations' },
    { id: 'anatomie', label: 'Référence anatomique' },
    { id: 'formules', label: 'Formules médicales' },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Outils Médicaux & Calculateurs d’Étude
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Calculateurs cliniques, conversions d’unités, constantes biologiques usuelles, dictionnaire et formules de référence hors-ligne.
          </p>
        </div>

        <div className="rounded-lg border border-amber-200 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/30 p-3 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            <strong>Avertissement clinique :</strong> ces outils sont destinés à l’apprentissage médical. Vérifiez systématiquement toute posologie, valeur seuil de laboratoire et calcul clinique auprès du Vidal/référentiel hospitalier avant toute décision médicale réelle.
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 p-1 rounded-lg bg-slate-100 dark:bg-slate-800">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                tab === t.id
                  ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tool Panels */}
      {tab === 'imc' && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-blue-600" />
              Indice de Masse Corporelle (IMC / BMI)
            </h2>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Poids (kg)
              </label>
              <input
                type="number"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value) || 0)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm font-mono text-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Taille (cm)
              </label>
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value) || 0)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm font-mono text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-6 flex flex-col justify-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">Résultat calculé (Poids / Taille²)</p>
            <p className="mt-1 text-3xl font-bold font-mono tabular-nums text-blue-700 dark:text-blue-400">
              {bmi.toFixed(1)} kg/m²
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">{bmiLabel}</p>
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
              Seuils OMS adulte : &lt; 18,5 maigreur · 18,5–24,9 normal · 25–29,9 surpoids · ≥ 30 obésité.
            </p>
          </div>
        </div>
      )}

      {tab === 'convert' && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Convertisseur d’unités biologiques et cliniques
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            <select
              value={convType}
              onChange={(e) => setConvType(e.target.value as typeof convType)}
              className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
            >
              <option value="glucose">Glycémie (g/L ↔ mmol/L)</option>
              <option value="creatinine">Créatininémie (mg/L ↔ µmol/L)</option>
              <option value="urea">Urée sanguine (g/L ↔ mmol/L)</option>
              <option value="calcium">Calcémie (mg/L ↔ mmol/L)</option>
              <option value="temp">Température (°C ↔ °F)</option>
            </select>
            <select
              value={convDir}
              onChange={(e) => setConvDir(e.target.value as 'toSI' | 'fromSI')}
              className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
            >
              <option value="toSI">Conventionnel (g/L, mg/L, °C) → SI (mmol/L, µmol/L, °F)</option>
              <option value="fromSI">SI (mmol/L, µmol/L, °F) → Conventionnel (g/L, mg/L, °C)</option>
            </select>
            <input
              type="number"
              step="0.01"
              value={convVal}
              onChange={(e) => setConvVal(Number(e.target.value) || 0)}
              className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm font-mono text-slate-900 dark:text-slate-100"
            />
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-4">
            <p className="text-xs text-slate-500 dark:text-slate-400">Équivalence convertie</p>
            <p className="mt-1 text-xl font-bold font-mono tabular-nums text-teal-700 dark:text-teal-300">
              {convertedOutput}
            </p>
          </div>
        </div>
      )}

      {tab === 'posologie' && (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Calcul pédagogique de posologie pondérale
            </h2>
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Poids (kg)</label>
                <input
                  type="number"
                  value={doseWeight}
                  onChange={(e) => setDoseWeight(Number(e.target.value) || 0)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm font-mono"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Dose (mg/kg/j)</label>
                <input
                  type="number"
                  value={mgPerKgDay}
                  onChange={(e) => setMgPerKgDay(Number(e.target.value) || 0)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm font-mono"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Prises / 24h</label>
                <input
                  type="number"
                  min={1}
                  value={dosesPerDay}
                  onChange={(e) => setDosesPerDay(Math.max(1, Number(e.target.value) || 1))}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm font-mono"
                />
              </div>
            </div>
            <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-4 space-y-1">
              <p className="text-sm font-mono tabular-nums text-slate-900 dark:text-slate-100">
                Dose totale / 24h : <strong>{totalMgDay.toFixed(1)} mg/j</strong>
              </p>
              <p className="text-sm font-mono tabular-nums text-blue-700 dark:text-blue-400">
                Soit par prise : <strong>{mgPerDose.toFixed(1)} mg</strong> × {dosesPerDay}/jour
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Calcul de débit de perfusion (tubulure standard 20 gttes/mL)
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Volume (mL)</label>
                <input
                  type="number"
                  value={ivVolumeMl}
                  onChange={(e) => setIvVolumeMl(Number(e.target.value) || 0)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm font-mono"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Durée (heures)</label>
                <input
                  type="number"
                  min={0.5}
                  step="0.5"
                  value={ivHours}
                  onChange={(e) => setIvHours(Math.max(0.5, Number(e.target.value) || 1))}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm font-mono"
                />
              </div>
            </div>
            <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-4 space-y-1">
              <p className="text-sm font-mono tabular-nums text-slate-900 dark:text-slate-100">
                Débit horaire : <strong>{mlPerHour.toFixed(1)} mL/h</strong>
              </p>
              <p className="text-sm font-mono tabular-nums text-teal-700 dark:text-teal-300">
                Débit en gouttes : <strong>{Math.round(dropsPerMin)} gouttes/min</strong>
              </p>
            </div>
          </div>
        </div>
      )}

      {(tab === 'labo' || tab === 'terminologie' || tab === 'abreviations') && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={toolSearch}
              onChange={(e) => setToolSearch(e.target.value)}
              placeholder="Rechercher dans la table..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100"
            />
          </div>

          {tab === 'labo' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                    <th className="py-2.5 px-3">Domaine</th>
                    <th className="py-2.5 px-3">Paramètre</th>
                    <th className="py-2.5 px-3">Valeurs usuelles</th>
                    <th className="py-2.5 px-3">Note clinique</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {LAB_REFERENCES.filter((r) =>
                    `${r.category} ${r.parameter} ${r.clinicalNote}`.toLowerCase().includes(toolSearch.toLowerCase())
                  ).map((r, i) => (
                    <tr key={i}>
                      <td className="py-2.5 px-3 text-xs text-slate-500 dark:text-slate-400">{r.category}</td>
                      <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-slate-100">{r.parameter}</td>
                      <td className="py-2.5 px-3 font-mono text-xs text-blue-700 dark:text-blue-400">
                        {r.normalRange} {r.unit}
                      </td>
                      <td className="py-2.5 px-3 text-xs text-slate-600 dark:text-slate-300">{r.clinicalNote}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'terminologie' && (
            <div className="grid gap-3 md:grid-cols-2">
              {MEDICAL_TERMINOLOGY.filter((t) =>
                `${t.term} ${t.root} ${t.definition}`.toLowerCase().includes(toolSearch.toLowerCase())
              ).map((t, i) => (
                <div key={i} className="rounded-lg border border-slate-200 dark:border-slate-800 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{t.term}</h3>
                    <span className="text-[11px] font-mono text-teal-700 dark:text-teal-400">{t.root}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{t.definition}</p>
                </div>
              ))}
            </div>
          )}

          {tab === 'abreviations' && (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {MEDICAL_ABBREVIATIONS.filter((a) =>
                `${a.abbr} ${a.full} ${a.context}`.toLowerCase().includes(toolSearch.toLowerCase())
              ).map((a, i) => (
                <div key={i} className="rounded-lg border border-slate-200 dark:border-slate-800 p-3.5">
                  <p className="text-sm font-bold font-mono text-blue-700 dark:text-blue-400">{a.abbr}</p>
                  <p className="text-xs font-medium text-slate-900 dark:text-slate-100 mt-0.5">{a.full}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{a.context}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'anatomie' && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Références anatomiques et physiologiques schématiques
            </h2>
            <div className="flex gap-1.5 p-1 rounded-lg bg-slate-100 dark:bg-slate-800">
              {[
                { id: 'cardiac' as const, label: 'Cœur & ECG' },
                { id: 'nephron' as const, label: 'Néphron' },
                { id: 'respiratory' as const, label: 'Courbe Barcroft' },
              ].map((d) => (
                <button
                  key={d.id}
                  onClick={() => setAnatomyDiagram(d.id)}
                  className={`px-3 py-1 rounded-md text-xs font-medium ${
                    anatomyDiagram === d.id
                      ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
          <MedicalDiagramSVG type={anatomyDiagram} />
        </div>
      )}

      {tab === 'formules' && (
        <div className="grid gap-4 md:grid-cols-3">
          {/* Cockcroft */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <FlaskConical className="w-4 h-4 text-blue-600" />
              Clairance de Cockcroft-Gault
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <label>
                Âge (ans)
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value) || 0)}
                  className="mt-1 w-full rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-1 font-mono"
                />
              </label>
              <label>
                Poids (kg)
                <input
                  type="number"
                  value={fWeight}
                  onChange={(e) => setFWeight(Number(e.target.value) || 0)}
                  className="mt-1 w-full rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-1 font-mono"
                />
              </label>
              <label>
                Créatinine (µmol/L)
                <input
                  type="number"
                  value={creatUmol}
                  onChange={(e) => setCreatUmol(Number(e.target.value) || 1)}
                  className="mt-1 w-full rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-1 font-mono"
                />
              </label>
              <label>
                Sexe
                <select
                  value={sex}
                  onChange={(e) => setSex(e.target.value as 'H' | 'F')}
                  className="mt-1 w-full rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-1"
                >
                  <option value="H">Homme (1,23)</option>
                  <option value="F">Femme (1,04)</option>
                </select>
              </label>
            </div>
            <p className="text-lg font-bold font-mono tabular-nums text-blue-700 dark:text-blue-400">
              {cockcroft.toFixed(1)} mL/min
            </p>
          </div>

          {/* Corrected Sodium */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Natrémie corrigée (hyperglycémie)
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <label>
                Na+ mesurée (mmol/L)
                <input
                  type="number"
                  value={naMeasured}
                  onChange={(e) => setNaMeasured(Number(e.target.value) || 0)}
                  className="mt-1 w-full rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-1 font-mono"
                />
              </label>
              <label>
                Glycémie (g/L)
                <input
                  type="number"
                  step="0.1"
                  value={glyGPerL}
                  onChange={(e) => setGlyGPerL(Number(e.target.value) || 0)}
                  className="mt-1 w-full rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-1 font-mono"
                />
              </label>
            </div>
            <p className="text-lg font-bold font-mono tabular-nums text-teal-700 dark:text-teal-300">
              {naCorrected.toFixed(1)} mmol/L
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Formule : Na mesurée + 1,6 × (Glycémie g/L - 1)
            </p>
          </div>

          {/* Anion Gap */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Trou anionique plasmatique
            </h3>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <label>
                Na+
                <input
                  type="number"
                  value={naVal}
                  onChange={(e) => setNaVal(Number(e.target.value) || 0)}
                  className="mt-1 w-full rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-1 font-mono"
                />
              </label>
              <label>
                Cl-
                <input
                  type="number"
                  value={clVal}
                  onChange={(e) => setClVal(Number(e.target.value) || 0)}
                  className="mt-1 w-full rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-1 font-mono"
                />
              </label>
              <label>
                HCO3-
                <input
                  type="number"
                  value={hco3Val}
                  onChange={(e) => setHco3Val(Number(e.target.value) || 0)}
                  className="mt-1 w-full rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-1 font-mono"
                />
              </label>
            </div>
            <p className="text-lg font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
              {anionGap} mmol/L {anionGap > 16 ? '· ▲ Élevé' : '· Normal (8–16)'}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Formule : Na+ - (Cl- + HCO3-)
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
