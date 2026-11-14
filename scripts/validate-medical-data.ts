import { HISTORICAL_ARCHIVES } from '../src/data/archives';
import { CURATED_QCMS } from '../src/data/qcm_index';

const errors: string[] = [];
const questionIds = new Set<string>();

for (const question of CURATED_QCMS) {
  if (questionIds.has(question.id)) errors.push(`Duplicate QCM id: ${question.id}`);
  questionIds.add(question.id);

  if (!Array.isArray(question.choices) || question.choices.length !== 5) {
    errors.push(`QCM ${question.id} must have exactly five choices.`);
  }
  if (!Number.isInteger(question.correctIndex) || question.correctIndex < 0 || question.correctIndex > 4) {
    errors.push(`QCM ${question.id} has an invalid correctIndex.`);
  }
  if (!question.explanation?.trim()) errors.push(`QCM ${question.id} has no explanation.`);
  if (!question.reference?.trim()) errors.push(`QCM ${question.id} has no academic reference label.`);
}

for (const archive of HISTORICAL_ARCHIVES) {
  const isAvailable =
    archive.availability === 'SERIE_PEDAGOGIQUE' ||
    archive.availability === 'ANNALE_OFFICIELLE_VERIFIEE';

  if (isAvailable && archive.questionCount !== archive.linkedQuestionIds.length) {
    errors.push(`Archive ${archive.id}: questionCount does not match linkedQuestionIds.`);
  }
  if (!isAvailable && (archive.questionCount !== 0 || archive.linkedQuestionIds.length !== 0)) {
    errors.push(`Archive ${archive.id}: unavailable record must not expose local questions.`);
  }

  for (const id of archive.linkedQuestionIds) {
    if (!questionIds.has(id)) errors.push(`Archive ${archive.id} links missing QCM ${id}.`);
  }

  if (
    archive.availability === 'SERIE_PEDAGOGIQUE' &&
    !/non extraite|ne constituent pas une annale/i.test(archive.sourceNote)
  ) {
    errors.push(`Archive ${archive.id} must explicitly state that its series is not an official past paper.`);
  }
}

if (errors.length > 0) {
  console.error('MED DZ data validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  const practiceSeries = HISTORICAL_ARCHIVES.filter((item) => item.availability === 'SERIE_PEDAGOGIQUE').length;
  const unavailableOfficialSessions = HISTORICAL_ARCHIVES.filter((item) => item.availability === 'INDISPONIBLE_LOCALEMENT').length;
  console.log(
    `MED DZ data validation passed: ${CURATED_QCMS.length} QCM, ${practiceSeries} pedagogical series, ${unavailableOfficialSessions} unavailable official sessions.`
  );
}
