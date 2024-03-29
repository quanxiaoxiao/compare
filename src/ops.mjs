const eq = (a) => (v) => {
  if (a == null) {
    return v == null;
  }
  return v === a;
};

const isNotNumber = (n) => typeof n !== 'number';

export default {
  $eq: {
    schema: {
      anyOf: [
        { type: 'number' },
        { type: 'string' },
        { type: 'boolean' },
        { type: 'number' },
        { type: 'null' },
      ],
    },
    fn: eq,
  },
  $ne: {
    schema: {
      anyOf: [
        { type: 'number' },
        { type: 'string' },
        { type: 'boolean' },
        { type: 'number' },
        { type: 'null' },
      ],
    },
    fn: (a) => (v) => {
      if (a == null) {
        return v != null;
      }
      return !eq(a)(v);
    },
  },
  $gt: {
    schema: {
      type: 'number',
      nullable: false,
    },
    fn: (a) => (v) => {
      if (isNotNumber(v)) {
        return false;
      }
      return v > a;
    },
  },
  $gte: {
    schema: {
      type: 'number',
      nullable: false,
    },
    fn: (a) => (v) => {
      if (isNotNumber(v)) {
        return false;
      }
      return v === a || v > a;
    },
  },
  $lt: {
    schema: {
      type: 'number',
      nullable: false,
    },
    fn: (a) => (v) => {
      if (isNotNumber(v)) {
        return false;
      }
      return v < a;
    },
  },
  $lte: {
    schema: {
      type: 'number',
      nullable: false,
    },
    fn: (a) => (v) => {
      if (isNotNumber(v)) {
        return false;
      }
      return v === a || v < a;
    },
  },
  $in: {
    schema: {
      type: 'array',
      items: {
        anyOf: [
          {
            type: 'string',
          },
          {
            type: 'number',
          },
          {
            type: 'null',
          },
          {
            type: 'boolean',
          },
        ],
      },
      minItems: 1,
      uniqueItems: true,
    },
    fn: (a) => (v) => {
      if (v == null) {
        return a.includes(null);
      }
      if (!['string', 'number', 'boolean'].includes(typeof v)) {
        throw new Error(`\`${v}\` invalid data type`);
      }
      return a.includes(v);
    },
  },
  $nin: {
    schema: {
      type: 'array',
      items: {
        anyOf: [
          {
            type: 'string',
          },
          {
            type: 'number',
          },
          {
            type: 'null',
          },
          {
            type: 'boolean',
          },
        ],
      },
      minItems: 1,
      uniqueItems: true,
    },
    fn: (a) => (v) => {
      if (v == null) {
        return !a.includes(null);
      }
      if (!['string', 'number', 'boolean'].includes(typeof v)) {
        throw new Error(`\`${v}\` invalid data type`);
      }
      return !a.includes(v);
    },
  },
  $regex: {
    schema: {
      anyOf: [
        {
          type: 'string',
        },
        {
          type: 'array',
        },
      ],
    },
    fn: (a) => {
      let regexp;
      if (Array.isArray(a)) {
        const [pattern, flags] = a;
        regexp = new RegExp(pattern, flags || '');
      } else {
        if (a === '') {
          throw new Error('$regexp express is empty');
        }
        regexp = new RegExp(a);
      }
      return (v) => {
        if (v == null) {
          return false;
        }
        if (typeof v !== 'string') {
          throw new Error('$regex input invalid');
        }
        return regexp.test(v);
      };
    },
  },
};
