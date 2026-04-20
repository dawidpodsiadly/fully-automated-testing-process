const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
    },
    birthDate: {
      type: Date,
    },
    contract: {
      type: {
        type: String,
        enum: ['Mandate', 'Employment', 'B2B', ''],
      },
      salary: {
        type: Number,
      },
      position: {
        type: String,
        enum: ['Storekeeper', 'Accountant', 'IT', ''],
      },
      startTime: {
        type: Date,
      },
      endTime: {
        type: Date,
      },
    },
    notes: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isActivated: {
      type: Boolean,
      default: false,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {versionKey: false},
);

userSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    next();
  } catch (error) {
    return next(error);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
