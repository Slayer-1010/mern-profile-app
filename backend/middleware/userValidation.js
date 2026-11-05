const { body, validationResult } = require("express-validator");
const CustomError = require("../utils/CustomError");

// =========================
// Common error handler
// =========================
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(
            new CustomError(errors.array()[0].msg, 400)
        );
    }

    return next();
};


// =========================
// User / Register Validation
// =========================
const userValidation = [
    // Required name
    body("name")
        .isString()
        .withMessage("Name must be a string")
        .bail()
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 5, max: 100 })
        .withMessage(
            "Name must be between 5 and 100 characters"
        ),

    // Required email
    body("email")
        .isString()
        .withMessage("Email must be a string")
        .bail()
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please provide a valid email")
        .isLength({ max: 255 })
        .withMessage("Email cannot exceed 255 characters")
        .normalizeEmail(),

    // Required password
    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 8, max: 128 })
        .withMessage(
            "Password must be between 8 and 128 characters"
        )
        .matches(/[a-z]/)
        .withMessage(
            "Password must contain at least one lowercase letter"
        )
        .matches(/[A-Z]/)
        .withMessage(
            "Password must contain at least one uppercase letter"
        )
        .matches(/\d/)
        .withMessage(
            "Password must contain at least one number"
        )
        .matches(/[@$!%*?&#]/)
        .withMessage(
            "Password must contain at least one special character"
        ),

    // Optional phone
    body("phone")
        .optional({ values : "falsy"})
        .isString()
        .withMessage("Phone number must be a string")
        .bail()
        .trim()
        .matches(/^(?:\+977)?9[678]\d{8}$/)
        .withMessage("Please provide a valid Nepal phone number"),

    // Optional address
    body("address")
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 100 })
        .withMessage("Address cannot exceed 100 characters"),

    // Optional date of birth
    body("dob")
        .optional({ values : "falsy" })
        .isISO8601()
        .withMessage("Please provide a valid date of birth")
        .bail()
        .custom((value) => {
            if (new Date(value) > new Date()) {
                throw new Error(
                    "Date of birth cannot be in the future"
                );
            }

            return true;
        }),

    // Check all validation errors
    handleValidationErrors,
];

// =========================
// Login Validation
// =========================
const loginValidation = [
    // Email
    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .trim()
        .isEmail()
        .withMessage("Please provide a valid email")
        .normalizeEmail(),

    // Password
    body("password")
        .notEmpty()
        .withMessage("Password is required"),

    // Check all validation errors
    handleValidationErrors,
];

module.exports = {
    userValidation,
    loginValidation,
};





// const CustomError = require("../utils/CustomError");

// const userValidation = (req, res, next) => {
//   const {
//     name,
//     email,
//     password,
//     phone,
//     address,
//     dob,
//   } = req.body;

//   // =========================
//   // Required fields
//   // =========================
//   if (!name || !email || !password) {
//     return next(
//       new CustomError(
//         "Name, email, and password are required",
//         400
//       )
//     );
//   }

//   // =========================
//   // Name validation
//   // =========================
//   if (typeof name !== "string" || name.trim().length < 5) {
//     return next(
//       new CustomError(
//         "Name must be at least 5 characters long",
//         400
//       )
//     );
//   }

//   if (name.trim().length > 100) {
//     return next(
//       new CustomError(
//         "Name cannot exceed 100 characters",
//         400
//       )
//     );
//   }

//   // =========================
//   // Email validation
//   // =========================
//   if (typeof email !== "string") {
//     return next(
//       new CustomError("Email must be a string", 400)
//     );
//   }

//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//   if (!emailRegex.test(email.trim())) {
//     return next(
//       new CustomError(
//         "Please provide a valid email",
//         400
//       )
//     );
//   }

//   if (email.trim().length > 255) {
//     return next(
//       new CustomError(
//         "Email cannot exceed 255 characters",
//         400
//       )
//     );
//   }

//   // =========================
//   // Password validation
//   // =========================
//   if (typeof password !== "string") {
//     return next(
//       new CustomError("Password must be a string", 400)
//     );
//   }

//   const passwordRegex =
//     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,128}$/;

//   if (!passwordRegex.test(password)) {
//     return next(
//       new CustomError(
//         "Password must be 8-128 characters and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
//         400
//       )
//     );
//   }


//   // =========================
//   // Optional phone
//   // =========================
//   if (phone !== undefined && phone !== null) {
//     if (typeof phone !== "string") {
//       return next(
//         new CustomError(
//           "Phone number must be a string",
//           400
//         )
//       );
//     }

//     const trimmedPhone = phone.trim();

//     // If provided, validate Nepal phone number
//     if (trimmedPhone !== "") {
//       const phoneRegex = /^(?:\+977)?9[678]\d{8}$/;

//       if (!phoneRegex.test(trimmedPhone)) {
//         return next(
//           new CustomError(
//             "Please provide a valid Nepal phone number",
//             400
//           )
//         );
//       }
//     }
//   }

//   // =========================
//   // Optional address
//   // =========================
//   if (address !== undefined && address !== null) {
//     if (typeof address !== "string") {
//       return next(
//         new CustomError(
//           "Address must be a string",
//           400
//         )
//       );
//     }

//     if (address.trim().length > 100) {
//       return next(
//         new CustomError(
//           "Address cannot exceed 100 characters",
//           400
//         )
//       );
//     }
//   }

//   // =========================
//   // Optional DOB
//   // =========================
//   if (dob !== undefined && dob !== null && dob !== "") {
//     const date = new Date(dob);

//     if (isNaN(date.getTime())) {
//       return next(
//         new CustomError(
//           "Invalid date of birth",
//           400
//         )
//       );
//     }
//   }

//   // Everything is valid
//   next();
// };

// const loginValidation = (req, res, next) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return next(
//       new CustomError(
//         "Email and password are required",
//         400
//       )
//     );
//   }

//   if (typeof email !== "string") {
//     return next(
//       new CustomError("Email must be a string", 400)
//     );
//   }

//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//   if (!emailRegex.test(email.trim())) {
//     return next(
//       new CustomError(
//         "Please provide a valid email",
//         400
//       )
//     );
//   }

//   if (typeof password !== "string") {
//     return next(
//       new CustomError("Password must be a string", 400)
//     );
//   }

//   next();
// };
// module.exports = { userValidation, loginValidation };
