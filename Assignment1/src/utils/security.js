// Security utility functions for XSS protection and input validation

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input
  return input.trim().replace(/[<>]/g, '')
}

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password) => {
  return password && password.length >= 6
}

export const validateAge = (age) => {
  const numAge = parseInt(age)
  return numAge >= 1 && numAge <= 100
}

export const validatePostcode = (postcode) => {
  const postcodeRegex = /^3\d{3}$/
  return postcodeRegex.test(postcode)
}
