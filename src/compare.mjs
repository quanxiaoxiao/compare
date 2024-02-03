import Ajv from 'ajv';
import _ from 'lodash';
import generateLogics from './generateLogics.mjs';

const validateExpress = (new Ajv()).compile({
  oneOf: [
    {
      type: 'array',
      items: {
        type: 'object',
      },
    },
    {
      type: 'object',
    },
  ],
});

export default (express) => {
  if (!validateExpress(express)) {
    throw new Error('express invalid');
  }
  const logicList = [];
  if (Array.isArray(express)) {
    for (let i = 0; i < express.length; i++) {
      const and = generateLogics(express[i]);
      if (and) {
        logicList.push(and);
      }
    }
  } else {
    const and = generateLogics(express);
    if (and) {
      logicList.push(and);
    }
  }
  if (_.isEmpty(logicList)) {
    return () => true;
  }
  return (obj) => {
    if (!_.isPlainObject(obj)) {
      return false;
    }
    return logicList.some((and) => and.every((expressItem) => {
      const dataValue = _.get(obj, expressItem.dataKey);
      return expressItem.match(dataValue, obj);
    }));
  };
};
