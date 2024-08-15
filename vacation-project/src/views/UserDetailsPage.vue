
Copy code
<template>
  <div>
    <h1>User Details</h1>
    <p>Welcome, {{ username }}!</p>
    <h2>Your Tasks</h2>
    <p>Total Tasks: {{ tasks.length }}</p>
    <ul>
      <li v-for="task in tasks" :key="task.id">
        <router-link :to="{ name: 'TaskDetails', params: { id: task.id } }">
          {{ task.title }} - {{ task.status }}
        </router-link>
      </li>
    </ul>
    <button @click="goToRequestVacation">Request Vacation</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: localStorage.getItem('user') || 'Guest',
      tasks: [],
    };
  },
  methods: {
    goToRequestVacation() {
      this.$router.push('/request-vacation');
    },
    fetchTasks() {
      this.tasks = [
        { id: 1, title: 'Task 1', status: 'Completed' },
        { id: 2, title: 'Task 2', status: 'Pending' },
        { id: 3, title: 'Task 3', status: 'In Progress' },
      ];
    },
  },
  mounted() {
    this.fetchTasks();
  },
};
</script>

<style scoped>
/* Container Styling */
div {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* Heading Styling */
h1, h2 {
  color: #333;
  font-family: 'Arial', sans-serif;
  margin-bottom: 10px;
}

h1 {
  font-size: 24px;
}

h2 {
  font-size: 20px;
}

/* Paragraph Styling */
p {
  color: #555;
  font-family: 'Arial', sans-serif;
  margin-bottom: 15px;
}

/* Task List Styling */
ul {
  list-style-type: none;
  padding: 0;
}

li {
  padding: 10px;
  margin-bottom: 8px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
}

li:nth-child(even) {
  background-color: #f1f1f1;
}

/* Task Status Styling */
li::after {
  content: attr(data-status);
  float: right;
  color: #888;
  font-size: 12px;
}

/* Button Styling */
button {
  display: inline-block;
  padding: 10px 20px;
  margin-top: 20px;
  font-size: 16px;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3;
}
</style>

