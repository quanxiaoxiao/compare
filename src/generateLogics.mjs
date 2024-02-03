import assert from 'node:assert';
import Ajv from 'ajv';
import _ from 'lodash';
import ops from './ops.mjs';

const oneOf = Object.keys(ops).map((opName) => ({
  properties: {
    [opName]: ops[opName].schema,
  },
  required: [opName],
  additionalProperties: false,
}));

const generateCompare = (opName, valueMatch, dataKey) => {
  const opItem = ops[opName];
  if (!opItem) {
    throw new Error(`\`${dataKey}\` invalid op \`${opName}\``);
  }
  if (opItem.schema) {
    const ajv = new Ajv({
      strict: false,
    });
    const validate = ajv.compile(opItem.schema);
    if (!validate(valueMatch[opName])) {
      throw new Error(`\`${dataKey}\` invalid op, \`${JSON.stringify(validate.errors)}\``);
    }
  }
  return opItem.fn(valueMatch[opName]);
};

const validateOpList = (new Ajv({ strict: false })).compile({
  type: 'array',
  items: {
    type: 'object',
    oneOf,
  },
  minItems: 1,
});

const generateOpMatch = (opName, valueMatch, dataKey) => {
  if (opName === '$and' || opName === '$or') {
    if (!validateOpList(valueMatch[opName])) {
      throw new Error(`\`${dataKey}\` invalid op, \`${JSON.stringify(validateOpList.errors)}\``);
    }
    const compareList = [];
    for (let i = 0; i < valueMatch[opName].length; i++) {
      const matchItem = valueMatch[opName][i];
      const compare = generateCompare(Object.keys(matchItem)[0], matchItem, dataKey);
      compareList.push(compare);
    }
    if (_.isEmpty(compareList)) {
      return null;
    }
    if (opName === '$and') {
      return (v, d) => compareList.every((match) => match(v, d));
    }
    return (v, d) => compareList.some((match) => match(v, d));
  }
  const compare = generateCompare(opName, valueMatch, dataKey);
  return (v, d) => compare(v, d);
};

const validateOp = (new Ajv({ strict: false })).compile({
  type: 'object',
  properties: {
    ...oneOf.reduce((acc, schemaItem) => ({
      ...acc,
      ...schemaItem.properties,
    }), {}),
    $and: {
      type: 'array',
      items: {
        type: 'object',
        oneOf,
      },
      minItems: 1,
    },
    $or: {
      type: 'array',
      items: {
        type: 'object',
        oneOf,
      },
      minItems: 1,
    },
  },
  additionalProperties: false,
});

export default (express) => {
  assert(_.isPlainObject(express));
  const every = [];
  const dataKeys = Object.keys(express);
  for (let i = 0; i < dataKeys.length; i++) {
    const dataKey = dataKeys[i];
    const valueMatch = express[dataKey];
    if (_.isPlainObject(valueMatch)) {
      const opNames = Object.keys(valueMatch);
      if (opNames.length !== 1) {
        throw new Error(`\`${dataKey}\` invalid op express, \`${JSON.stringify(valueMatch)}\``);
      }
      const opName = opNames[0];
      if (!ops[opName]) {
        throw new Error(`\`${dataKey}\` invalid op with \`${opName}\``);
      }
      if (opName === '$not') {
        if (!validateOp(valueMatch.$not)) {
          throw new Error(`$not \`${dataKey}\` invalid op, \`${JSON.stringify(validateOp.errors)}\``);
        }
        const _opName = Object.keys(valueMatch.$not)[0];
        const compare = generateOpMatch(
          _opName,
          valueMatch.$not,
          dataKey,
        );
        if (compare) {
          every.push({
            dataKey,
            match: (d) => !compare(d),
          });
        }
      } else {
        const { schema, fn } = ops[opName];
        const validateCompareValue = new Ajv().compile(schema);
        const valueCompare = valueMatch[opName];
        if (!validateCompareValue(valueCompare)) {
          throw new Error(`\`${dataKey}\` compare value invalid, \`${JSON.stringify(validateCompareValue.errors)}\``);
        }
        every.push({
          dataKey,
          match: fn(valueCompare),
        });
      }
    } else {
      if (valueMatch != null && !['number', 'string', 'boolean'].includes(typeof valueMatch)) {
        throw new Error(`\`${dataKey}\` value match \`${JSON.stringify(valueMatch)}\` invalid`);
      }
      every.push({
        dataKey,
        match: ops.$eq.fn(valueMatch),
      });
    }
  }
  return every;
};
