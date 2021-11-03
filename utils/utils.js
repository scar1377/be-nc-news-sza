exports.convertValuesToNumber = (objArr, keyName) => {
  const newObjArr = objArr.map((item) => {
    item[keyName] = parseInt(item[keyName]);
    return item;
  });
  return newObjArr;
};

exports.renameKey = (obj, keyToChange, newKey) => {
  const newObj = { ...obj };
  newObj[newKey] = newObj[keyToChange];
  delete newObj[keyToChange];
  return newObj;
};
