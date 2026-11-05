const { body, validationResult } = require("express-validator");
const CustomError = require("../utils/CustomError");

const updateProfileValidation = [
    body("name")
        .optional()
        .trim()
        .isLength({ min: 5, max: 100 })
        .withMessage("Name must be between 5 and 100 characters"),

    body("email")
        .optional()
        .trim()
        .isEmail()
        .withMessage("Please provide a valid email address")
        .normalizeEmail(),

    // Optional phone
    body("phone")
        .optional({ nullable: true })
        .isString()
        .withMessage("Phone number must be a string")
        .bail()
        .trim()
        .matches(/^(?:\+977)?9[678]\d{8}$/)
        .withMessage("Please provide a valid Nepal phone number"),

    body("address")
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage("Address cannot exceed 100 characters"),

    body("dob")
        .optional({ nullable: true })
        .isISO8601()
        .withMessage("Please provide a valid date of birth"),


    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            throw new CustomError(errors.array()[0].msg, 400);
        }

        next();
    }
];

module.exports = {
    updateProfileValidation
};