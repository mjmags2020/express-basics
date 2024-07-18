export const createUserValidationSchema = {
  username: {
    isString: {
      errorMessage: "Username must be a string",
    },
    notEmpty: {
      errorMessage: "Username is  required",
    },
    isLength: {
      options: {
        min: 3,
        max: 10,
      },
      errorMessage: "Username must be 3 - 10 characters",
    },
  },
  age: {
    notEmpty: {
      errorMessage: "Age is required",
    },
  },
};
