<template>
  <div class="user-details">
    <h1 class="header">User Details</h1>
    <p class="welcome">Welcome, {{ username }}!</p>

    <!-- Tabs for HR, Manager Tasks, and Vacations -->
    <div class="tabs">
      <button :class="{ active: activeTab === 'hr' }" @click="switchTab('hr')">
        HR Tasks
      </button>
      <button :class="{ active: activeTab === 'manager' }" @click="switchTab('manager')">
        Manager Tasks
      </button>
      <button :class="{ active: activeTab === 'vacations' }" @click="switchTab('vacations')">
        Vacations
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading">Loading {{ activeTab }}...</div>

    <!-- Error State -->
    <div v-if="error" class="error">{{ error }}</div>

    <!-- Tasks List based on active tab -->
    <div v-if="!isLoading && tasks.length && activeTab !== 'vacations'" class="tasks">
      <h2>Your Tasks</h2>
      <p>Total Tasks: {{ tasks.length }}</p>
      <ul>
        <li v-for="task in tasks" :key="task.id">
          <router-link :to="{ name: 'TaskDetails', params: { id: task.id, isManager: activeTab === 'manager' } }">
            {{ task.Subject }} - {{ getTaskState(task.State) }}<br />
            <small>Source: {{ task.SourceName }}</small>
          </router-link>
        </li>
      </ul>
    </div>

    <!-- Vacation List -->
    <div v-if="!isLoading && vacations.length && activeTab === 'vacations'" class="vacations">
      <h2>Your Vacations</h2>
      <p>Total Vacations: {{ vacations.length }}</p>
      <ul>
        <li v-for="vacation in vacations" :key="vacation.id">
          <p class="vacation-type">{{ vacation.Type }} Vacation - {{ vacation.Status }}</p>
          <p>Dates: {{ vacation.StartDate }} to {{ vacation.EndDate }}</p>
          <p>Number of Days: {{ vacation.NumberOfDays || 'N/A' }}</p>
        </li>
      </ul>
    </div>

    <p v-else-if="!isLoading" class="no-data">No data available for this tab.</p>

    <button @click="goToRequestVacation" class="request-vacation-button">Request Vacation</button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: localStorage.getItem('user') || 'Guest',
      activeTab: 'vacations', // Default to HR tab
      tasks: [],
      vacations: [],
      isLoading: false,
      error: null,
    };
  },
  methods: {
    async fetchTasks(tab) {
      this.isLoading = true;
      this.error = null;
      this.tasks = [];
      this.vacations = [];

      let apiUrl = '';

      if (tab === 'hr') {
        apiUrl =
          'http://psuite:81/home/Development/app/entityRestService/api/OpenTextInboxTaskManagement/entities/InboxTask/lists/AllTasks?Task.Subject=HrApprovalLayout';
      } else if (tab === 'manager') {
        apiUrl =
          'http://psuite:81/home/Development/app/entityRestService/api/OpenTextInboxTaskManagement/entities/InboxTask/lists/AllTasks?Task.Subject=MangerApprovalLayout';
      } else if (tab === 'vacations') {
        apiUrl =
          'http://psuite:81/home/Development/app/entityRestService/api/MyCompany4VacationProcess/entities/VacationEntity/lists/Vactions';
      }

      try {
        const response = await axios.get(apiUrl, {
          headers: {
            accept: 'application/json',
            CSRFToken: 'Development',
            SAMLart: localStorage.getItem('token'),
          },
        });

        if (tab === 'vacations') {
          this.vacations = response.data._embedded?.Vactions?.map((vacation) => ({
            id: vacation._links.item.href.split('/').pop(), // Extracting the ID from the href
            StartDate: vacation.Properties.StartDate.split('Z')[0],
            EndDate: vacation.Properties.EndDate.split('Z')[0],
            Type: vacation.Properties.Type,
            Status: vacation.Properties.Status,
            NumberOfDays: vacation.Properties.NumberOfDays,
          })) || [];
        } else {
          this.tasks = response.data._embedded?.AllTasks?.map((task) => ({
            id: task._links.item.href.split('/').pop(), // Extracting the ID from the href
            Subject: task.Task.Subject,
            State: task.Task.State,
            SourceName: task.Task.SourceName,
          })) || [];
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        this.error = `Failed to load ${tab}. Please try again.`;
      } finally {
        this.isLoading = false;
      }
    },
    switchTab(tab) {
      this.activeTab = tab;
      this.fetchTasks(tab);
    },
    goToRequestVacation() {
      this.$router.push('/request-vacation');
    },
    getTaskState(stateCode) {
      const states = {
        1: 'Pending',
        3: 'In Progress',
        5: 'Completed',
      };
      return states[stateCode] || 'Unknown';
    },
  },
  mounted() {
    this.fetchTasks(this.activeTab);
  },
};
</script>

<style scoped>
.user-details {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.header {
  font-size: 28px;
  color: #333;
  margin-bottom: 10px;
}

.welcome {
  font-size: 18px;
  color: #555;
  margin-bottom: 20px;
}

.tabs {
  display: flex;
  margin-bottom: 20px;
  border-bottom: 2px solid #007bff;
}

.tabs button {
  flex: 1;
  padding: 12px;
  font-size: 16px;
  cursor: pointer;
  border: none;
  background-color: #f1f1f1;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.tabs button.active {
  background-color: #007bff;
  color: white;
}

.tabs button:hover {
  background-color: #0056b3;
  color: white;
}

.loading, .error, .no-data {
  color: #d9534f;
  font-weight: bold;
  text-align: center;
  margin: 20px 0;
}

.tasks, .vacations {
  margin-bottom: 20px;
}

.tasks h2, .vacations h2 {
  font-size: 22px;
  color: #333;
  margin-bottom: 15px;
}

.tasks p, .vacations p {
  color: #666;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  padding: 12px;
  margin-bottom: 10px;
  background-color: #fff;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

li:nth-child(even) {
  background-color: #f9f9f9;
}

.vacation-type {
  font-weight: bold;
}

.request-vacation-button {
  display: inline-block;
  padding: 12px 24px;
  margin-top: 20px;
  font-size: 16px;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.request-vacation-button:hover {
  background-color: #0056b3;
}
</style>
