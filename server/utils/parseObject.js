const parseObject = (obj)=>{
    const newObj = JSON.parse(JSON.stringify(obj), (key, value) =>
        typeof value === 'object' ? value : value.trim()
      );
      return newObj;
}

module.exports = parseObject