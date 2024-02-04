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
