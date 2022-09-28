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

export const getAllByText = (wrapper, text) => {
  /*
  Get all elements with the given text.
   */
  return wrapper.findAll("*").filter(node => node.text() === text)
}

export const getByText = (wrapper, text) => {
  /*
  Get the first element that has the given text.
   */
  const results = getAllByText(wrapper, text)
  if (results.length === 0) {
    throw new Error(`getByText() found no element with the text: "${text}".`)
  }
  return results.at(0)
}