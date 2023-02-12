import test from 'ava'; // eslint-disable-line
import match from '../src/index.mjs';

test('express', (t) => {
  t.is(typeof match([]), 'function');
  t.is(typeof match([{}]), 'function');
  t.is(typeof match({}), 'function');
  t.true(match([])({}));
  t.true(match({})({}));
});

test('compare $and', (t) => {
  let compare = match({
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
  compare = match({
    name: null,
  });
  t.true(compare({ name: null }));
  t.true(compare({}));
  t.false(compare({ name: '' }));
  compare = match({
    age: {
      $gt: 30,
    },
  });
  t.true(compare({ age: 31 }));
  t.false(compare({ age: 30 }));
  t.false(compare({ age: 29 }));
  compare = match({
    age: {
      $gte: 30,
    },
  });
  t.true(compare({ age: 31 }));
  t.true(compare({ age: 30 }));
  t.false(compare({ age: 29 }));
  compare = match({
    age: {
      $lt: 30,
    },
  });
  t.false(compare({ age: 31 }));
  t.false(compare({ age: 30 }));
  t.true(compare({ age: 29 }));
  compare = match({
    age: {
      $lte: 30,
    },
  });
  t.false(compare({ age: 31 }));
  t.true(compare({ age: 30 }));
  t.true(compare({ age: 29 }));
  t.throws(() => {
    compare = match({
      age: {
        $lte: '30',
      },
    });
  });
  t.throws(() => {
    compare = match({
      age: [30, 40],
    });
  });
  compare = match({
    age: {
      $and: [
        {
          $gt: 30,
        },
        {
          $lt: 40,
        },
      ],
    },
  });
  t.true(compare({ age: 31 }));
  t.true(compare({ age: 39 }));
  t.false(compare({ age: 30 }));
  t.false(compare({ age: 29 }));
  t.false(compare({ age: 40 }));
  t.false(compare({ age: 41 }));
});

test('compare $or', (t) => {
  let compare = match([{ name: 'cqq', age: 33 }, { name: 'cqqq', big: 'xxx' }, { foo: 'bar' }]);
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
  compare = match({
    age: {
      $or: [
        {
          $gt: 40,
        },
        {
          $lt: 30,
        },
      ],
    },
  });
  t.true(compare({ age: 29 }));
  t.false(compare({ age: 30 }));
  t.false(compare({ age: 40 }));
  t.true(compare({ age: 41 }));
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
  let compare = match({
    name: {
      $not: {
        $eq: 'cqq',
      },
    },
  });
  t.true(compare({ name: 'cqqq' }));
  t.false(compare({ name: 'cqq' }));
  compare = match({
    name: {
      $not: {
        $in: ['', null],
      },
    },
  });
  t.true(compare({
    name: 'aaa',
  }));
  t.false(compare({
    name: '',
  }));
  t.false(compare({
    name: null,
  }));
  compare = match({
    name: {
      $nin: ['', null],
    },
  });
  t.true(compare({
    name: 'aaa',
  }));
  t.false(compare({
    name: '',
  }));
  t.false(compare({
    name: null,
  }));
});

test('compare sub', (t) => {
  const compare = match({
    'cqq.name': 'quan',
    'cqq.age': {
      $eq: 30,
    },
  });
  t.true(compare({ cqq: { name: 'quan', age: 30 } }));
  t.false(compare({ cqq: { name: 'quanc', age: 30 } }));
  t.false(compare({ cqq: { name: 'quan', age: 31 } }));
  t.false(compare({ cqq: { name: 'quan' } }));
  t.false(compare({ cqq: { age: 30 } }));
});

test('invalid', (t) => {
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
  t.throws(() => {
    match({
      name: {
        $xx: 1,
      },
    });
  });
  t.throws(() => {
    match({
      name: {
        $or: [],
      },
    });
  });
  t.throws(() => {
    match({
      name: {
        $and: [],
      },
    });
  });
  t.throws(() => {
    match({
      name: {
        $eq: 'quan',
        $ne: 'cqq',
      },
    });
  });
});
