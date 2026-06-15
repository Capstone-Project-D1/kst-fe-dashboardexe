const PROGRAM_STUDI_LABELS = {
  sistemInformasi: "Sistem Informasi",
  teknologiInformasi: "Teknologi Informasi",
  teknikKomputer: "Teknik Komputer",
  pendidikanTeknologiInformasi: "Pendidikan Teknologi Informasi",
  teknikInformatika: "Teknik Informatika",
} as const;

type RecognizedProgramStudi =
  (typeof PROGRAM_STUDI_LABELS)[keyof typeof PROGRAM_STUDI_LABELS];

const PROGRAM_STUDI_BADGE_CLASSES: Record<RecognizedProgramStudi, string> = {
  "Teknik Informatika": "bg-sky-400 border-sky-500 text-white",
  "Teknik Komputer": "bg-amber-400 border-amber-500 text-white",
  "Teknologi Informasi": "bg-emerald-400 border-emerald-500 text-white",
  "Sistem Informasi": "bg-orange-400 border-orange-500 text-white",
  "Pendidikan Teknologi Informasi": "bg-rose-400 border-rose-500 text-white",
};

const NEUTRAL_PROGRAM_STUDI_BADGE_CLASS = "bg-gray-200 border-gray-300 text-gray-700";

function normalizeText(value: unknown) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function compactText(value: string) {
  return value.replace(/\s/g, "");
}

function words(value: string) {
  return value.split(" ").filter(Boolean);
}

function wordInitials(value: string) {
  return words(value)
    .map((word) => word[0])
    .join("");
}

function levenshteinDistance(left: string, right: string) {
  const previous = Array.from({ length: right.length + 1 }, (_, index) => index);

  for (let leftIndex = 0; leftIndex < left.length; leftIndex += 1) {
    const current = [leftIndex + 1];

    for (let rightIndex = 0; rightIndex < right.length; rightIndex += 1) {
      const cost = left[leftIndex] === right[rightIndex] ? 0 : 1;
      current[rightIndex + 1] = Math.min(
        current[rightIndex] + 1,
        previous[rightIndex + 1] + 1,
        previous[rightIndex] + cost,
      );
    }

    previous.splice(0, previous.length, ...current);
  }

  return previous[right.length];
}

function matchesAlias(normalizedValue: string, aliases: readonly string[]) {
  return aliases.includes(normalizedValue);
}

function isNearOfficialName(normalizedValue: string, officialName: string) {
  return levenshteinDistance(compactText(normalizedValue), compactText(officialName)) <= 2;
}

function isNearWord(value: string, target: string) {
  if (!value) return false;
  if (value.includes(target) || target.includes(value)) return true;

  const maxDistance = Math.max(1, Math.floor(target.length * 0.35));
  return levenshteinDistance(value, target) <= maxDistance;
}

function hasWordLike(normalizedValue: string, targets: readonly string[]) {
  return words(normalizedValue).some((word) =>
    targets.some((target) => isNearWord(word, target)),
  );
}

function hasAnyInitialPattern(normalizedValue: string, patterns: readonly string[]) {
  const initials = wordInitials(normalizedValue);
  return patterns.some((pattern) => initials.startsWith(pattern));
}

export function normalizeProgramStudi(value: unknown) {
  const originalValue = String(value ?? "").trim();
  const normalizedValue = normalizeText(originalValue);

  if (!normalizedValue) return originalValue;

  if (
    matchesAlias(normalizedValue, ["si", "sisfo", "sistem info", "sistem informasi"]) ||
    isNearOfficialName(normalizedValue, "sistem informasi") ||
    hasAnyInitialPattern(normalizedValue, ["si"]) ||
    (hasWordLike(normalizedValue, ["sistem", "sisfo"]) &&
      hasWordLike(normalizedValue, ["informasi", "info"]))
  ) {
    return PROGRAM_STUDI_LABELS.sistemInformasi;
  }

  if (
    matchesAlias(normalizedValue, [
      "ti",
      "teknologi info",
      "tekno informasi",
      "teknologi informasi",
    ]) ||
    isNearOfficialName(normalizedValue, "teknologi informasi") ||
    (hasWordLike(normalizedValue, ["teknologi", "tekno"]) &&
      hasWordLike(normalizedValue, ["informasi", "info"]))
  ) {
    return PROGRAM_STUDI_LABELS.teknologiInformasi;
  }

  if (
    matchesAlias(normalizedValue, ["tk", "teknik komputer", "teknik komp"]) ||
    isNearOfficialName(normalizedValue, "teknik komputer") ||
    hasAnyInitialPattern(normalizedValue, ["tk"]) ||
    (hasWordLike(normalizedValue, ["teknik"]) &&
      hasWordLike(normalizedValue, ["komputer", "komp"]))
  ) {
    return PROGRAM_STUDI_LABELS.teknikKomputer;
  }

  if (
    matchesAlias(normalizedValue, [
      "pti",
      "pendidikan teknologi informasi",
      "pend teknologi informasi",
      "pendidikan teknologi info",
    ]) ||
    isNearOfficialName(normalizedValue, "pendidikan teknologi informasi") ||
    hasAnyInitialPattern(normalizedValue, ["pti"]) ||
    (hasWordLike(normalizedValue, ["pendidikan", "pend"]) &&
      hasWordLike(normalizedValue, ["teknologi", "tekno"]) &&
      hasWordLike(normalizedValue, ["informasi", "info"]))
  ) {
    return PROGRAM_STUDI_LABELS.pendidikanTeknologiInformasi;
  }

  if (
    matchesAlias(normalizedValue, ["if", "tif", "informatika", "teknik informatika"]) ||
    isNearOfficialName(normalizedValue, "teknik informatika") ||
    hasAnyInitialPattern(normalizedValue, ["tif", "ti"]) ||
    (hasWordLike(normalizedValue, ["teknik"]) &&
      hasWordLike(normalizedValue, ["informatika", "informasi", "info"]))
  ) {
    return PROGRAM_STUDI_LABELS.teknikInformatika;
  }

  return originalValue;
}

export function getProgramStudiBadgeClass(value: unknown) {
  const programStudi = normalizeProgramStudi(value);

  return (
    PROGRAM_STUDI_BADGE_CLASSES[programStudi as RecognizedProgramStudi] ??
    NEUTRAL_PROGRAM_STUDI_BADGE_CLASS
  );
}
