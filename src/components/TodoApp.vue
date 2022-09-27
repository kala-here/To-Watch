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
      <!-- <input
        id="toggle-all"
        class="toggle-all"
        type="checkbox"
        :checked="remaining === 0"
        @change="toggleAll"
      />
      <label for="toggle-all">Mark all as complete</label> -->
      <ul aria-label="to-watch list">
        <li v-for="todo in filteredTodos" class="todo" :key="todo.id">
          <div class="view">
            <label>{{ todo.title }}</label>
          </div>
        </li>
      </ul>
    </section>
    <!-- <footer class="footer" v-show="todos.length">
      <span class="todo-count">
        <strong>{{ remaining }}</strong>
        <span>{{ remaining === 1 ? 'item' : 'items' }} left</span>
      </span>
      <ul class="filters">
        <li>
          <a href="#/all" :class="{ selected: visibility === 'all' }">All</a>
        </li>
        <li>
          <a href="#/active" :class="{ selected: visibility === 'active' }"
            >Active</a
          >
        </li>
        <li>
          <a
            href="#/completed"
            :class="{ selected: visibility === 'completed' }"
            >Completed</a
          >
        </li>
      </ul>
      <button
        class="clear-completed"
        @click="removeCompleted"
        v-show="todos.length > remaining"
      >
        Clear completed
      </button>
    </footer> -->
  </section>
</template>

<script>
const STORAGE_KEY = 'vue-todomvc';

const filters = {
  all: (todos) => todos,
  active: (todos) => todos.filter((todo) => !todo.completed),
  completed: (todos) => todos.filter((todo) => todo.completed),
};

export default {
  // app initial state
  data: () => ({
    todos: JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'),
    editedTodo: null,
    visibility: 'all',
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

  mounted() {
    window.addEventListener('hashchange', this.onHashChange);
    this.onHashChange();
  },

  computed: {
    filteredTodos() {
      return filters[this.visibility](this.todos);
    },
    remaining() {
      return filters.active(this.todos).length;
    },
  },

  // methods that implement data logic.
  // note there's no DOM manipulation here at all.
  methods: {
    toggleAll(e) {
      this.todos.forEach((todo) => (todo.completed = e.target.checked));
    },

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
      this.todos = filters.active(this.todos);
    },

    onHashChange() {
      var visibility = window.location.hash.replace(/#\/?/, '');
      if (filters[visibility]) {
        this.visibility = visibility;
      } else {
        window.location.hash = '';
        this.visibility = 'all';
      }
    },
  },
};
</script>
<style>
.text--linethrough {
  text-decoration: line-through;
}
</style>
