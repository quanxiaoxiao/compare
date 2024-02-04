Use expressions similar to MongoDB query statements to detect whether the data type of an `object` matches the expression.

## Install

```shell
npm install @quanxiaoxiao/compare
```

## Quick Start

```javascript
import compare from '@quanxiaoxiao/compare';

compare({ name: 'quan' })({ name: 'quan', age: 22 }) === true
compare({ age: { $gt: 20 } })({ name: 'quan', age: 22 }) === true
compare({ good: false })({ name: 'quan', age: 22, good: false }) === true
compare({ big: null })({ name: 'quan', age: 22, good: false }) === true
compare({ 'obj.name': 'quan' })({ obj: { name: 'quan' } }) === true
```

## Expression Operators

### Number Comparison Expression Operators

| Name | Type                                  |
| ---- | ------------------------------------- |
| $eq  | `string`, `null`, `boolean`, `number` |
| $ne  | `string`, `null`, `boolean`, `number` |
| $gt  | `number`                              |
| $gte | `number`                              |
| $lt  | `number`                              |
| $lte | `number`                              |

### $eq

```javascript
compare({ name: { $eq: 'quan' } })({ name: 'quan' }) === true
compare({ age: { $eq: null } })({ name: 'quan' }) === true
compare({ 'obj.name': { $eq: 'quan' } })({ obj: { name: 'quan' } }) === true
```

### $ne

```javascript
compare({ name: { $ne: 'quan' } })({ name: 'rice' }) === true
compare({ age: { $ne: null } })({ name: 'quan', age: 33 }) === true
```

### $gt

```javascript
compare({ age: { $gt: 22 } })({ age: 23 }) === true
```

### $gte

```javascript
compare({ age: { $gte: 22 } })({ age: 22 }) === true
compare({ age: { $gte: 22 } })({ age: 23 }) === true
```

### $lt

```javascript
compare({ age: { $lt: 22 } })({ age: 21 }) === true
```

### $lte

```javascript
compare({ age: { $lte: 22 } })({ age: 21 }) === true
compare({ age: { $lte: 22 } })({ age: 22 }) === true
```

### Array Expression Operators

| Name | Type                                         |
| ---- | -------------------------------------------- |
| $in  | Array<`string`, `null`, `boolean`, `number`> |
| $nin | Array<`string`, `null`, `boolean`, `number`> |

### $in

```javascript
compare({ age: { $in: [22, 23, 28] } })({ age: 22 }) === true
compare({ name: { $in: ['', null] } })({ age: 22 }) === true
compare({ name: { $in: ['', null] } })({ age: 22, name: '' }) === true
```

### $nin

```javascript
compare({ age: { $nin: [22, 23, 28] } })({ age: 24 }) === true
compare({ name: { $nin: ['', null] } })({ age: 22, name: 'aaa' }) === true
```

### Eegexp Expression Operators

| Name   | Type                      |
| ------ | ------------------------- |
| $regex | `string`, Array<`string`> |


### $regex


```javascript
compare({ name: { $regex: '^a(1|3|z)c' } })({ name: 'a3c' }) === true
compare({ name: { $regex: '^a(1|3|z)c' } })({ name: 'azc' }) === true
compare({ name: { $regex: ['^a(1|3|z)c', 'i'] } })({ name: 'Azc' })
```


### Boolean Expression Operators

| Name | Type                                                                           |
| ---- | ------------------------------------------------------------------------------ |
| $not | Array<`Number comparison Expression`, `Eegexp Expression`, `Array Expression`> |
| $and | Array<`Number comparison Expression`, `Eegexp Expression`, `Array Expression`> |
| $or  | Array<`Number comparison Expression`, `Eegexp Expression`, `Array Expression`> |
| $nor | Array<`Number comparison Expression`, `Eegexp Expression`, `Array Expression`> |

## Other
