import toast from "react-hot-toast";

// Toast configurations
const TOAST_CONFIG = {
  duration: 4000,
  position: "top-center" as const,
  style: {
    borderRadius: "8px",
    padding: "12px 16px",
    fontSize: "14px",
    fontWeight: "500",
  },
};

const SUCCESS_STYLE = {
  ...TOAST_CONFIG.style,
  background: "#10B981",
  color: "#fff",
};

const ERROR_STYLE = {
  ...TOAST_CONFIG.style,
  background: "#EF4444",
  color: "#fff",
};

/**
 * Shows a success toast notification
 * @param message - The success message to display
 * @param options - Optional toast configuration
 */
export const showSuccessToast = (
  message: string,
  options?: Partial<typeof TOAST_CONFIG>
) => {
  return toast.success(message, {
    duration: options?.duration || TOAST_CONFIG.duration,
    position: options?.position || TOAST_CONFIG.position,
    style: { ...SUCCESS_STYLE, ...options?.style },
  });
};

/**
 * Shows an error toast notification
 * @param message - The error message to display
 * @param options - Optional toast configuration
 */
export const showErrorToast = (
  message: string,
  options?: Partial<typeof TOAST_CONFIG>
) => {
  return toast.error(message, {
    duration: options?.duration || TOAST_CONFIG.duration,
    position: options?.position || TOAST_CONFIG.position,
    style: { ...ERROR_STYLE, ...options?.style },
  });
};
