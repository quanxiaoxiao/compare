import test from 'node:test';
import assert from 'node:assert';
import generateLogics from './generateLogics.mjs';

test('generateLogics check express', () => {
  assert.throws(() => {
    generateLogics([]);
  });
  assert.throws(() => {
    generateLogics(null);
  });
  assert.throws(() => {
    generateLogics(true);
  });
  assert.throws(() => {
    generateLogics(222);
  });
  assert.throws(() => {
    generateLogics({
      name: new Date(),
    });
  });
  assert.throws(() => {
    generateLogics({
      name: new String('quan'), // eslint-disable-line
    });
  });
  assert.throws(() => {
    generateLogics({
      name: () => {},
    });
  });
  assert.throws(() => {
    generateLogics({
      name: [],
    });
  });
  assert.deepEqual(generateLogics({}), []);
  assert.equal(generateLogics({ name: null }).length, 1);
  assert.equal(generateLogics({ name: 'aaa' }).length, 1);
  assert.equal(generateLogics({ name: 111 }).length, 1);
  assert.equal(generateLogics({ name: true }).length, 1);
  assert.equal(generateLogics({ name: false }).length, 1);
  assert.equal(generateLogics({ name: 33 }).length, 1);
  // assert.equal(generateLogics({ name: /^qu(a|b)$/ }).length, 1);
});
