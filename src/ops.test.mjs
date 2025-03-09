import assert from 'node:assert';
import test from 'node:test';

import ops from './ops.mjs';

test('ops $eq', () => {
  assert(ops.$eq.fn()(null));
  assert(ops.$eq.fn(null)(null));
  assert(ops.$eq.fn(null)());
  assert(ops.$eq.fn()());
  assert(ops.$eq.fn(1)(1));
  assert(ops.$eq.fn(1.11)(1.11));
  assert(ops.$eq.fn('$')('$'));
  assert(ops.$eq.fn('obj.name')('obj.name'));
  assert(!ops.$eq.fn(1.1)(1));
  assert(!ops.$eq.fn(1)('1'));
  assert(!ops.$eq.fn('1')(1));
  assert(ops.$eq.fn('1')('1'));
  assert(!ops.$eq.fn(true)(false));
  assert(ops.$eq.fn(false)(false));
  assert(!ops.$eq.fn(true)('true'));
});

test('ops $ne', () => {
  assert(!ops.$ne.fn()(null));
  assert(!ops.$ne.fn(null)(null));
  assert(!ops.$ne.fn(null)());
  assert(!ops.$ne.fn()());
  assert(!ops.$ne.fn(1)(1));
  assert(!ops.$ne.fn(1.11)(1.11));
  assert(!ops.$ne.fn('$')('$'));
  assert(!ops.$ne.fn('obj.name')('obj.name'));
  assert(ops.$ne.fn(1.1)(1));
  assert(ops.$ne.fn(1)('1'));
  assert(ops.$ne.fn('1')(1));
  assert(ops.$ne.fn(true)(false));
  assert(ops.$ne.fn(true)('true'));
});

test('ops $gt', () => {
  assert(ops.$gt.fn(3)(4));
  assert(ops.$gt.fn(3)(Infinity));
  assert(!ops.$gt.fn(3)(-Infinity));
  assert(!ops.$gt.fn(3)(3));
  assert(!ops.$gt.fn(3)(2));
  assert(!ops.$gt.fn(3)(null));
  assert(!ops.$gt.fn(3)(true));
  assert(!ops.$gt.fn(3)(false));
  assert(!ops.$gt.fn(3)('4'));
  assert(!ops.$gt.fn(3)(NaN));
});

test('ops $gte', () => {
  assert(ops.$gte.fn(3)(4));
  assert(ops.$gte.fn(3)(3));
  assert(ops.$gte.fn(3)(Infinity));
  assert(!ops.$gte.fn(3)('4'));
  assert(!ops.$gte.fn(3)(2));
  assert(!ops.$gte.fn(3)(-Infinity));
});

test('ops $lt', () => {
  assert(ops.$lt.fn(3)(2));
  assert(!ops.$lt.fn(3)(3));
  assert(!ops.$lt.fn(3)(4));
  assert(!ops.$lt.fn(3)(Infinity));
  assert(ops.$lt.fn(3)(-Infinity));
  assert(!ops.$lt.fn(3)(null));
  assert(!ops.$lt.fn(3)(true));
  assert(!ops.$lt.fn(3)(false));
  assert(!ops.$lt.fn(3)('4'));
  assert(!ops.$lt.fn(3)(NaN));
});

test('ops $lte', () => {
  assert(ops.$lte.fn(3)(3));
  assert(ops.$lte.fn(3)(2));
  assert(ops.$lte.fn(3)(-Infinity));
  assert(!ops.$lte.fn(3)('2'));
  assert(!ops.$lte.fn(3)(4));
  assert(!ops.$lte.fn(3)(Infinity));
});

test('ops $in valid input', () => {
  assert.throws(() => {
    ops.$in.fn([])(new String('aa'));
  });
  assert.throws(() => {
    ops.$in.fn([])(new Number(10));
  });
  assert.throws(() => {
    ops.$in.fn([])(() => {});
  });
  assert.throws(() => {
    ops.$in.fn([])([]);
  });
  assert.throws(() => {
    ops.$in.fn([])({});
  });
  assert.throws(() => {
    ops.$in.fn([])(new Date());
  });
});

test('ops $in', () => {
  assert(ops.$in.fn(['1', '2', null])(null));
  assert(ops.$in.fn(['1', '2', null])());
  assert(ops.$in.fn(['1', '2', null])('1'));
  assert(!ops.$in.fn([])(1));
  assert(!ops.$in.fn([])('name'));
  assert(!ops.$in.fn([])(true));
  assert(!ops.$in.fn([])(false));
  assert(!ops.$in.fn([])(null));
  assert(!ops.$in.fn(['1', '2', '0'])(1));
  assert(!ops.$in.fn(['1', '2', '0'])(true));
  assert(!ops.$in.fn(['1', '2', '0'])(null));
  assert(!ops.$in.fn(['1', '2', 'null'])(null));
  assert(!ops.$in.fn(['1', '2', 'true'])(true));
});

test('ops $nin', () => {
  assert(ops.$nin.fn([])(1));
  assert(ops.$nin.fn([])('name'));
  assert(ops.$nin.fn([])(true));
  assert(ops.$nin.fn([])(false));
  assert(ops.$nin.fn([])(null));
  assert(ops.$nin.fn(['1', '2', '0'])(1));
  assert(ops.$nin.fn(['1', '2', '0'])(true));
  assert(ops.$nin.fn(['1', '2', '0'])(null));
  assert(ops.$nin.fn(['1', '2', 'null'])(null));
  assert(ops.$nin.fn(['1', '2', 'true'])(true));
  assert(!ops.$nin.fn(['1', '2', null])(null));
  assert(!ops.$nin.fn(['1', '2', null])());
});

test('ops $regex', () => {
  assert.throws(() => {
    ops.$regex.fn('aaa')(1);
  });
  assert.throws(() => {
    ops.$regex.fn('aaa')(true);
  });
  assert.throws(() => {
    ops.$regex.fn('aaa')(new RegExp('bbb'));
  });
  assert.throws(() => {
    ops.$regex.fn('aaa')(/asdfw/);
  });
  assert.throws(() => {
    ops.$regex.fn('aaa')({});
  });
  assert.throws(() => {
    ops.$regex.fn('aaa')([]);
  });
  assert(ops.$regex.fn('aa')('1aaa'));
  assert(!ops.$regex.fn('^aa')('1aaa'));
  assert(ops.$regex.fn('a(2|3)b')('a3b'));
  assert(!ops.$regex.fn('a(2|3)b')('a4b'));
  assert(!ops.$regex.fn('a(2|3)b')('a5b'));
  assert(!ops.$regex.fn('aa')('aAa'));
  assert(ops.$regex.fn(['aa', 'i'])('aAa'));
  assert(!ops.$regex.fn(['aa'])('aAa'));
});
