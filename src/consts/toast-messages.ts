/**
 * Predefined toast messages for common scenarios
 */
export const TOAST_MESSAGES = {
  // Form submission messages
  FORM_SUCCESS: "Message sent successfully! 🎉",
  FORM_ERROR: "Failed to send message. Please try again.",
  FORM_NETWORK_ERROR:
    "An error occurred while sending the message. Please check your connection and try again.",

  // Generic messages
  SUCCESS: "Operation completed successfully!",
  ERROR: "Something went wrong. Please try again.",
  LOADING: "Processing...",
} as const;
