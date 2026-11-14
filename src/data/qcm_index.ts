import type { QCMQuestion, SpecialtyName } from '../types/med';
import { MEDICAL_QCMS } from './qcm_medical';
import { PRECLINICAL_QCMS } from './qcm_preclinical';
import { SPECIALTIES_QCMS } from './qcm_specialties';

export const ALL_SPECIALTIES: SpecialtyName[] = [
  'Anatomie',
  'Physiologie',
  'Biochimie',
  'Histologie',
  'Embryologie',
  'Pharmacologie',
  'Microbiologie',
  'Immunologie',
  'Pathologie',
  'Cardiologie',
  'Pneumologie',
  'Neurologie',
  'Gastro-entérologie',
  'Néphrologie',
  'Endocrinologie',
  'Hématologie',
  'Infectiologie',
  'Pédiatrie',
  'Gynécologie-obstétrique',
  'Chirurgie',
  'Médecine interne',
  'Urgences et Réanimation',
];

export const CURATED_QCMS: QCMQuestion[] = [
  ...PRECLINICAL_QCMS,
  ...MEDICAL_QCMS,
  ...SPECIALTIES_QCMS,
];
