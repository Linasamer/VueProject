<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="login">
      <input v-model="username" placeholder="Username" required />
      <input type="password" v-model="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
    };
  },
  methods: {
    login() {
      if (this.username === 'lina' && this.password === 'lina') {
        localStorage.setItem('user', this.username);
        this.$router.push('/user-details');
      } else {
        alert('Invalid credentials');
      }
    },
  },
};
</script>

<style scoped>
/* Container Styling */
div {
  max-width: 400px;
  margin: 0 auto;
  padding: 40px;
  background-color: #f7f7f7;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

/* Heading Styling */
h1 {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
  font-family: 'Arial', sans-serif;
}

/* Form Styling */
form {
  display: flex;
  flex-direction: column;
}

/* Input Fields Styling */
input {
  padding: 10px;
  margin-bottom: 15px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  transition: border-color 0.3s ease;
}

input:focus {
  border-color: #007bff;
  outline: none;
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
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3;
}

/* Placeholder Text Styling */
input::placeholder {
  color: #999;
}

/* Error Message Styling (Optional) */
.error-message {
  color: #e74c3c;
  font-size: 14px;
  margin-top: 10px;
}
</style>

