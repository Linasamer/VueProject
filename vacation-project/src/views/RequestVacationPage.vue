<template>
  <div>
    <h1>Request Vacation</h1>
    <form @submit.prevent="submitRequest">
      <div>
        <label for="start-date">Start Date:</label>
        <input type="date" v-model="startDate" @change="calculateDays" id="start-date" required />
      </div>
      <div>
        <label for="end-date">End Date:</label>
        <input type="date" v-model="endDate" @change="calculateDays" id="end-date" required />
      </div>
      <div>
        <label for="num-days">Number of Days:</label>
        <input type="text" v-model="numDays" id="num-days" readonly />
      </div>
      <div>
        <label for="vacation-type">Type of Vacation:</label>
        <select v-model="vacationType" id="vacation-type" required>
          <option value="" disabled>Select Vacation Type</option>
          <option value="annual">Annual Leave</option>
          <option value="sick">Sick Leave</option>
          <option value="maternity">Maternity Leave</option>
          <option value="paternity">Paternity Leave</option>
        </select>
      </div>
      <button type="submit">Submit Request</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      startDate: '',
      endDate: '',
      numDays: 0,
      vacationType: '',
    };
  },
  methods: {
    calculateDays() {
      if (this.startDate && this.endDate) {
        const start = new Date(this.startDate);
        const end = new Date(this.endDate);
        const timeDiff = end - start;

        if (timeDiff >= 0) {
          this.numDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;
        } else {
          this.numDays = 0;
          alert('End date must be after start date.');
        }
      } else {
        this.numDays = 0;
      }
    },
    submitRequest() {
      if (this.numDays > 0 && this.vacationType) {
        alert(`Vacation request submitted for ${this.numDays} days as ${this.vacationType}.`);
        // Handle submission logic here
      } else {
        alert('Please fill out all fields correctly.');
      }
    },
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
  text-align: center;
}

/* Heading Styling */
h1 {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
  font-family: 'Arial', sans-serif;
}

/* Form Field Styling */
form div {
  margin-bottom: 15px;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
  color: #333;
}

input[type="date"],
input[type="text"],
select {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  box-sizing: border-box;
}

input[type="text"]:read-only {
  background-color: #e9ecef;
}

/* Button Styling */
button {
  padding: 10px 20px;
  font-size: 16px;
  color: #fff;
  background-color: #28a745;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;
  margin-top: 20px;
}

button:hover {
  background-color: #218838;
}
</style>
