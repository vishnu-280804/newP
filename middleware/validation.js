// Validation middleware
const validateRegistration = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || name.length < 2) {
    return res.status(400).json({ message: 'Name must be at least 2 characters long' });
  }

  if (!email || !email.includes('@')) {
    return res.status(400).json({ message: 'Please provide a valid email' });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  next();
};

const validateRequest = (req, res, next) => {
  const { title, description, category, location } = req.body;

  if (!title || title.length < 3) {
    return res.status(400).json({ message: 'Title must be at least 3 characters long' });
  }

  if (!description || description.length < 10) {
    return res.status(400).json({ message: 'Description must be at least 10 characters long' });
  }

  if (!category) {
    return res.status(400).json({ message: 'Category is required' });
  }

  if (!location) {
    return res.status(400).json({ message: 'Location is required' });
  }

  next();
};

export { validateRegistration, validateLogin, validateRequest };