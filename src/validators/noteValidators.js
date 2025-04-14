import { body, validationResult } from 'express-validator';

export const noteValidators = [
  // Nickname validation
  body('nickName')
    .trim()
    .notEmpty()
    .withMessage('Nickname is required')
    .isLength({ min: 2, max: 30 })
    .withMessage('Nickname must be between 2 and 30 characters')
    .matches(/^[a-zA-Z0-9\s]+$/)
    .withMessage('Nickname can only contain letters, numbers, and spaces'),

  // Note content validation
  body('note')
    .trim()
    .notEmpty()
    .withMessage('Note content is required')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Note must be between 1 and 1000 characters'),

  // Note color validation
  body('noteColor')
    .isHexColor()
    .withMessage('Invalid color format')
];

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}; 