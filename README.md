通过类似数据库查询语句的表达式,来检测数据是否符合条件

## Install

```shell
npm install @quanxiaoxiao/compare
```

## Usage

```javascript
import compare from '@quanxiaoxiao/compare';

const match = compare({ name: 'test' });

assert(match({ name: 'test' }));
assert(!match({ name: 'quan' }));
```

### Operations

`$ne`, `$eq`, `$gt`, `$lt`, `$lte`, `$gte`, `$in`, `$nin`, `$regexp`


### base

```javascript
const data = {
  name: 'quan',
  age: 22,
};
compare({ name: 'quan' })(data) === true
compare({ name: { $eq: 'quan' } })(data) === true
compare({ name: { $ne: 'rice' } })(data) === true
compare({ age: { $lte: 22 } })(data) === true
compare({ age: { $lt: 23 } })(data) === true
compare({ age: { $gt: 21 } })(data) === true
compare({ age: { $gte: 22 } })(data) === true
```
