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
