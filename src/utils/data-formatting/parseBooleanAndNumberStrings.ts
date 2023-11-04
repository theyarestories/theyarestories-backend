function isObject(data: any): Boolean {
  return data && data.constructor === Object;
}

export default function parseNumbersAndBooleans(data: any): object {
  const newObject = Object.assign({}, data);

  for (const key in data) {
    const value = newObject[key];

    if (!isNaN(Number(value))) {
      newObject[key] = Number(value);
    } else if (["true", "false"].includes(value)) {
      newObject[key] = JSON.parse(value);
    } else if (isObject(value)) {
      newObject[key] = parseNumbersAndBooleans(value);
    }
  }

  return newObject;
}
