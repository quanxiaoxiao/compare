import test from 'node:test';
import assert from 'node:assert';
import _ from 'lodash';
import generateLogics from './generateLogics.mjs';

const validate = (every, obj) => every.every((d) => d.match(_.get(obj, d.dataKey)));

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
  assert.deepEqual(generateLogics({}), []);
  assert.equal(generateLogics({ name: null }).length, 1);
  assert.equal(generateLogics({ name: 'aaa' }).length, 1);
  assert.equal(generateLogics({ name: 111 }).length, 1);
  assert.equal(generateLogics({ name: true }).length, 1);
  assert.equal(generateLogics({ name: false }).length, 1);
  assert.equal(generateLogics({ name: 33 }).length, 1);
  // assert.equal(generateLogics({ name: /^qu(a|b)$/ }).length, 1);
});

test('generateLogics with invalid object', () => {
  assert.equal(generateLogics({
    name: {
      $eq: '333',
    },
  }).length, 1);
  assert.equal(generateLogics({
    name: {
      $eq: null,
    },
  }).length, 1);
  assert.throws(() => {
    generateLogics({
      name: {
        $eq: new Date(),
      },
    });
  });
  assert.throws(() => {
    generateLogics({
      name: [],
    });
  });
  assert.throws(() => {
    generateLogics({
      name: new Date(),
    });
  });
  assert.throws(() => {
    generateLogics({
      name: () => {},
    });
  });
  assert.throws(() => {
    generateLogics({
      name: {},
    });
  });
  assert.throws(() => {
    generateLogics({
      name: {
        $eq: 'aaa',
        $gt: 333,
      },
    });
  });
  assert.throws(() => {
    generateLogics({
      name: {
        $eqs: 'aaa',
      },
    });
  });
});

test('generateLogics with object', () => {
  assert(validate(generateLogics({
    name: 'quan',
  }), { name: 'quan', age: 22 }));
  assert(!validate(generateLogics({
    name: 'quan',
    age: 33,
  }), { name: 'quan' }));
  assert(!validate(generateLogics({
    name: 'quan',
    age: 33,
  }), { name: 'quan', age: 22 }));
  assert(validate(generateLogics({
    name: 'quan',
    age: null,
  }), { name: 'quan' }));
  assert(!validate(generateLogics({
    name: 'quan',
    age: null,
  }), { name: 'quan', age: 22 }));
});

test('generateLogics with $in invalid', () => {
  assert.throws(() => {
    generateLogics({
      name: {
        $in: ['aa', 'aa'],
      },
    });
  });
  assert.throws(() => {
    generateLogics({
      name: {
        $in: [],
      },
    });
  });
});

test('generateLogics with object express', () => {
  assert(validate(generateLogics({
    name: 'quan',
    age: {
      $gt: 20,
    },
  }), { name: 'quan', age: 22 }));
  assert(validate(generateLogics({
    name: 'quan',
    age: {
      $eq: 22,
    },
  }), { name: 'quan', age: 22 }));
  assert(!validate(generateLogics({
    name: 'quan',
    age: {
      $eq: 22,
    },
  }), { name: 'quan', age: 23 }));
  assert(validate(generateLogics({
    name: 'quan',
    age: {
      $eq: null,
    },
  }), { name: 'quan' }));
  assert(!validate(generateLogics({
    name: 'quan',
    age: {
      $ne: null,
    },
  }), { name: 'quan' }));
  assert(validate(generateLogics({
    name: 'quan',
    age: {
      $ne: null,
    },
  }), { name: 'quan', age: 22 }));

  assert(validate(generateLogics({
    name: {
      $in: ['quan', 'cqq', 'rice'],
    },
  }), { name: 'quan', age: 22 }));
  assert(validate(generateLogics({
    name: {
      $in: ['quan', 'cqq', 'rice'],
    },
  }), { name: 'rice', age: 22 }));
  assert(!validate(generateLogics({
    name: {
      $in: ['quan', 'cqq', 'rice'],
    },
  }), { name: 'big', age: 22 }));
  assert(validate(generateLogics({
    name: {
      $in: ['quan', 22, true],
    },
  }), { name: 22 }));
  assert(validate(generateLogics({
    name: {
      $in: ['quan', 22, true],
    },
  }), { name: true }));
  assert(validate(generateLogics({
    name: {
      $in: ['', null],
    },
  }), { name: '' }));
  assert(validate(generateLogics({
    name: {
      $in: ['', null],
    },
  }), {}));
  assert(!validate(generateLogics({
    name: {
      $in: ['', null],
    },
  }), { name: 'quan' }));
  assert(validate(generateLogics({
    name: {
      $nin: ['', null],
    },
  }), { name: 'quan' }));
  assert(!validate(generateLogics({
    name: {
      $nin: ['', null],
    },
  }), {}));
  assert(!validate(generateLogics({
    name: {
      $nin: ['', null],
    },
  }), { name: '' }));
  assert(!validate(generateLogics({
    name: {
      $nin: ['', null],
    },
  }), { name: null }));

  assert(validate(generateLogics({
    name: {
      $regex: '^a([3-8])b',
    },
  }), { name: 'a4b' }));
  assert(!validate(generateLogics({
    name: {
      $regex: '^a([3-8])b',
    },
  }), { name: 'a2b' }));
  assert(!validate(generateLogics({
    name: {
      $regex: '^a([3-8])b',
    },
  }), { name: 'ca8b' }));
  assert(validate(generateLogics({
    name: {
      $regex: ['^a([3-8])b', 'i'],
    },
  }), { name: 'A4b' }));
});

