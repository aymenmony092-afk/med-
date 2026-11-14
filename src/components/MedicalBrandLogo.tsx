import React from 'react';

export const MedicalBrandLogo: React.FC<{ size?: number; className?: string }> = ({
  size = 36,
  className = '',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Logo MED DZ — Blouse médicale et stéthoscope"
  >
    <rect width="64" height="64" rx="14" fill="#0B63CE" />
    {/* White medical coat lapels */}
    <path
      d="M18 16L32 23L46 16L51 28L44 31L42 50H22L20 31L13 28L18 16Z"
      fill="#FFFFFF"
    />
    <path d="M23 18L32 42L41 18L36 16L32 23L28 16L23 18Z" fill="#E2E8F0" />
    {/* Turquoise stethoscope */}
    <path
      d="M24 17C22 26 24 36 32 36C40 36 42 26 40 17"
      stroke="#0D9488"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M32 36C32 44 41 47 45 42C48 38 46 33 43 32"
      stroke="#0D9488"
      strokeWidth="2.8"
      strokeLinecap="round"
    />
    <circle cx="43" cy="31" r="4.5" fill="#FFFFFF" stroke="#0D9488" strokeWidth="2.2" />
    <circle cx="43" cy="31" r="1.5" fill="#0B63CE" />
    <circle cx="24" cy="16" r="1.8" fill="#0F172A" />
    <circle cx="40" cy="16" r="1.8" fill="#0F172A" />
  </svg>
);

export const MedicalDiagramSVG: React.FC<{
  type: 'cardiac' | 'nephron' | 'respiratory' | 'neuro' | 'endocrine' | 'metabolic' | 'anatomy' | 'none';
}> = ({ type }) => {
  if (type === 'none') return null;

  if (type === 'cardiac') {
    return (
      <svg viewBox="0 0 560 220" className="w-full h-auto rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2">
        <text x="16" y="24" className="fill-slate-800 dark:fill-slate-100 text-[13px] font-semibold">
          Schéma hémodynamique & ECG — Cycle cardiaque et territoires coronaires
        </text>
        {/* Left & Right Heart schematic */}
        <rect x="24" y="42" width="105" height="72" rx="8" className="fill-blue-50 dark:fill-blue-950/60 stroke-blue-600" strokeWidth="1.5" />
        <text x="76" y="72" textAnchor="middle" className="fill-blue-800 dark:fill-blue-200 text-[11px] font-semibold">Oreillette D</text>
        <text x="76" y="90" textAnchor="middle" className="fill-slate-500 dark:fill-slate-400 text-[10px]">Retour veineux</text>

        <rect x="24" y="124" width="105" height="74" rx="8" className="fill-blue-100 dark:fill-blue-900/50 stroke-blue-700" strokeWidth="1.5" />
        <text x="76" y="156" textAnchor="middle" className="fill-blue-900 dark:fill-blue-100 text-[11px] font-semibold">Ventricule D</text>
        <text x="76" y="174" textAnchor="middle" className="fill-slate-500 dark:fill-slate-400 text-[10px]">V3R – V4R</text>

        <rect x="148" y="42" width="105" height="72" rx="8" className="fill-teal-50 dark:fill-teal-950/50 stroke-teal-600" strokeWidth="1.5" />
        <text x="200" y="72" textAnchor="middle" className="fill-teal-800 dark:fill-teal-200 text-[11px] font-semibold">Oreillette G</text>
        <text x="200" y="90" textAnchor="middle" className="fill-slate-500 dark:fill-slate-400 text-[10px]">Veines pulm.</text>

        <rect x="148" y="124" width="105" height="74" rx="8" className="fill-teal-100 dark:fill-teal-900/50 stroke-teal-700" strokeWidth="1.5" />
        <text x="200" y="156" textAnchor="middle" className="fill-teal-900 dark:fill-teal-100 text-[11px] font-semibold">Ventricule G</text>
        <text x="200" y="174" textAnchor="middle" className="fill-slate-500 dark:fill-slate-400 text-[10px]">IVA · Cx · CD</text>

        {/* ECG Trace */}
        <path
          d="M280 130 L315 130 Q325 114 335 130 L352 130 L358 142 L368 68 L378 158 L386 130 L412 130 Q430 105 450 130 L530 130"
          fill="none"
          stroke="#0B63CE"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <text x="325" y="106" textAnchor="middle" className="fill-slate-600 dark:fill-slate-300 text-[10px]">P</text>
        <text x="368" y="56" textAnchor="middle" className="fill-slate-800 dark:fill-slate-100 text-[10px] font-semibold">QRS</text>
        <text x="431" y="98" textAnchor="middle" className="fill-teal-700 dark:fill-teal-300 text-[10px] font-semibold">Segment ST / Onde T</text>
        <text x="285" y="185" className="fill-slate-500 dark:fill-slate-400 text-[10px]">Qc = FC × VES · Perfusion coronaire diastolique</text>
      </svg>
    );
  }

  if (type === 'nephron') {
    return (
      <svg viewBox="0 0 560 210" className="w-full h-auto rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2">
        <text x="16" y="24" className="fill-slate-800 dark:fill-slate-100 text-[13px] font-semibold">
          Néphron fonctionnel — Sites de réabsorption et d’action des diurétiques
        </text>
        <circle cx="65" cy="95" r="28" className="fill-blue-100 dark:fill-blue-900/50 stroke-blue-600" strokeWidth="2" />
        <text x="65" y="93" textAnchor="middle" className="fill-blue-900 dark:fill-blue-100 text-[10px] font-semibold">Glomérule</text>
        <text x="65" y="106" textAnchor="middle" className="fill-slate-600 dark:fill-slate-300 text-[9px]">DFG 120 mL/m</text>

        <path d="M93 95 L195 95 L195 165 L295 165 L295 95 L415 95 L415 178" fill="none" stroke="#0D9488" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="112" y="52" width="110" height="32" rx="6" className="fill-white dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-700" />
        <text x="167" y="67" textAnchor="middle" className="fill-slate-800 dark:fill-slate-100 text-[10px] font-semibold">TCP (65 % Na+)</text>
        <text x="167" y="79" textAnchor="middle" className="fill-slate-500 dark:fill-slate-400 text-[9px]">100 % glucose</text>

        <rect x="180" y="172" width="130" height="28" rx="6" className="fill-white dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-700" />
        <text x="245" y="189" textAnchor="middle" className="fill-slate-800 dark:fill-slate-100 text-[10px] font-semibold">Anse de Henlé (Furosémide)</text>

        <rect x="305" y="52" width="120" height="32" rx="6" className="fill-white dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-700" />
        <text x="365" y="67" textAnchor="middle" className="fill-slate-800 dark:fill-slate-100 text-[10px] font-semibold">TCD (Thiazidiques)</text>
        <text x="365" y="79" textAnchor="middle" className="fill-slate-500 dark:fill-slate-400 text-[9px]">Macula densa</text>

        <rect x="430" y="110" width="115" height="44" rx="6" className="fill-white dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-700" />
        <text x="487" y="128" textAnchor="middle" className="fill-slate-800 dark:fill-slate-100 text-[10px] font-semibold">Tube collecteur</text>
        <text x="487" y="143" textAnchor="middle" className="fill-teal-700 dark:fill-teal-300 text-[9px]">ADH (AQP2) · Aldostérone</text>
      </svg>
    );
  }

  if (type === 'respiratory') {
    return (
      <svg viewBox="0 0 560 210" className="w-full h-auto rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2">
        <text x="16" y="24" className="fill-slate-800 dark:fill-slate-100 text-[13px] font-semibold">
          Courbe de dissociation de l’oxyhémoglobine (Barcroft) & Effet Bohr
        </text>
        <line x1="60" y1="170" x2="290" y2="170" stroke="#64748B" strokeWidth="1.5" />
        <line x1="60" y1="45" x2="60" y2="170" stroke="#64748B" strokeWidth="1.5" />
        {/* Normal sigmoidal curve */}
        <path d="M60 170 C95 168 115 115 140 82 C165 55 215 50 280 48" fill="none" stroke="#0B63CE" strokeWidth="2.5" />
        {/* Right-shifted Bohr curve */}
        <path d="M60 170 C110 168 135 128 165 98 C195 68 235 55 280 50" fill="none" stroke="#0D9488" strokeWidth="2" strokeDasharray="5 4" />
        <text x="175" y="188" textAnchor="middle" className="fill-slate-500 dark:fill-slate-400 text-[10px]">PaO2 (mmHg) · P50 ≈ 26,8 mmHg</text>
        <text x="38" y="110" textAnchor="middle" transform="rotate(-90 38 110)" className="fill-slate-500 dark:fill-slate-400 text-[10px]">SaO2 (%)</text>
        <rect x="315" y="54" width="220" height="110" rx="8" className="fill-white dark:fill-slate-800 stroke-slate-200 dark:stroke-slate-700" />
        <text x="328" y="76" className="fill-teal-700 dark:fill-teal-300 text-[11px] font-semibold">Déplacement vers la droite (Bohr)</text>
        <text x="328" y="96" className="fill-slate-600 dark:fill-slate-300 text-[10px]">• Baisse du pH (acidose)</text>
        <text x="328" y="113" className="fill-slate-600 dark:fill-slate-300 text-[10px]">• Hausse de la PaCO2</text>
        <text x="328" y="130" className="fill-slate-600 dark:fill-slate-300 text-[10px]">• Hyperthermie / Fièvre</text>
        <text x="328" y="147" className="fill-slate-600 dark:fill-slate-300 text-[10px]">• Augmentation du 2,3-DPG</text>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 560 170" className="w-full h-auto rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2">
      <text x="16" y="24" className="fill-slate-800 dark:fill-slate-100 text-[13px] font-semibold">
        Repère schématique — Corrélation anatomo-clinique et physiopathologique
      </text>
      <rect x="24" y="45" width="155" height="95" rx="8" className="fill-blue-50 dark:fill-blue-950/50 stroke-blue-600" strokeWidth="1.5" />
      <text x="101" y="84" textAnchor="middle" className="fill-blue-900 dark:fill-blue-100 text-[11px] font-semibold">Structure / Étiologie</text>
      <text x="101" y="103" textAnchor="middle" className="fill-slate-600 dark:fill-slate-300 text-[10px]">Cible anatomique ou cellulaire</text>

      <path d="M185 92 L212 92" stroke="#0D9488" strokeWidth="2.5" markerEnd="url(#arrow)" />
      <rect x="218" y="45" width="155" height="95" rx="8" className="fill-teal-50 dark:fill-teal-950/50 stroke-teal-600" strokeWidth="1.5" />
      <text x="295" y="84" textAnchor="middle" className="fill-teal-900 dark:fill-teal-100 text-[11px] font-semibold">Mécanisme clé</text>
      <text x="295" y="103" textAnchor="middle" className="fill-slate-600 dark:fill-slate-300 text-[10px]">Voie métabolique ou déficit</text>

      <path d="M378 92 L405 92" stroke="#0D9488" strokeWidth="2.5" />
      <rect x="410" y="45" width="130" height="95" rx="8" className="fill-white dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-700" strokeWidth="1.5" />
      <text x="475" y="84" textAnchor="middle" className="fill-slate-900 dark:fill-slate-100 text-[11px] font-semibold">Décision clinique</text>
      <text x="475" y="103" textAnchor="middle" className="fill-slate-500 dark:fill-slate-400 text-[10px]">Examen & Traitement</text>
    </svg>
  );
};
