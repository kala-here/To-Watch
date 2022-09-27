import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect } from 'vitest';
import TodoApp from '../TodoApp.vue';
import { getPlaceholder, getElement } from './utils/helpers';

describe('To watch tests', () => {
  let wrapper;
  const inputAriaLabel = 'new to-watch item';

  beforeEach(() => {
    wrapper = mount(TodoApp);
  });

  it('renders the header', () => {
    const header = wrapper.get('.todoapp > .header');

    expect(header.text()).toBe('TODO-WATCH');
  });

  it('has an input field with placeholder text "what to watch"', () => {
    expect(getPlaceholder(wrapper, inputAriaLabel)).toBe('whatchya thinkin?');
  });

  it('submitting the new to-watch item add it to a list', async () => {
    const addingItem = 'The 100';
    const inputField = getElement(wrapper, inputAriaLabel);
    const toWatchList = getElement(wrapper, 'to-watch list');
    
    expect(toWatchList.findAll('li')).toHaveLength(0);

    await inputField.setValue(addingItem);
    await inputField.trigger('keyup.enter');

    expect(toWatchList.findAll('li')).toHaveLength(1);
    expect(toWatchList.text()).toMatch(addingItem);
  });
});
