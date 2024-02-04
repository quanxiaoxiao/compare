import _ from 'lodash';
import generateLogics from './generateLogics.mjs';

const validate = (arr, obj) => arr.every((match) => match(obj));

export default (express) => {
  if (!Array.isArray(express) && !_.isPlainObject(express)) {
    throw new Error('express invalid');
  }
  if (_.isEmpty(express)) {
    return () => true;
  }
  if (_.isPlainObject(express)) {
    const arr = generateLogics(express);
    return (obj) => validate(arr, obj);
  }
  const logicList = [];
  for (let i = 0; i < express.length; i++) {
    logicList.push(generateLogics(express[i]));
  }
  return (obj) => logicList.some((arr) => validate(arr, obj));
};
