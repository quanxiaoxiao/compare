import assert from 'node:assert';
import _ from 'lodash';

const normalTypes = ['number', 'string', 'boolean', 'null'];

// '$nor',

const eq = (a) => (v, d) => {
  if (a == null) {
    return v == null;
  }
  if (typeof a === 'string' && a[0] === '$' && a.length !== 1) {
    const vv = _.get(d, a.slice(1));
    if (vv == null) {
      return v == null;
    }
    return v === vv;
  }
  return v === a;
};

const isNotNumber = (n) => typeof n !== 'number';

export default {
  $eq: {
    schema: {
      type: normalTypes,
    },
    fn: eq,
  },
  $ne: {
    schema: {
      type: normalTypes,
    },
    fn: (a) => (v, d) => {
      if (a == null) {
        return v != null;
      }
      return !eq(a)(v, d);
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
        type: ['string', 'number', 'null', 'boolean'],
      },
      minItems: 1,
      uniqueItems: true,
    },
    fn: (a) => (v) => {
      if (v == null) {
        return a.includes(null);
      }
      assert(['string', 'number', 'boolean'].includes(typeof v));
      return a.includes(v);
    },
  },
  $nin: {
    schema: {
      type: 'array',
      items: {
        type: ['string', 'number', 'null', 'boolean'],
      },
      minItems: 1,
      uniqueItems: true,
    },
    fn: (a) => (v) => {
      if (v == null) {
        return !a.includes(null);
      }
      assert(['string', 'number', 'boolean'].includes(typeof v));
      return !a.includes(v);
    },
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
        maxItems: 2,
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
      return (v) => {
        if (v == null) {
          return false;
        }
        assert(typeof v === 'string');
        return regexp.test(v);
      };
    },
  },
};
