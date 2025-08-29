function flattenObject(obj, prefix = '') {
  let result = {};
  
  for (let key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
          // Recursively flatten nested objects
          Object.assign(result, flattenObject(obj[key], key));
      } else {
          result[key] = obj[key];
      }
  }

  return result;
}

export default function getAllLinks(data) {
  const parsedArray = [];
  for (const link of data) {
    parsedArray.push(flattenObject(link));
  }
  return parsedArray;
}