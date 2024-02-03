import test from 'node:test';
import assert from 'node:assert';
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
  assert(!ops.$eq.fn(true)(false));
  assert(!ops.$eq.fn(true)('true'));
});

test('ops $eq with path', () => {
  assert(ops.$eq.fn('$test')(null, { name: 'quan' }));
  assert(ops.$eq.fn('$test')(null, { name: 'quan', test: null }));
  assert(ops.$eq.fn('$name')('cqq', { name: 'cqq' }));
  assert(ops.$eq.fn('$obj.name')('cqq', { obj: { name: 'cqq' } }));
  assert(!ops.$eq.fn('$obj.name')('cqq', { obj: { name: 'quan' } }));
  assert(!ops.$eq.fn('$ojb')({}, { obj: {} }));
  assert(!ops.$eq.fn('$name')('cqq', { name: 'quan' }));
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
