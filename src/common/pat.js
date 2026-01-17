// @ts-check

const PAT_KEY_REGEX = /^PAT_(\d+)$/i;
const PAT_ALIAS_KEYS = ["GITHUB_TOKEN", "GH_TOKEN", "GITHUB_PAT", "GH_PAT"];

/**
 * Read PAT entries from process.env, allowing case-insensitive keys and ordering
 * them by numeric suffix (PAT_1, PAT_2, ...).
 *
 * @returns {{ key: string, value: string, index: number }[]} PAT entries.
 */
const getPatEntries = () => {
  const entries = Object.entries(process.env)
    .map(([key, value]) => {
      const match = key.match(PAT_KEY_REGEX);
      if (!match) {
        return null;
      }

      const index = Number.parseInt(match[1], 10);
      if (!Number.isFinite(index)) {
        return null;
      }

      return {
        key,
        value: value || "",
        index,
      };
    })
    .filter((entry) => entry && entry.value);

  const maxIndex = entries.reduce(
    (max, entry) => Math.max(max, entry.index),
    0,
  );

  const aliasEntries = PAT_ALIAS_KEYS.map((key, offset) => {
    const value = process.env[key];
    if (!value) {
      return null;
    }

    return {
      key,
      value,
      index: maxIndex + offset + 1,
    };
  }).filter(Boolean);

  return [...entries, ...aliasEntries].sort((a, b) => a.index - b.index);
};

/**
 * Get PAT keys discovered in the environment.
 *
 * @returns {string[]} The ordered PAT keys.
 */
const getPatKeys = () => {
  return getPatEntries().map((entry) => entry.key);
};

/**
 * Get PAT token values discovered in the environment.
 *
 * @returns {string[]} The ordered PAT tokens.
 */
const getPatTokens = () => {
  return getPatEntries().map((entry) => entry.value);
};

export { getPatEntries, getPatKeys, getPatTokens };
