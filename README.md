通过类似数据库查询语句的表达式,来检测数据是否符合条件

## Install

```shell
npm install @quanxiaoxiao/compare
```

## Quick Start

```javascript
import compare from '@quanxiaoxiao/compare';

compare({ name: 'quan' })({ name: 'quan', age: 22 }) === true
compare({ age: { $gt: 20 } })({ name: 'quan', age: 22 }) === true
```

## Expression Operators

### Comparison Expression Operators

| Name | Description |
| --- | --- |
| $eq | |
| $ne | |
| $gt | |
| $gte | |
| $lt | |
| $lte | |

### Array Expression Operators

| Name | Description |
| --- | --- |
| $in | |
| $nin | |

### Boolean Expression Operators

| Name | Description |
| --- | --- |
| $not | |
| $and | |
| $or | |
| $nor | |

### Eegexp Expression Operators

| Name | Description |
| --- | --- |
| $regexp | |
