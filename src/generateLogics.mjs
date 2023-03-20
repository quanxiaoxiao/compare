import Ajv from 'ajv';
import _ from 'lodash';

const normalTypes = ['number', 'string', 'boolean', 'null'];

// '$nor',

const ops = {
  $ne: {
    schema: {
      type: normalTypes,
    },
    fn: (a) => (v) => {
      if (a == null) {
        return v != null;
      }
      return v !== a;
    },
  },
  $eq: {
    schema: {
      type: normalTypes,
    },
    fn: (a) => (v) => {
      if (a == null) {
        return v == null;
      }
      return v === a;
    },
  },
  $gt: {
    schema: {
      type: 'number',
      nullable: false,
    },
    fn: (a) => (v) => v > a,
  },
  $lt: {
    schema: {
      type: 'number',
      nullable: false,
    },
    fn: (a) => (v) => v < a,
  },
  $lte: {
    schema: {
      type: 'number',
      nullable: false,
    },
    fn: (a) => (v) => v === a || v < a,
  },
  $gte: {
    schema: {
      type: 'number',
      nullable: false,
    },
    fn: (a) => (v) => v === a || v > a,
  },
  $in: {
    schema: {
      type: 'array',
      items: {
        type: ['string', 'number', 'null'],
      },
      minItems: 1,
      uniqueItems: true,
    },
    fn: (a) => (v) => a.includes(v),
  },
  $nin: {
    schema: {
      type: 'array',
      items: {
        type: ['string', 'number', 'null'],
      },
      minItems: 1,
      uniqueItems: true,
    },
    fn: (a) => (v) => !a.includes(v),
  },
  $regex: {
    schema: {
      type: ['string', 'array'],
      if: {
        type: 'string',
      },
      then: {
        minLength: 1,
      },
      else: {
        items: {
          type: 'string',
        },
        minItems: 1,
      },
    },
    fn: (a) => {
      let regexp;
      if (Array.isArray(a)) {
        const [pattern, flags] = a;
        regexp = new RegExp(pattern, flags || '');
      } else {
        regexp = new RegExp(a);
      }
      return (v) => regexp.test(v);
    },
  },
};

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
      return (d) => compareList.every((match) => match(d));
    }
    return (d) => compareList.some((match) => match(d));
  }
  const compare = generateCompare(opName, valueMatch, dataKey);
  return (d) => compare(d);
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

const generateLogics = (obj) => {
  const and = [];
  const dataKeys = Object.keys(obj);
  for (let i = 0; i < dataKeys.length; i++) {
    const dataKey = dataKeys[i];
    const valueMatch = obj[dataKey];
    if (_.isPlainObject(valueMatch)) {
      const opNames = Object.keys(valueMatch);
      if (opNames.length !== 1) {
        throw new Error(`\`${dataKey}\` invalid op, \`${JSON.stringify(valueMatch)}\``);
      }
      const opName = opNames[0];
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
          and.push({
            dataKey,
            match: (d) => !compare(d),
          });
        }
      } else {
        if (!validateOp(valueMatch)) {
          throw new Error(`\`${dataKey}\` invalid op, \`${JSON.stringify(validateOp.errors)}\``);
        }
        const opMatch = generateOpMatch(
          opName,
          valueMatch,
          dataKey,
        );
        if (opMatch) {
          and.push({
            dataKey,
            match: opMatch,
          });
        }
      }
    } else {
      const type = typeof valueMatch;
      if (type === 'object' && valueMatch != null) {
        throw new Error(`\`${dataKey}\` express \`${JSON.stringify(valueMatch)}\` invalid`);
      }
      and.push({
        dataKey,
        match: (v) => {
          if (valueMatch == null) {
            return v == null;
          }
          return v === valueMatch;
        },
      });
    }
  }
  return and;
};

export default generateLogics;
