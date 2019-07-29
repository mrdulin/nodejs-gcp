function parseContextFromHeader(str) {
  if (!str) {
    return null;
  }
  const matches = str.match(/^([0-9a-fA-F]+)(?:\/([0-9]+))(?:;o=(.*))?/);
  if (!matches || matches.length !== 4 || matches[0] !== str || (matches[2] && isNaN(Number(matches[2])))) {
    return null;
  }
  return {
    traceId: matches[1],
    spanId: matches[2],
    options: isNaN(Number(matches[3])) ? undefined : Number(matches[3])
  };
}

module.exports = { parseContextFromHeader };
