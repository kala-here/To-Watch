<!--
A fully spec-compliant TodoMVC implementation
https://todomvc.com/
-->
<template>
  <section class="todoapp">
    <header class="header">
      <h1>TO<span class="text--linethrough">DO</span>-WATCH</h1>

      <input
        aria-label="new to-watch item"
        autofocus
        placeholder="whatchya thinkin?"
        @keyup.enter="addTodo"
      />
    </header>
    <section class="main" v-show="todos.length">
      <ul aria-label="to-watch list">
        <li
          v-for="todo in filteredTodos"
          :key="todo.id"
          :aria-label="todo.completed ? 'watched item' : 'to-watch item'"
        >
          <div class="view">
            <input class="toggle" type="checkbox" v-model="todo.completed" />
            <label>{{ todo.title }}</label>
            <button
              :aria-label="`remove ${todo.title.toLowerCase()} from the list`"
              @click="removeTodo(todo)"
            />
          </div>
        </li>
      </ul>
    </section>

    <div v-show="todos.length">
      <button
        v-for="key of Object.keys(filterOptions)"
        :key="key"
        :class="{ selected: visibility === key }"
        :aria-label="filterOptions[key].ariaLabel"
        @click="onFilterChange(key)"
      >
        {{ filterOptions[key].label }}
      </button>
      <!-- <button
        class="clear-completed"
        @click="removeCompleted"
        v-show="todos.length > remaining"
      >
        Clear completed
      </button> -->
    </div>
  </section>
</template>

<script>
const STORAGE_KEY = 'vue-todomvc';

export default {
  // app initial state
  data: () => ({
    todos: JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'),
    editedTodo: null,
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
      return this.filterOptions['watch-list'].filterFunction(this.todos).length;
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

    editTodo(todo) {
      this.beforeEditCache = todo.title;
      this.editedTodo = todo;
    },

    doneEdit(todo) {
      if (!this.editedTodo) {
        return;
      }
      this.editedTodo = null;
      todo.title = todo.title.trim();
      if (!todo.title) {
        this.removeTodo(todo);
      }
    },

    cancelEdit(todo) {
      this.editedTodo = null;
      todo.title = this.beforeEditCache;
    },

    removeCompleted() {
      this.todos = this.filterOptions['watch-list'].filterFunction(this.todos);
    },

    onFilterChange(visibility) {
      this.visibility = this.filterOptions[visibility] ? visibility : 'ALL';
    },
  },
};
</script>

<style lang="scss">
.text--linethrough {
  text-decoration: line-through;
}
.selected {
  border: 1px solid yellow;
  margin-left: 10px;
}
ul {
  margin: 20px;
  li {
    padding: 5px;
    a {
      padding: 10px;
    }
  }
}
</style>
