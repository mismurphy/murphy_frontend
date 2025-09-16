export const userValidationSchema = {
  name: {
    required: 'Name is required',
    pattern: { value: /^[a-zA-Z\s]+$/, message: 'Invalid name' }
  },
  dep_id: {
    required: 'Department ID is required',
    minLength: { value: 1, message: 'Department ID must be at least 1 digit' },
    maxLength: { value: 5, message: 'Department ID must be at most 5 digits' },
    pattern: { value: /^[0-9]+$/, message: 'Department ID must contain only digits' }
  },
  designation: {
    required: 'Designation is required',
    pattern: { value: /^[a-zA-Z\s]+$/, message: 'Invalid designation' }
  },
  role_id: {
    required: 'Role ID is required',
    minLength: { value: 1, message: 'Role ID must be at least 1 digit' },
    maxLength: { value: 5, message: 'Role ID must be at most 5 digits' },
    pattern: { value: /^[0-9]+$/, message: 'Role ID must contain only digits' }
  },
  registered_email: {
    required: 'registered_email is required',
    pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid registered_email address' }
  },
  phone_number: {
    required: 'Phone number is required',
    minLength: { value: 10, message: 'Phone number must be 10 digits' },
    maxLength: { value: 10, message: 'Phone number must be 10 digits' },
    pattern: { value: /^[0-9]+$/, message: 'Phone number must contain only digits' }
  },
  address: {
    required: 'Address is required',
    minLength: { value: 5, message: 'Address must be at least 5 characters' },
    maxLength: { value: 200, message: 'Address must be at most 200 characters' }
  },
  aadhar_num: {
    required: 'Aadhar number is required',
    minLength: { value: 12, message: 'Aadhar number must be 12 digits' },
    maxLength: { value: 12, message: 'Aadhar number must be 12 digits' },
    pattern: { value: /^[0-9]+$/, message: 'Aadhar number must contain only digits' }
  },
  pan_num: {
    required: 'PAN number is required',
    minLength: { value: 10, message: 'PAN number must be 10 characters' },
    maxLength: { value: 10, message: 'PAN number must be 10 characters' },
    pattern: { value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, message: 'PAN number must be in the format: 5 letters, 4 digits, 1 letter (e.g., AAAPA1234A)' }
  },
  image_aadhar: {
    required: 'Aadhar image is required',
    pattern: { value: /\.(jpeg|jpg|png)$/, message: 'Only jpeg, jpg, png files are allowed' }
  },
  image_pan: {
    required: 'PAN image is required',
    pattern: { value: /\.(jpeg|jpg|png)$/, message: 'Only jpeg, jpg, png files are allowed' }
  },

  dob: {
    required: 'Date of Birth is required',
    pattern: { value: /^\d{4}-\d{2}-\d{2}$/, message: 'Date of Birth must be in YYYY-MM-DD format' },
    validate: (value) => {
      const today = new Date();
      const dob = new Date(value);
      const age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--; // Adjust if birthday hasn’t occurred yet this year
      }
      return age >= 18 || 'Employee must be at least 18 years old';
    }
  },
  doj: {
    required: 'Date of Joining is required',
    pattern: { value: /^\d{4}-\d{2}-\d{2}$/, message: 'Date of Joining must be in YYYY-MM-DD format' },
    validate: (value) => {
      const today = new Date();
      const doj = new Date(value);
      return doj <= today || 'Date of Joining cannot be in the future';
    }
  },
  activeYN: {
    required: 'Active status is required',
    pattern: { value: /^[YN]$/, message: 'Active status must be Y or N' }
  }
};

export const emailSchema = {
  required: 'Email is required',
  pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' }
};

export const passwordSchema = {
  required: 'Password is required',
  minLength: {
    value: 10,
    message: 'Password must be at least 10 characters'
  },
  pattern: {
    value: /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).+$/,
    message: 'Password must contain at least one uppercase letter and one special character'
  }
};

export const confirmPasswordSchema = {
  required: 'confirm Password is required',
  minLength: {
    value: 10,
    message: ' confirm Password must be at least 10 characters'
  },
  pattern: {
    value: /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).+$/,
    message: 'confirm Password must contain at least one uppercase letter and one special character'
  }
};

export const firstNameSchema = {
  required: 'First name is required',
  pattern: { value: /^[a-zA-Z\s]+$/, message: 'Invalid first name' }
};

export const lastNameSchema = {
  required: 'Last name is required',
  pattern: { value: /^[a-zA-Z\s]+$/, message: 'Invalid last name' }
};
export const mobileNumberSchema = {
  required: 'Mobile number is required',
  pattern: { value: /^[0-9]{10}$/, message: 'Mobile number must be 10 digits' }
};
// export const mobileNumberSchema = {
//   required: 'Mobile number is required',
//   pattern: {
//     value: /^\+?[0-9]{7,15}$/,
//     message: 'Enter a valid mobile number (7–15 digits, optional +)'
//   }
// };