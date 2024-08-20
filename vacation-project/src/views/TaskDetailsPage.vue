<template>
  <div class="task-details-container">
    <h1>Task Details</h1>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading">Loading...</div>

    <!-- Error State -->
    <div v-if="error" class="error">{{ error }}</div>

    <!-- Task Details -->
    <div v-else class="task-details">
      <p><strong>Employee Name:</strong> {{ username || 'N/A' }}</p>
      <p><strong>Status:</strong> <span :class="statusClass">{{ task?.Properties?.Status || 'N/A' }}</span></p>
      <p><strong>Type:</strong> {{ task?.Properties?.Type || 'N/A' }}</p>
      <p><strong>Start Date:</strong> {{ formattedStartDate }}</p>
      <p><strong>End Date:</strong> {{ formattedEndDate }}</p>
      <p><strong>Number of Days:</strong> {{ task?.Properties?.NumberOfDays || 'N/A' }}</p>
      
      <div class="button-group">
        <button 
          @click="approveTask" 
          :disabled="task?.Properties?.Status === 'Approved' || task?.Properties?.Status === 'Rejected'">
          Approve
        </button>
        <button 
          @click="rejectTask" 
          :disabled="task?.Properties?.Status === 'Rejected' || task?.Properties?.Status === 'Approved'">
          Reject
        </button>
      </div>
    </div>
  </div>
</template>


<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: localStorage.getItem('user') || 'Guest',
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
.task-details-container {
  max-width: 600px;
  margin: 50px auto;
  padding: 40px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  font-family: 'Roboto', sans-serif;
}

/* Heading Styling */
h1 {
  font-size: 28px;
  color: #333;
  margin-bottom: 30px;
  text-align: center;
  font-weight: bold;
}

/* Task Details Styling */
.task-details p {
  font-size: 18px;
  color: #444;
  margin-bottom: 20px;
  line-height: 1.6;
}

/* Status Styling */
.status-pending {
  color: #f0ad4e;
  font-weight: bold;
}

.status-approved {
  color: #5cb85c;
  font-weight: bold;
}

.status-rejected {
  color: #d9534f;
  font-weight: bold;
}

/* Button Group Styling */
.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
}

/* Button Styling */
button {
  flex: 1;
  padding: 12px 0;
  font-size: 18px;
  color: #ffffff;
  background-color: #007bff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-right: 15px;
}

button:last-child {
  margin-right: 0;
}

button:hover {
  background-color: #0056b3;
}

button:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}

/* Loading and Error Styling */
.loading {
  font-size: 20px;
  color: #555;
  text-align: center;
  margin-top: 20px;
}

.error {
  color: #d9534f;
  font-weight: bold;
  text-align: center;
  margin-top: 20px;
}
</style>

