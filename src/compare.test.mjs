import test from 'node:test';
import assert from 'node:assert';
import compare from './compare.mjs';

test('compare check express', () => {
  assert.equal(typeof compare([]), 'function');
  assert.equal(typeof compare([{}]), 'function');
  assert.equal(typeof compare({}), 'function');
  assert.throws(() => {
    compare();
  });
  assert.throws(() => {
    compare(1);
  });
  assert.throws(() => {
    compare(true);
  });
  assert.throws(() => {
    compare('quan');
  });
  assert.throws(() => {
    compare([2]);
  });
  assert.throws(() => {
    compare([true]);
  });
  assert.throws(() => {
    compare(['quan']);
  });
});

test('compare', () => {
  assert(compare({ good: false })({ name: 'quan', age: 22, good: false }));
  assert(compare({ 'obj.name': 'quan' })({ obj: { name: 'quan' } }));
  assert(compare({ big: null })({ name: 'quan', age: 22, good: false }));
  assert(compare({ big: null })({ name: 'quan', age: 22, good: false }));
});

test('compare $eq', () => {
  assert(compare({ name: { $eq: 'quan' } })({ name: 'quan' }));
  assert(compare({ 'obj.name': { $eq: 'quan' } })({ obj: { name: 'quan' } }));
  assert(!compare({ 'obj.name': { $eq: 'rice' } })({ name: 'quan', obj: { name: 'quan' } }));
  assert(compare({ age: { $eq: null } })({ name: 'quan' }));
});

test('compare $ne', () => {
  assert(compare({ name: { $ne: 'quan' } })({ name: 'rice' }));
  assert(compare({ age: { $ne: null } })({ name: 'quan', age: 33 }));
  assert(!compare({ age: { $ne: null } })({ name: 'quan' }));
});

test('compare $gt', () => {
  assert(compare({ age: { $gt: 22 } })({ age: 23 }));
  assert(!compare({ age: { $gt: 22 } })({ age: 22 }));
  assert(!compare({ age: { $gt: 22 } })({ age: 21 }));
});

test('compare $gte', () => {
  assert(compare({ age: { $gte: 22 } })({ age: 22 }));
  assert(compare({ age: { $gte: 22 } })({ age: 23 }));
});

test('compare $lt', () => {
  assert(compare({ age: { $lt: 22 } })({ age: 21 }));
  assert(!compare({ age: { $lt: 22 } })({ age: 22 }));
  assert(!compare({ age: { $lt: 22 } })({ age: 23 }));
});

test('compare $lte', () => {
  assert(compare({ age: { $lte: 22 } })({ age: 21 }));
  assert(compare({ age: { $lte: 22 } })({ age: 22 }));
  assert(!compare({ age: { $lte: 22 } })({ age: 23 }));
});

test('compare $in', () => {
  assert(compare({ age: { $in: [22, 23, 28] } })({ age: 22 }));
  assert(compare({ name: { $in: ['', null] } })({ age: 22 }));
  assert(compare({ name: { $in: ['', null] } })({ age: 22, name: '' }));
  assert(!compare({ name: { $in: ['', null] } })({ age: 22, name: 'aa' }));
  assert(compare({ age: { $in: [22, 23, 28] } })({ age: 28 }));
  assert(!compare({ age: { $in: [22, 23, 28] } })({ age: 21 }));
});

test('compare $regex', () => {
  assert(compare({ name: { $regex: '^a(1|3|z)c' } })({ name: 'a3c' }));
  assert(compare({ name: { $regex: '^a(1|3|z)c' } })({ name: 'azc' }));
  assert(!compare({ name: { $regex: '^a(1|3|z)c' } })({ name: 'Azc' }));
  assert(!compare({ name: { $regex: '^a(1|3|z)c' } })({ name: 'cazc' }));
  assert(compare({ name: { $regex: ['^a(1|3|z)c', 'i'] } })({ name: 'Azc' }));
});

test('compare $nin', () => {
  assert(compare({ age: { $nin: [22, 23, 28] } })({ age: 24 }));
  assert(compare({ name: { $nin: ['', null] } })({ age: 22, name: 'aaa' }));
  assert(!compare({ name: { $nin: ['', null] } })({ age: 22, name: '' }));
  assert(!compare({ name: { $nin: ['', null] } })({ age: 22 }));
  assert(!compare({ age: { $nin: [22, 23, 28] } })({ age: 22 }));
});

test('compare with object express', () => {
  assert(compare({ name: 'quan' })({ name: 'quan' }));
  assert(!compare({ name: 'quan' })({ name: 'cqq' }));
  assert(compare({ name: { $eq: 'quan' } })({ name: 'quan' }));
  assert(compare({ name: 'quan' })({ name: 'quan', age: 22 }));
  assert(compare({ age: { $gt: 20 } })({ name: 'quan', age: 22 }));
});

test('compare with array express', () => {
  assert(compare([{ name: 'quan' }])({ name: 'quan' }));
  assert(compare([{ name: 'quan' }, { age: 33 }])({ name: 'quan' }));
  assert(!compare([{ name: 'quan' }, { age: 33 }])({ name: 'quan2' }));
  assert(compare([{ name: 'quan' }, { age: 33 }])({ age: 33 }));
  assert(compare([{ name: 'quan' }, { age: { $gt: 33 } }])({ age: 34 }));
  assert(!compare([{ name: 'quan' }, { age: { $gt: 33 } }])({ age: 33 }));
  assert(compare([{ name: 'quan' }, { age: { $gt: 33 } }])({ age: 33, name: 'quan' }));
});
