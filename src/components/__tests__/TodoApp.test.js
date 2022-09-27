import { mount } from '@vue/test-utils';
import { beforeEach, describe } from 'vitest';
import TodoApp from '../TodoApp.vue';
import { getPlaceholder } from './utils/helpers';

describe('To watch tests', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(TodoApp);
  });

  it('renders the header', () => {
    const header = wrapper.get('.todoapp > .header');

    expect(header.text()).toBe('TODO-WATCH');
  });

  it('has an input field with placeholder text "what to watch"', () => {
    expect(getPlaceholder(wrapper, 'new to watch item')).toBe(
      'whatchya thinkin?'
    );
  });
});
