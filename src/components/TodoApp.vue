<!--
A fully spec-compliant TodoMVC implementation
https://todomvc.com/
-->
<template>
  <div class="d-flex flex-column align-center justify-center w-full">
    <section
      class="to-watch__card d-flex flex-column align-center justify-center w-500 pa-1212"
    >
      <header class="w-full d-flex flex-column align-center mb-4">
        <h1>TO<span class="text--linethrough">DO</span>-WATCH</h1>

        <input
          class="mt-2 textfield w-full"
          aria-label="new to-watch item"
          autofocus
          placeholder="whatchya thinkin?"
          @keyup.enter="addTodo"
        />
      </header>

      <section
        v-show="todos.length"
        aria-label="to-watch list"
        class="to-watch__list my-8 w-auto max-h-600"
      >
        <div
          v-for="todo in filteredTodos"
          :key="todo.id"
          :class="[
            'to-watch__list-item d-flex justify-space-between align-center mt-4 w-full',
            {
              'to-watch__list-item--hovered': todo.isHovered,
            },
          ]"
          :aria-label="todo.completed ? 'watched item' : 'to-watch item'"
          @mouseenter="todo.isHovered = true"
          @mouseleave="todo.isHovered = false"
        >
          <div>
            <input type="checkbox" v-model="todo.completed" />
            <label>{{ todo.title }}</label>
          </div>
          <i
            v-if="todo.isHovered"
            @click="removeTodo(todo)"
            :aria-label="`remove ${todo.title.toLowerCase()} from the list`"
            class="material-icons button--inline"
            >delete</i
          >
          <div v-else class="w-18 ml-2" />
        </div>
      </section>
    </section>

    <footer class="footer d-flex flex-column align-center justify-center my-8">
      <section v-show="todos.length" class="my-4 d-flex">
        <button
          v-for="key of Object.keys(filterOptions)"
          :key="key"
          :class="['filter-button', { 'button--selected': visibility === key }]"
          :aria-label="filterOptions[key].ariaLabel"
          @click="onFilterChange(key)"
        >
          {{ filterOptions[key].label }}
        </button>
      </section>

      <button
        class="mt-4"
        @click="removeCompleted"
        v-show="todos.length > remaining"
        aria-label="clear all completed items"
      >
        Clear Watched Items
      </button>
    </footer>
  </div>
</template>

<script>
const STORAGE_KEY = 'vue-todomvc';

export default {
  name: 'TodoApp',
  // app initial state
  data: () => ({
    todos: JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'),
    visibility: 'ALL',
    filterOptions: {
      ALL: {
        ariaLabel: 'click to show all items',
        filterFunction: (todos) => todos,
        label: 'All',
      },
      WATCH_LIST: {
        ariaLabel: 'click to show only not-yet-watched items',
        filterFunction: (todos) => todos.filter((todo) => !todo.completed),
        label: 'Watch List',
      },
      WATCHED: {
        ariaLabel: 'click to show only watched items',
        filterFunction: (todos) => todos.filter((todo) => todo.completed),
        label: 'Watched',
      },
    },
  }),

  // watch todos change for localStorage persistence
  watch: {
    todos: {
      handler(todos) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
      },
      deep: true,
    },
  },

  computed: {
    filteredTodos() {
      return this.filterOptions[this.visibility].filterFunction(this.todos);
    },
    remaining() {
      return this.filterOptions.WATCH_LIST.filterFunction(this.todos).length;
    },
  },

  // methods that implement data logic.
  // note there's no DOM manipulation here at all.
  methods: {
    addTodo(e) {
      const value = e.target.value.trim();
      if (!value) {
        return;
      }
      this.todos.push({
        id: Date.now(),
        title: value,
        completed: false,
      });
      e.target.value = '';
    },

    removeTodo(todo) {
      this.todos.splice(this.todos.indexOf(todo), 1);
    },

    removeCompleted() {
      this.todos = this.filterOptions.WATCH_LIST.filterFunction(this.todos);
    },

    onFilterChange(visibility) {
      this.visibility = this.filterOptions[visibility] ? visibility : 'ALL';
    },
  },
};
</script>

<style lang="scss">
.to-watch__list {
  max-height: 42vh;
  overflow-y: auto;
  box-shadow: rgba(45, 35, 66, 0.4) 0 2px 4px,
    rgba(45, 35, 66, 0.3) 0 7px 13px -3px, rgba(58, 65, 111, 0.5) 0 -3px 0 inset;
  border-radius: 4px;
  padding-left: 24px;
  padding-right: 24px;
  padding-bottom: 24px;

  &-item {
    padding: 8px;
    &--hovered {
      box-shadow: rgba(45, 35, 66, 0.4) 0 2px 4px,
        rgba(45, 35, 66, 0.3) 0 7px 13px -3px,
        rgba(58, 65, 111, 0.5) 0 -3px 0 inset;
      border-radius: 4px;
    }
  }
}
.footer {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
}
</style>
