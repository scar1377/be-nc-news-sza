exports.convertValuesToNumber = (objArr, keyName) => {
  const newObjArr = objArr.map((item) => {
    item[keyName] = parseInt(item[keyName]);
    return item;
  });
  return newObjArr;
};
