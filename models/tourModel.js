const mongoose = require('mongoose');
const slugify = require('slugify');
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
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
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
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

// Virtual Properties
// This function is always called when we query data from database .
tourSchema.virtual('durationWeeks').get(function () {
  // We cant pass a arrow functio here because of this keyword

  return this.duration / 7;
});

// Document Middleware (it runs before the .save() command && .create() but not on .insertMany())
tourSchema.pre('save', function (next) {
  //  this keyword here give access to current proccessed data
  this.slug = slugify(this.name, { lower: true });

  next();
});

// post middleware run afer all pre runs
// in post middleware we dont have access to this keyword
// eslint-disable-next-line prefer-arrow-callback
tourSchema.post('save', function (doc, next) {
  // in post middle ware we got doc and next
  console.log(doc);
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
