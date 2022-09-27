export const getPlaceholder = (wrapper, ariaLabel) => {
  return wrapper.find(`[aria-label="${ariaLabel}"]`).attributes('placeholder');
};
