const EMPTY_PATTERNS = /^(none|n\/?a|na|no|nope|nothing|nil|not applicable|-)$/i;

export function hasRealAllergy(value?: string): boolean {
  if (!value) return false;
  const trimmed = value.trim();
  if (trimmed.length === 0) return false;
  return !EMPTY_PATTERNS.test(trimmed);
}
