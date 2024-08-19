<template>
  <div>
    <h1>Task Details</h1>

    <!-- Loading State -->
    <div v-if="isLoading">Loading...</div>

    <!-- Error State -->
    <div v-if="error" class="error">{{ error }}</div>

    <!-- Task Details -->
    <div v-else>
      <p><strong>Task Title:</strong> {{ task?.Properties?.Title || 'N/A' }}</p>
      <p><strong>Status:</strong> {{ task?.Properties?.Status || 'N/A' }}</p>
      <p><strong>Type:</strong> {{ task?.Properties?.Type || 'N/A' }}</p>
      <p><strong>Start Date:</strong> {{ formattedStartDate }}</p>
      <p><strong>End Date:</strong> {{ formattedEndDate }}</p>
      <p><strong>Number of Days:</strong> {{ task?.Properties?.NumberOfDays || 'N/A' }}</p>
      <button @click="approveTask" :disabled="task?.Properties?.Status != 'Pending'|| task?.Properties?.Status != 'Pending HR'">Approve</button>
      <button @click="rejectTask"  :disabled="task?.Properties?.Status != 'Pending'|| task?.Properties?.Status != 'Pending HR'">Reject</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      task: {},
      isLoading: true,
      error: null,
      isManager: false, 
    };
  },
  computed: {
    formattedStartDate() {
      return this.task?.Properties?.StartDate ? new Date(this.task.Properties.StartDate).toLocaleDateString() : '';
    },
    formattedEndDate() {
      return this.task?.Properties?.EndDate ? new Date(this.task.Properties.EndDate).toLocaleDateString() : '';
    }
  },
  methods: {
    async fetchTaskDetails() {
      const taskId = this.$route.params.id;

      this.isLoading = true;
      this.error = null;

      try {
        // Fetch the task details to get the entityInstanceId
        const response = await axios.get(`http://psuite:81/home/Development/app/entityRestService/api/OpenTextInboxTaskManagement/entities/InboxTask/items/${taskId}`, {
          headers: {
            accept: 'application/json',
            CSRFToken: 'Development',
            SAMLart: localStorage.getItem('token'),
          },
        });

        const entityInstanceId = response.data.Task.EntityInstanceId.split('.').pop(); // Extract the ID from the response

        // Fetch the entity details using the entityInstanceId
        const entityResponse = await axios.get(`http://psuite:81/home/Development/app/entityRestService/api/MyCompany4VacationProcess/entities/VacationEntity/items/${entityInstanceId}`, {
          headers: {
            accept: 'application/json',
            CSRFToken: 'Development',
            SAMLart: localStorage.getItem('token'),
          },
        });

        // Set the task details
        this.task = entityResponse.data;
        
        // Determine if the task is for a manager or HR
        this.isManager = this.task.Properties.Status === 'Pending';

      } catch (error) {
        this.error = 'Failed to fetch task details. Please try again later.';
        console.error('Failed to fetch task details:', error);
      } finally {
        this.isLoading = false;
      }
    },
    async approveTask() {
      if (this.task?.Properties?.Status !== 'Approved') {
        try {
          await axios.post(`http://psuite:81/home/Development/app/entityRestService/api/OpenTextInboxTaskManagement/entities/InboxTask/items/${this.$route.params.id}/tasks/actions/Claim`, {}, {
            headers: {
              accept: 'application/json',
              'Content-Type': 'application/json',
              CSRFToken: 'Development',
              SAMLart: localStorage.getItem('token'),
            },
          });

          // Update the entity based on whether the task is for a manager or HR
          const updatedProperties = this.isManager
            ? { Status: 'Pending HR', MangerApprovel: 'Approved' }
            : { Status: 'Approved', HrApprovel: 'Approved' };

          await this.updateTaskStatus(updatedProperties);

          alert('Task approved!');
          this.$router.push('/user-details');
        } catch (error) {
          console.error('Failed to approve the task:', error);
          alert('Failed to approve the task.');
        }
      }
    },
    async rejectTask() {
    if (this.task?.Properties?.Status !== 'Rejected') {
      try {
        // Step 1: Claim the task
        await axios.post(`http://psuite:81/home/Development/app/entityRestService/api/OpenTextInboxTaskManagement/entities/InboxTask/items/${this.$route.params.id}/tasks/actions/Claim`, {}, {
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            CSRFToken: 'Development',
            SAMLart: localStorage.getItem('token'),
          },
        });

        // Step 2: Update the task status to "Rejected"
        await this.updateTaskStatus({ Status: 'Rejected' });

        alert('Task rejected!');
        this.$router.push('/user-details');

      } catch (error) {
        console.error('Failed to reject the task:', error);
        alert('Failed to reject the task.');
      }
    }
  },
    async updateTaskStatus(updatedProperties) {
      try {
        const entityInstanceId = this.task.Identity.Id;

        await axios.put(`http://psuite:81/home/Development/app/entityRestService/api/MyCompany4VacationProcess/entities/VacationEntity/items/${entityInstanceId}`, {
          Properties: updatedProperties
        }, {
          headers: {
            accept: '*/*',
            'Content-Type': 'application/json',
            CSRFToken: 'Development',
            SAMLart: localStorage.getItem('token'),
          },
        });

        this.task.Properties = { ...this.task.Properties, ...updatedProperties }; // Update local status after successful API call
        
        // Call the completion API after updating the task status
        await this.completeTask();

      } catch (error) {
        console.error('Failed to update the task:', error);
        alert('Failed to update the task.');
      }
    },
    async completeTask() {
      try {
        await axios.post(`http://psuite:81/home/Development/app/entityRestService/api/OpenTextInboxTaskManagement/entities/InboxTask/items/${this.$route.params.id}/tasks/actions/Complete`, {}, {
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            CSRFToken: 'Development',
            SAMLart: localStorage.getItem('token'),
          },
        });
        alert('Task completed successfully!');
      } catch (error) {
        console.error('Failed to complete the task:', error);
        alert('Failed to complete the task.');
      }
    },
  },
  mounted() {
    this.fetchTaskDetails();
  }
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

/* Error Styling */
.error {
  color: red;
  font-weight: bold;
}
</style>
