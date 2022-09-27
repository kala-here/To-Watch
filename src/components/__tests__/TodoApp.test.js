import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect } from 'vitest';
import TodoApp from '../TodoApp.vue';
import {
  getPlaceholder,
  getElement,
  getCheckbox,
  getAriaLabel,
} from './utils/helpers';

describe('To watch tests', () => {
  let wrapper;
  let toWatchList;
  const inputAriaLabel = 'new to-watch item';

  beforeEach(() => {
    wrapper = mount(TodoApp);
    toWatchList = getElement(wrapper, 'to-watch list');
  });

  it('renders the header', () => {
    const header = wrapper.get('h1');

    expect(header.text()).toBe('TODO-WATCH');
  });

  it('has an input field with placeholder text "what to watch"', () => {
    expect(getPlaceholder(wrapper, inputAriaLabel)).toBe('whatchya thinkin?');
  });

  it('submitting the new to-watch item add it to a list', async () => {
    const addingItem = 'The 100';
    const inputField = getElement(wrapper, inputAriaLabel);

    expect(toWatchList.findAll('li')).toHaveLength(0);

    await inputField.setValue(addingItem);
    await inputField.trigger('keyup.enter');

    expect(toWatchList.findAll('li')).toHaveLength(1);
    expect(toWatchList.text()).toMatch(addingItem);
  });

  it('can check off watched items', async () => {
    const toWatchItem = toWatchList.findAll('li')[0];
    const checkbox = getCheckbox(toWatchItem);

    expect(getAriaLabel(toWatchItem)).toBe('to-watch item');
    expect(checkbox).not.toBe(null);

    await checkbox.setChecked();

    expect(getAriaLabel(toWatchItem)).toBe('watched item');
  });
});
