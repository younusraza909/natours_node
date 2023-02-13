/* eslint-disable prefer-arrow-callback */
const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./userModel');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxLength: [40, 'A tour name must have less or equal than 40 characters'],
      minLength: [10, 'A tour name must have more or equal than 10 characters'],
    },
    slug: {
      type: String,
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      // Shorthand
      // enum: ['easy', 'medium', 'difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either : easy , medium, difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      // This setter function will be called before saving this value
      // 4.666666 -> 5
      // 46.6666666 -> 4.7
      set: (val) => Math.round(val * 10),
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      //  we can use both type of function here but if we want to use this keyword we have to use normal function
      validate: {
        // below is weird syntax but by using this mongo will give access to VALUE
        message: 'Discount price ({VALUE}) should be below regular price',
        validator: function (value) {
          // this only points to current docs on new document creation not update
          return value < this.price;
        },
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: {
      type: [String],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      //  with select property we can permanently hide from response and mongoose will never send that
      select: false,
    },
    startDates: {
      type: [Date],
    },
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      // Geo JSON
      // this object is the embeded object and not the schema type otpions
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: {
        type: [Number],
      },
      address: String,
      description: String,
    },
    // In order to embed document into another we need array so below we are defining array
    // so mongodb will create new document for locations
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: {
          type: [Number],
        },
        address: String,
        description: String,
        day: Number,
      },
    ],
    // For embedding approach
    // guides: Array,
    guides: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  },
  {
    // these 2 option have to be included for virtual property
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

// 1 is acscending , -1 is descending
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
// For geospecial data
tourSchema.index({ startLocation: '2dsphere' });

// Virtual Properties
// This function is always called when we query data from database .
tourSchema.virtual('durationWeeks').get(function () {
  // We cant pass a arrow functio here because of this keyword

  return this.duration / 7;
});

// Virtual Populate
// in this scenerio we dont want to save reviews id on tour but want to access it if we get tour
// so we use virtual populate by doing this we are saving reviews id on tour without persisting into db
// now we can use populate on reviews while getting tour and its possible because of this new virtual field
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

// Document Middleware (it runs before the .save() command && .create() but not on .insertMany())
tourSchema.pre('save', function (next) {
  //  this keyword here give access to current proccessed data
  this.slug = slugify(this.name, { lower: true });

  next();
});

// We will not use embeding approach for this
// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));

//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

// post middleware run afer all pre runs
// in post middleware we dont have access to this keyword

// tourSchema.post('save', function (doc, next) {
//   // in post middle ware we got doc and next
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE

// we have use regular expression so an event start or container find keyword will trigger this event
tourSchema.pre(/^find/, function (next) {
  // Here this keyword point to query
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

tourSchema.pre(/^find/, function (next) {
  // Here this keyword point to query
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });

  this.start = Date.now();
  next();
});

// in this doc param we got all docs return
tourSchema.post(/^find/, function (docs, next) {
  // Here this keyword point to query
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

// Aggregation Middleware

tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

  console.log(this.pipeline());
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
