### Operations

`$ne`, `$eq`, `$gt`, `$lt`, `$lte`, `$gte`, `$in`, `$nin`, `$regexp`


### base

```javascript
  const data = {
    name: 'quan',
    age: 22,
  };
  compare({
    name: 'quan',
  })(data);
  compare({
    name:  {
      $eq: 'quan',
    },
  })(data);
  compare({
    name:  {
      $ne: 'rice',
    },
  })(data);
  compare({
    age:  {
      $lte: 22,
    },
  })(data);
  compare({
    age:  {
      $lt: 23,
    },
  })(data);
  compare({
    age:  {
      $gt: 21,
    },
  })(data);
  compare({
    age:  {
      $gte: 22,
    },
  })(data);
```
