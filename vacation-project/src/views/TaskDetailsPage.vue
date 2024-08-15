<template>
    <div>
      <h1>Task Details</h1>
      <p><strong>Task Title:</strong> {{ task.title }}</p>
      <p><strong>Status:</strong> {{ task.status }}</p>
      <p><strong>Description:</strong> {{ task.description }}</p>
      <button @click="approveTask" :disabled="task.status === 'Approved'">Approve</button>
      <button @click="rejectTask" :disabled="task.status === 'Rejected'">Reject</button>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        task: {},
      };
    },
    methods: {
      fetchTaskDetails() {
        const taskId = this.$route.params.id;
        // Mock task data, replace this with actual API call
        const tasks = [
          { id: 1, title: 'Task 1', status: 'Completed', description: 'Complete the report.' },
          { id: 2, title: 'Task 2', status: 'Pending', description: 'Prepare for the meeting.' },
          { id: 3, title: 'Task 3', status: 'In Progress', description: 'Develop the new feature.' },
        ];
        this.task = tasks.find(task => task.id === parseInt(taskId)) || {};
      },
      approveTask() {
        this.task.status = 'Approved';
        alert('Task approved!');
      },
      rejectTask() {
        this.task.status = 'Rejected';
        alert('Task rejected!');
      },
    },
    mounted() {
      this.fetchTaskDetails();
    },
  };
  </script>
  
  <style scoped>
  /* Container Styling */
  div {
    max-width: 500px;
    margin: 0 auto;
    padding: 30px;
    background-color: #f4f4f4;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  /* Heading Styling */
  h1 {
    font-size: 24px;
    color: #333;
    margin-bottom: 20px;
    font-family: 'Arial', sans-serif;
  }
  
  /* Task Details Styling */
  p {
    font-size: 16px;
    color: #555;
    margin-bottom: 15px;
  }
  
  /* Button Styling */
  button {
    padding: 10px 20px;
    font-size: 16px;
    color: #fff;
    background-color: #007bff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 10px;
    transition: background-color 0.3s ease;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  
  button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  </style>
  