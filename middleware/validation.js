const { isValidEmail } = require('../utils');

function validateSchema(schema) {
  return (req, res, next) => {
    const errors = {};
    
    for (const [field, rules] of Object.entries(schema)) {
      const value = req.body[field];
      
      if (rules.required && (value === undefined || value === null || value === '')) {
        errors[field] = `${field} is required`;
        continue;
      }
      
      if (value !== undefined && value !== null) {
        if (rules.type && typeof value !== rules.type) {
          errors[field] = `${field} must be a ${rules.type}`;
        }
        
        if (rules.minLength && value.length < rules.minLength) {
          errors[field] = `${field} must be at least ${rules.minLength} characters`;
        }
        
        if (rules.maxLength && value.length > rules.maxLength) {
          errors[field] = `${field} cannot exceed ${rules.maxLength} characters`;
        }
        
        if (rules.pattern && !rules.pattern.test(value)) {
          errors[field] = `${field} format is invalid`;
        }
        
        if (rules.email && !isValidEmail(value)) {
          errors[field] = `${field} must be a valid email address`;
        }
      }
    }
    
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }
    
    next();
  };
}

const userSchema = {
  name: { required: true, type: 'string', minLength: 2, maxLength: 50 },
  email: { required: true, type: 'string', email: true },
  role: { required: false, type: 'string', pattern: /^(user|admin|editor)$/ }
};

const taskSchema = {
  title: { required: true, type: 'string', minLength: 3, maxLength: 100 },
  description: { required: false, type: 'string', maxLength: 500 },
  dueDate: { required: false, type: 'string', pattern: /^\d{4}-\d{2}-\d{2}$/ },
  assigneeId: { required: false, type: 'string' }
};

module.exports = {
  validateSchema,
  userSchema,
  taskSchema
};
