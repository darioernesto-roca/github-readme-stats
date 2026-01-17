// @ts-check

const PAT_KEY_REGEX = /^PAT_(\d+)$/i;

/**
 * Read PAT entries from process.env, allowing case-insensitive keys and ordering
 * them by numeric suffix (PAT_1, PAT_2, ...).
 *
 * @returns {{ key: string, value: string, index: number }[]} PAT entries.
 */
const getPatEntries = () => {
  return Object.entries(process.env)
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
    .filter((entry) => entry && entry.value)
    .sort((a, b) => a.index - b.index);
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
