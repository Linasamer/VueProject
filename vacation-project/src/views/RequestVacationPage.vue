<template>
  <div>
    <h1>Request Vacation</h1>
    <form @submit.prevent="submitRequest">
      <div>
        <label for="start-date">Start Date:</label>
        <input type="date" v-model="startDate" @change="updateModel" id="start-date" required />
      </div>
      <div>
        <label for="end-date">End Date:</label>
        <input type="date" v-model="endDate" @change="updateModel" id="end-date" required />
      </div>
      <div>
        <label for="num-days">Number of Days:</label>
        <input type="text" v-model="numDays" id="num-days" readonly />
      </div>
      <div>
        <label for="vacation-type">Type of Vacation:</label>
        <select v-model="vacationType" @change="updateModel" id="vacation-type" required>
          <option value="" disabled selected>Select Vacation Type</option>
       <option value="Annual">Annual</option>
          <option value="Sick">Sick</option>
          <option value="Unpaid">Unpaid</option>
          <option value="Casual">Casual</option>
        </select>
      </div>
      <button type="submit">Submit Request</button>
    </form>
  </div>
</template>
<script>
import axios from 'axios';
import { VacationRequest } from '@/models/VacationRequest';
import { VacationResponse } from '@/models/VacationResponse';

export default {
  data() {
    return {
      startDate: '',
      endDate: '',
      vacationType: '',
      numDays: 0,
      vacationRequest: null,
      vacationResponse: null,  // Add a property to store the response
    };
  },
  methods: {
    updateModel() {
      if (this.startDate && this.endDate && this.vacationType) {
        this.vacationRequest = new VacationRequest(this.startDate, this.endDate, this.vacationType);
        this.numDays = this.vacationRequest.numDays;
      }
    },
    async submitRequest() {
      if (this.vacationRequest) {
        try {
          const response = await axios.post(
            'http://psuite:81/home/Development/app/entityRestService/api/MyCompany4VacationProcess/entities/VacationEntity',
            this.vacationRequest.toJSON(),
            {
              headers: {
                'Content-Type': 'application/json',
                'CSRFToken': 'Development',
                'SAMLart': localStorage.getItem('token'), // Include SAMLart token
              },
            }
          );

          // Process the response using the VacationResponse model
          this.vacationResponse = new VacationResponse(response.data);

          console.log('Vacation request submitted successfully:', this.vacationResponse);
          alert(`Vacation request submitted successfully. Request ID: ${this.vacationResponse.id}`);

          this.$router.push('/user-details');
        } catch (error) {
          console.error('Error submitting vacation request:', error);
          alert('An error occurred while submitting the vacation request. Please try again.');
        }
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
