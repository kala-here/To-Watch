export const getCheckbox = (element) => {
  return element.find('[type="checkbox"]');
};

export const getPlaceholder = (wrapper, ariaLabel) => {
  return getElement(wrapper, ariaLabel).attributes('placeholder');
};

export const getElement = (wrapper, ariaLabel) => {
  return wrapper.find(`[aria-label="${ariaLabel}"]`);
};

export const getAriaLabel = (element) => {
  return element.attributes('aria-label');
};
