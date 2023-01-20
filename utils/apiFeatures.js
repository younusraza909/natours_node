class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // Removing unwanted query string from our object
    // 1) Filtering
    const queryObj = { ...this.queryString };
    const excludedFileds = ['page', 'sort', 'limit', 'fields'];

    excludedFileds.forEach((field) => delete queryObj[field]);

    // we are building query first because if use await it will execute query and return us document so we cant use other methods on it like sort , limit etc
    //  2)Advance Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    // let query = Tour.find(JSON.parse(queryStr));
    // Two ways to write filtering queries
    // const query =  Tour.find({
    //   duration: 5,
    // });

    // const query =  Tour.find()
    //   .where('difficulty')
    //   .equals(5)
    //   .where('x')
    //   .equals(1);
    // So we can chain more things on this object
    return this;
  }

  sort() {
    //3) SORTING
    if (this.queryString.sort) {
      // In order to sort desc we have to add -sign before the key
      //  below code is to remove , between multiple sort keys user will send price,ratings and mongoose acceopt sort('price ratings')
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      // Default Sort
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    // 4) FIELDS LIMITING
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');

      this.query = this.query.select(fields);
    } else {
      // With minus we are excluding field
      this.query = this.query.select('-__v');
    }

    return this;
  }

  pagination() {
    // 5) PAGINATION
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;

    const skip = (page - 1) * limit;

    console.log(page, limit, skip);

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
