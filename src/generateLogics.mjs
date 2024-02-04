import assert from 'node:assert';
import Ajv from 'ajv';
import _ from 'lodash';
import ops from './ops.mjs';

const getOpName = (dataKey, express) => {
  const opNames = Object.keys(express);
  if (opNames.length !== 1) {
    throw new Error(`\`${dataKey}\` invalid op express, \`${JSON.stringify(express)}\``);
  }
  const opName = opNames[0];
  if (opName === '$or' || opName === '$and' || opName === '$nor') {
    return opName;
  }
  if (!ops[opName]) {
    throw new Error(`\`${dataKey}\` invalid op with \`${opName}\``);
  }
  return opName;
};

const checkValueCompareValid = (dataKey, opName, schema, valueCompare) => {
  const validate = new Ajv().compile(schema);
  if (!validate(valueCompare)) {
    throw new Error(`\`${dataKey}\` \`${opName}\` compare value \`${JSON.stringify(valueCompare)}\` invalid, \`${JSON.stringify(validate.errors)}\``);
  }
};

const generateMatch = (dataKey, opName, valueCompare) => {
  if (opName === '$or' || opName === '$and' || opName === '$nor') {
    if (!Array.isArray(valueCompare)) {
      throw new Error(`\`${dataKey}\` \`${opName}\` compare value is not array`);
    }
    if (valueCompare.length === 0) {
      throw new Error(`\`${dataKey}\` \`${opName}\` compare value is empty`);
    }
    const arr = [];
    for (let i = 0; i < valueCompare.length; i++) {
      const express = valueCompare[i];
      const subOpName = getOpName(dataKey, express);
      if (['$or', '$and', '$nor'].includes(subOpName)) {
        throw new Error(`\`${dataKey}\` \`${opName}\` sub op invalid`);
      }
      const subCompareValue = express[subOpName];
      const { schema, fn } = ops[subOpName];
      checkValueCompareValid(dataKey, subOpName, schema, subCompareValue);
      arr.push(fn(subCompareValue));
    }
    return {
      dataKey,
      match: (v) => {
        if (opName === '$and') {
          return arr.every((match) => match(v));
        }
        if (opName === '$or') {
          return arr.some((match) => match(v));
        }
        return !arr.some((match) => match(v));
      },
    };
  }
  const { schema, fn } = ops[opName];
  checkValueCompareValid(dataKey, opName, schema, valueCompare);
  return {
    dataKey,
    match: fn(valueCompare),
  };
};

export default (express) => {
  assert(_.isPlainObject(express));
  const result = [];
  const dataKeys = Object.keys(express);
  for (let i = 0; i < dataKeys.length; i++) {
    const dataKey = dataKeys[i];
    const valueMatch = express[dataKey];
    if (_.isPlainObject(valueMatch)) {
      const opName = getOpName(dataKey, valueMatch);
      result.push(generateMatch(dataKey, opName, valueMatch[opName]));
    } else {
      if (valueMatch != null && !['number', 'string', 'boolean'].includes(typeof valueMatch)) {
        throw new Error(`\`${dataKey}\` value match \`${JSON.stringify(valueMatch)}\` invalid`);
      }
      result.push({
        dataKey,
        match: ops.$eq.fn(valueMatch),
      });
    }
  }
  return result;
};