test('generateLogics with object $or', () => {
  assert.throws(() => {
    generateLogics({
      name: {
        $or: {},
      },
    });
  });
  assert.throws(() => {
    generateLogics({
      name: {
        $or: [],
      },
    });
  });
  assert.throws(() => {
    generateLogics({
      name: {
        $or: { $eq: 33 },
      },
    });
  });
  assert.throws(() => {
    generateLogics({
      name: {
        $or: [{}],
      },
    });
  });
  assert.throws(() => {
    generateLogics({
      name: {
        $or: [{ $eqs: 11 }],
      },
    });
  });
  assert.throws(() => {
    generateLogics({
      name: {
        $or: [{ $eq: 2, $ne: 3 }],
      },
    });
  });
  assert.throws(() => {
    generateLogics({
      name: {
        $or: [{ $eq: 2 }, { $nes: 33 }],
      },
    });
  });
  assert.throws(() => {
    generateLogics({
      name: {
        $or: [{ $or: [{ $eq: 44 }] }],
      },
    });
  });
  assert(validate(generateLogics({
    age: {
      $or: [
        {
          $eq: 33,
        },
      ],
    },
  }), { age: 33 }));
  assert(!validate(generateLogics({
    age: {
      $or: [
        {
          $eq: 32,
        },
      ],
    },
  }), { age: 33 }));
  assert(validate(generateLogics({
    age: {
      $or: [
        {
          $eq: 33,
        },
        {
          $gt: 28,
        },
      ],
    },
  }), { age: 29 }));
  assert(!validate(generateLogics({
    age: {
      $or: [
        {
          $eq: 33,
        },
        {
          $gt: 27,
        },
      ],
    },
  }), { age: 25 }));
});

test('generateLogics with object $and', () => {
  assert(!validate(generateLogics({
    age: {
      $and: [
        {
          $ne: 33,
        },
        {
          $gt: 27,
        },
      ],
    },
  }), { age: 25 }));
  assert(validate(generateLogics({
    age: {
      $and: [
        {
          $ne: 33,
        },
        {
          $gt: 27,
        },
      ],
    },
  }), { age: 28 }));
  assert(!validate(generateLogics({
    age: {
      $and: [
        {
          $ne: 33,
        },
        {
          $gt: 27,
        },
      ],
    },
  }), { age: 33 }));
});

test('generateLogics with object $nor', () => {
  assert(!validate(generateLogics({
    age: {
      $nor: [
        {
          $eq: 33,
        },
      ],
    },
  }), { age: 33 }));
  assert(validate(generateLogics({
    age: {
      $nor: [
        {
          $eq: 32,
        },
      ],
    },
  }), { age: 33 }));
  assert(!validate(generateLogics({
    age: {
      $nor: [
        {
          $eq: 33,
        },
        {
          $gt: 28,
        },
      ],
    },
  }), { age: 29 }));
  assert(validate(generateLogics({
    age: {
      $nor: [
        {
          $eq: 33,
        },
        {
          $gt: 27,
        },
      ],
    },
  }), { age: 25 }));
});
