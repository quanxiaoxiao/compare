import test from 'ava'; // eslint-disable-line
import match from '../src/index.mjs';

test('express', (t) => {
  t.throws(() => {
    match('aaa');
  });
  t.throws(() => {
    match(1);
  });
  t.throws(() => {
    match(['aa']);
  });
  t.throws(() => {
    match([null]);
  });
  t.throws(() => {
    match([{}, null]);
  });
  t.is(typeof match([]), 'function');
  t.is(typeof match([{}]), 'function');
  t.is(typeof match({}), 'function');
});

test('compare $and', (t) => {
  const compare = match({
    name: 'cqq',
    age: 33,
  });
  t.true(compare({
    big: 'xxx',
    name: 'cqq',
    age: 33,
  }));
  t.false(compare({
    big: 'xxx',
    name: 'cqq',
    age: 34,
  }));
  t.false(compare({
    big: 'xxx',
    name: 'cqqq',
    age: 33,
  }));
});

test('compare $or', (t) => {
  const compare = match([{ name: 'cqq', age: 33 }, { name: 'cqqq', big: 'xxx' }, { foo: 'bar' }]);
  t.true(compare({
    big: 'xxx',
    name: 'cqq',
    age: 33,
  }));
  t.true(compare({
    big: 'xxx',
    name: 'cqqq',
    age: 34,
  }));
  t.true(compare({
    foo: 'bar',
  }));
  t.false(compare({
    foo: 'xxxx',
  }));
  t.false(compare({
    name: 'cqq',
    big: 'xxx',
  }));
  t.true(compare({
    name: 'cqq',
    foo: 'bar',
  }));
});

test('compare $op', (t) => {
  let compare = match({
    name: {
      $eq: 'cqq',
    },
    age: {
      $in: [33, 34, 35, 36],
    },
  });
  t.true(compare({
    name: 'cqq',
    age: 33,
  }));
  t.true(compare({
    name: 'cqq',
    age: 35,
  }));
  t.false(compare({
    name: 'cqqq',
    age: 33,
  }));
  compare = match({
    name: {
      $ne: null,
    },
  });
  t.true(compare({
    name: '',
  }));
  t.false(compare({
    name: null,
  }));
  t.false(compare({}));
  compare = match({
    name: {
      $eq: null,
    },
  });
  t.true(compare({}));
  t.true(compare({ name: null }));
  t.false(compare({ name: '' }));
});

test('compare $not', (t) => {
  const compare = match({
    name: {
      $not: {
        $eq: 'cqq',
      },
    },
  });
  t.true(compare({ name: 'cqqq' }));
  t.false(compare({ name: 'cqq' }));
});
