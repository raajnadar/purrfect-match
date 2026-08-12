// The GitHub Pages site is served from a sub-path:
// https://raajnadar.github.io/purrfect-match/
//
// `experiments.baseUrl` prefixes every asset URL, and it applies to all
// platforms. The native builds and the EAS updates must keep an empty base URL,
// so the web deploy workflow sets EXPO_BASE_URL and nothing else does.
module.exports = ({ config }) => {
  const baseUrl = process.env.EXPO_BASE_URL;

  if (!baseUrl) {
    return config;
  }

  return {
    ...config,
    experiments: { ...config.experiments, baseUrl },
  };
};
