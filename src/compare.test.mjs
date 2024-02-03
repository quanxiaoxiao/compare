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
