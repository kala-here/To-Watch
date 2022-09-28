import Vue from '@vitejs/plugin-vue';
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
  let watchList;
  let inputField;
  let filterElements;
  const inputAriaLabel = 'new to-watch item';
  const addingSingleItemTitle = 'The 100';
  const addingItems = {
    QUEER_EYE: 'Queery Eye',
    GREAT_BAKING_SHOW: 'The Great British Baking Show',
    ATLANTA: 'Atlanta',
  };
  const addingItemKeys = Object.keys(addingItems);

  beforeEach(() => {
    wrapper = mount(TodoApp);
    watchList = getElement(wrapper, 'to-watch list');
    inputField = getElement(wrapper, inputAriaLabel);
    filterElements = {
      ALL: getElement(wrapper, 'click to show all items'),
      WATCH_LIST: getElement(
        wrapper,
        'click to show only not-yet-watched items'
      ),
      WATCHED: getElement(wrapper, 'click to show only watched items'),
    };
  });
  // TODO: after each localstorage.clear()

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
    const watchListItem = getVisibleListItems()[0];
    await setAndTestCheckedBox(watchListItem);
  });

  it('can remove an item from the watch list', async () => {
    expectListLengthToBe(1);

    await removeItemFromList(addingSingleItemTitle);
    expectListLengthToBe(0);
  });

  it('can add and remove multiple items in the watch list', async () => {
    expectListLengthToBe(0);

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

  it('allows user to filter on All, Watched, and Not Watched', async () => {
    const filterLinks = wrapper.findAll('button');
    expect(filterLinks).toHaveLength(3);

    expectListLengthToBe(0);

    for (const key of addingItemKeys) {
      await inputField.setValue(addingItems[key]);
      await inputField.trigger('keyup.enter');
    }

    expectListLengthToBe(addingItemKeys.length);
    const watchListItem = getVisibleListItems()[1];
    expect(watchListItem.text()).toBe(addingItems.GREAT_BAKING_SHOW);
    await setAndTestCheckedBox(watchListItem);

    expect(filterElements.WATCH_LIST).not.toBeNull();
    await filterElements.WATCH_LIST.trigger('click');
    expectListLengthToBe(addingItemKeys.length - 1);
    expect(getVisibleListItems()[0].text()).toBe(addingItems.QUEER_EYE);
    expect(getVisibleListItems()[1].text()).toBe(addingItems.ATLANTA);

    expect(filterElements.WATCHED).not.toBeNull();
    await filterElements.WATCHED.trigger('click');
    expectListLengthToBe(1);
  });

  // ----------- HELPERS -----------
  const setAndTestCheckedBox = async (watchListItem) => {
    const checkbox = getCheckbox(watchListItem);

    expect(getAriaLabel(watchListItem)).toBe('to-watch item');
    expect(checkbox).not.toBe(null);

    await checkbox.setChecked();

    expect(getAriaLabel(watchListItem)).toBe('watched item');
  };

  const removeItemFromList = async (title) => {
    const destroyButton = getElement(
      wrapper,
      `remove ${title.toLowerCase()} from the list`
    );

    await destroyButton.trigger('click');
  };

  const expectListLengthToBe = (expectedLength) => {
    expect(getVisibleListItems()).toHaveLength(expectedLength);
    expectedLength;
  };
  const expectTextInListAtIndex = (expectedText, index) => {
    expect(getVisibleListItems()[index].text()).toMatch(expectedText);
  };
  const getVisibleListItems = () => watchList.findAll('li');
});
