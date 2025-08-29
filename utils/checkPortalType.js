export default function checkPortalType(url) {
  // decide current portal is alpha, beta or production.
  if (url.includes("alpha")) {
    return "alpha";
  }

  if (url.includes("beta")) {
    return "beta";
  }

  return "production";
}
