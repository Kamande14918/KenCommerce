const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
    trim: true,
    maxlength: [50, 'Category name cannot be more than 50 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  image: {
    public_id: String,
    url: String
  },
  parent: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    default: null
  },
  children: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Category'
  }],
  level: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  metaTitle: String,
  metaDescription: String,
  attributes: [{
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['text', 'number', 'boolean', 'select', 'multiselect'],
      default: 'text'
    },
    options: [String],
    required: {
      type: Boolean,
      default: false
    }
  }]
}, {
  timestamps: true
});

// Create slug from name before saving
categorySchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .replace(/\s+/g, '-');
  }
  next();
});

// Update children when parent is set
categorySchema.pre('save', async function(next) {
  if (this.isModified('parent') && this.parent) {
    try {
      await this.constructor.findByIdAndUpdate(
        this.parent,
        { $addToSet: { children: this._id } }
      );
      
      // Set level based on parent
      const parent = await this.constructor.findById(this.parent);
      if (parent) {
        this.level = parent.level + 1;
      }
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Remove from parent's children when deleted
categorySchema.pre('remove', async function(next) {
  if (this.parent) {
    try {
      await this.constructor.findByIdAndUpdate(
        this.parent,
        { $pull: { children: this._id } }
      );
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Get category path
categorySchema.methods.getPath = async function() {
  const path = [this];
  let current = this;
  
  while (current.parent) {
    current = await this.constructor.findById(current.parent);
    if (current) {
      path.unshift(current);
    } else {
      break;
    }
  }
  
  return path;
};

// Get all descendants
categorySchema.methods.getDescendants = async function() {
  const descendants = [];
  
  const addChildren = async (categoryId) => {
    const category = await this.constructor.findById(categoryId).populate('children');
    if (category && category.children.length > 0) {
      for (const child of category.children) {
        descendants.push(child);
        await addChildren(child._id);
      }
    }
  };
  
  await addChildren(this._id);
  return descendants;
};

module.exports = mongoose.model('Category', categorySchema);
