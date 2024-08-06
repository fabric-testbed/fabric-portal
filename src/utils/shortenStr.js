export default function shortenStr(str, maxLen, separator = ' ') {
  console.log(maxLen)
  if (str.length <= maxLen) return str;
  return str.substr(0, str.lastIndexOf(separator, maxLen)) + "...";
}
