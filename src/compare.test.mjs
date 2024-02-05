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

test('compare $not', () => {
  assert(compare({
    age: {
      $not: [
        {
          $eq: 33,
        },
        {
          $eq: 44,
        },
      ],
    },
  })({ age: 34 }));
  assert(!compare({
    age: {
      $not: [
        {
          $eq: 33,
        },
        {
          $eq: 44,
        },
      ],
    },
  })({ age: 33 }));
  assert(compare({
    age: {
      $not: [
        {
          $lt: 33,
        },
      ],
    },
  })({ age: 34 }));
  assert(compare({
    age: {
      $not: [
        {
          $lt: 33,
        },
        {
          $gt: 44,
        },
      ],
    },
  })({ age: 34 }));
  assert(!compare({
    age: {
      $not: [
        {
          $lt: 33,
        },
        {
          $gt: 44,
        },
      ],
    },
  })({ age: 32 }));
  assert(!compare({
    age: {
      $not: [
        {
          $lt: 33,
        },
        {
          $gt: 44,
        },
      ],
    },
  })({ age: 45 }));
});

test('compare $and', () => {
  assert(compare({
    age: {
      $and: [
        {
          $gt: 33,
        },
        {
          $lt: 44,
        },
      ],
    },
  })({ age: 34 }));
  assert(!compare({
    age: {
      $and: [
        {
          $gt: 33,
        },
        {
          $lt: 44,
        },
      ],
    },
  })({ age: 33 }));
  assert(!compare({
    age: {
      $and: [
        {
          $gt: 33,
        },
        {
          $lt: 44,
        },
      ],
    },
  })({ age: 32 }));
  assert(!compare({
    age: {
      $and: [
        {
          $gt: 33,
        },
        {
          $lt: 44,
        },
      ],
    },
  })({ age: 44 }));
});

test('compare $or', () => {
  assert(compare({
    age: {
      $or: [
        {
          $lt: 33,
        },
        {
          $gt: 44,
        },
      ],
    },
  })({ age: 45 }));
  assert(compare({
    age: {
      $or: [
        {
          $lt: 33,
        },
        {
          $gt: 44,
        },
      ],
    },
  })({ age: 32 }));
  assert(!compare({
    age: {
      $or: [
        {
          $lt: 33,
        },
        {
          $gt: 44,
        },
      ],
    },
  })({ age: 33 }));
  assert(!compare({
    age: {
      $or: [
        {
          $lt: 33,
        },
        {
          $gt: 44,
        },
      ],
    },
  })({ age: 34 }));
});

test('compare $nor', () => {
  assert(compare({
    age: {
      $nor: [
        {
          $lt: 33,
        },
        {
          $gt: 44,
        },
      ],
    },
  })({ age: 34 }));
  assert(compare({
    age: {
      $nor: [
        {
          $eq: 33,
        },
        {
          $eq: 44,
        },
      ],
    },
  })({ age: 34 }));
  assert(compare({
    age: {
      $nor: [
        {
          $lt: 33,
        },
        {
          $gt: 44,
        },
      ],
    },
  })({ age: 34 }));
  assert(!compare({
    age: {
      $nor: [
        {
          $lt: 33,
        },
        {
          $gt: 44,
        },
      ],
    },
  })({ age: 32 }));
});

test('compare []', () => {
  assert(compare([
    {
      name: {
        $eq: 'quan',
      },
    },
    {
      age: {
        $gt: 30,
      },
    },
  ])({
    name: 'quan',
    age: 33,
  }));
  assert(compare([
    {
      name: {
        $eq: 'quan',
      },
    },
    {
      age: {
        $gt: 30,
      },
    },
  ])({
    name: 'rice',
    age: 33,
  }));
  assert(!compare([
    {
      name: {
        $eq: 'quan',
      },
    },
    {
      age: {
        $gt: 30,
      },
    },
  ])({
    name: 'rice',
    age: 29,
  }));
  assert(!compare([
    {
      name: {
        $eq: 'quan',
      },
    },
    {
      age: {
        $gt: 30,
      },
    },
  ])({
    name: 'rice',
  }));
  assert(compare([
    {
      name: {
        $eq: 'quan',
      },
    },
    {
      age: {
        $gt: 30,
      },
    },
  ])({
    name: 'quan',
  }));
  assert(compare([
    {
      name: 'quan',
    },
    {
      age: {
        $gt: 30,
      },
    },
  ])({
    name: 'quan',
  }));
  assert(!compare([
    {
      name: 'quan',
    },
    {
      age: {
        $gt: 30,
      },
    },
  ])({
    name: 'rice',
  }));
});

test('compare', () => {
  const express = {
    method: 'GET',
    'headers.host': {
      $or: [
        {
          $regex: '\\baaa\\.com\\b',
        },
        {
          $regex: '\\bccc\\.net\\b',
        },
      ],
    },
  };
  assert(compare(express)({
    method: 'GET',
    headers: {
      host: 'www.aaa.com',
    },
  }));
  assert(!compare(express)({
    method: 'POST',
    headers: {
      host: 'www.aaa.com',
    },
  }));
  assert(!compare(express)({
    method: 'GET',
    headers: {
      host: 'www.aaa.net',
    },
  }));
  assert(compare(express)({
    method: 'GET',
    headers: {
      host: 'www.ccc.net',
    },
  }));
});

test('compare ref', () => {
  assert(compare({
    'obj1.age': ['obj2.age', '$gt'],
  })({
    obj1: {
      age: 22,
    },
    obj2: {
      age: 33,
    },
  }));
  assert(!compare({
    'obj1.age': ['obj2.age', '$gt'],
  })({
    obj1: {
      age: 22,
    },
    obj2: {
      age: 21,
    },
  }));
  assert(!compare({
    'obj1.age': ['obj2.age', '$gt'],
  })({
    obj1: {
      age: 22,
    },
    obj2: {
      age: 22,
    },
  }));
  assert(!compare({
    'obj1.age': ['obj2.age', '$gt'],
  })({
    obj1: {
      age: 22,
    },
    obj2: {
    },
  }));
});
