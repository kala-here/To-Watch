export const getPlaceholder = (wrapper, ariaLabel) => {
  return getElement(wrapper, ariaLabel).attributes('placeholder');
};

export const getElement = (wrapper, ariaLabel) => {
  return wrapper.find(`[aria-label="${ariaLabel}"]`);
};
