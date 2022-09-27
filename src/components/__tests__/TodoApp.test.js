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
  let inputField;
  const inputAriaLabel = 'new to-watch item';
  const addingSingleItemTitle = 'The 100';

  beforeEach(() => {
    wrapper = mount(TodoApp);
    toWatchList = getElement(wrapper, 'to-watch list');
    inputField = getElement(wrapper, inputAriaLabel);
  });

  it('renders the header', () => {
    const header = wrapper.get('h1');

    expect(header.text()).toBe('TODO-WATCH');
  });

  it('has an input field with placeholder text "what to watch"', () => {
    expect(getPlaceholder(wrapper, inputAriaLabel)).toBe('whatchya thinkin?');
  });

  it('adds the new item to the list', async () => {
    expectListLengthToBe(0);

    await inputField.setValue(addingSingleItemTitle);
    await inputField.trigger('keyup.enter');

    expectListLengthToBe(1);
    expectTextInListAtIndex(addingSingleItemTitle, 0);
  });

  it('can check off watched items', async () => {
    const toWatchItem = toWatchList.findAll('li')[0];
    const checkbox = getCheckbox(toWatchItem);

    expect(getAriaLabel(toWatchItem)).toBe('to-watch item');
    expect(checkbox).not.toBe(null);

    await checkbox.setChecked();

    expect(getAriaLabel(toWatchItem)).toBe('watched item');
  });

  it('can remove an item from the watch list', async () => {
    expectListLengthToBe(1);

    await removeItemFromList(addingSingleItemTitle);
    expectListLengthToBe(0);
  });

  it('can add and remove multiple items in the watch list', async () => {
    expectListLengthToBe(0);

    const addingItems = {
      QUEER_EYE: 'Queery Eye',
      GREAT_BAKING_SHOW: 'The Great British Baking Show',
      ATLANTA: 'Atlanta',
    };
    const addingItemKeys = Object.keys(addingItems);

    for (const key of addingItemKeys) {
      await inputField.setValue(addingItems[key]);
      await inputField.trigger('keyup.enter');
    }

    expectListLengthToBe(addingItemKeys.length);

    for (let i = 0; i++; i < addingItemKeys.length) {
      const showTitle = addingItems[addingItemKeys[i]];
      expectTextInListAtIndex(showTitle, i);
    }

    await removeItemFromList(addingItems.GREAT_BAKING_SHOW);
    expectListLengthToBe(addingItemKeys.length - 1);
    expectTextInListAtIndex(addingItems.QUEER_EYE, 0);
    expectTextInListAtIndex(addingItems.ATLANTA, 1);

    await removeItemFromList(addingItems.QUEER_EYE);
    expectListLengthToBe(addingItemKeys.length - 2);
    expectTextInListAtIndex(addingItems.ATLANTA, 0);

    await removeItemFromList(addingItems.ATLANTA);
    expectListLengthToBe(addingItemKeys.length - 3);
  });

  const removeItemFromList = async (title) => {
    const destroyButton = getElement(
      wrapper,
      `remove ${title.toLowerCase()} from the list`
    );

    await destroyButton.trigger('click');
  };

  const expectListLengthToBe = (expectedLength) => {
    expect(toWatchList.findAll('li')).toHaveLength(expectedLength);
    expectedLength;
  };
  const expectTextInListAtIndex = (expectedText, index) => {
    expect(toWatchList.findAll('li')[index].text()).toMatch(expectedText);
  };
});
