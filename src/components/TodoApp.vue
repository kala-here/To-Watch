<template>
  <div>hi</div>
</template>

<script>
export default {
  name: 'TodoApp',

  data() {
    return {
      todos: [
        {
          id: 1,
          text: 'Learn Vue.js 3',
          completed: false,
        },
      ],
    };
  },
};
</script>
