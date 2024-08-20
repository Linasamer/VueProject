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
            <div class="task-item">
              <span class="task-subject">{{ task.Subject }}</span>
              <span class="task-state">{{ getTaskState(task.State) }}</span>
              <small class="task-source">Source: {{ task.SourceName }}</small>
            </div>
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
          <div class="vacation-item">
            <span class="vacation-type">{{ vacation.Type }} Vacation - {{ vacation.Status }}</span>
            <span class="vacation-dates">Dates: {{ vacation.StartDate }} to {{ vacation.EndDate }}</span>
            <span class="vacation-days">Number of Days: {{ vacation.NumberOfDays || 'N/A' }}</span>
          </div>
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
      activeTab: 'vacations', 
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
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  background: linear-gradient(135deg, #f3f4f7, #e9ecf2);
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
  transition: background 0.3s;
}

.header {
  font-size: 32px;
  font-weight: bold;
  color: #4a4a4a;
  text-align: center;
  margin-bottom: 20px;
}

.welcome {
  font-size: 20px;
  color: #6a6a6a;
  text-align: center;
  margin-bottom: 30px;
}

.tabs {
  display: flex;
  justify-content: space-around;
  margin-bottom: 30px;
  border-bottom: 2px solid #007bff;
}

.tabs button {
  padding: 15px 25px;
  font-size: 16px;
  font-weight: 500;
  color: staff;
  cursor: pointer;
  background: none;
  border: none;
  border-radius: 8px 8px 0 0;
  transition: background-color 0.3s, color 0.3s;
}

.tabs button.active {
  background-color: #007bff;
  color: white;
}

.tabs button:hover:not(.active) {
  background-color: #dfe6f3;
}

.loading, .error, .no-data {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  margin: 30px 0;
  color: #d9534f;
}

.tasks, .vacations {
  margin-bottom: 30px;
}

.tasks h2, .vacations h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
}

.tasks p, .vacations p {
  color: #555;
}

ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

li {
  margin-bottom: 15px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s;
}

li:hover {
  transform: translateY(-5px);
}

.task-item, .vacation-item {
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-subject, .vacation-type {
  font-weight: bold;
  font-size: 18px;
  color: #333;
}

.task-state, .vacation-dates, .vacation-days, .task-source {
  font-size: 16px;
  color: #666;
}

.request-vacation-button {
  display: block;
  width: 100%;
  padding: 15px;
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  text-align: center;
  transition: background-color 0.3s;
}

.request-vacation-button:hover {
  background-color: #0056b3;
}

@media (max-width: 768px) {
  .header {
    font-size: 28px;
  }

  .welcome {
    font-size: 18px;
  }

  .tabs button {
  padding: 10px 15px;
  font-size: 14px;
}


  .tasks h2, .vacations h2 {
    font-size: 20px;
  }

  .task-item, .vacation-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .task-subject, .vacation-type, .task-state, .vacation-dates, .vacation-days, .task-source {
    font-size: 16px;
    margin-bottom: 5px;
  }
}
</style>
