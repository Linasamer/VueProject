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
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      password: '',
    };
  },
  methods: {
    async login() {
      try {
        // First step: Get the ticket
        const response1 = await axios.post('http://psuite:8080/otdsws/rest/authentication/credentials', {
          userName: this.username,
          password: this.password,
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const ticket = response1.data.ticket;

        // Second step: Use the ticket in the SOAP request
        const soapBody = `<SOAP:Envelope xmlns:SOAP="http://schemas.xmlsoap.org/soap/envelope/">
                            <SOAP:Header>
                              <OTAuthentication xmlns="urn:api.bpm.opentext.com">
                                <AuthenticationToken>${ticket}</AuthenticationToken>
                              </OTAuthentication>
                            </SOAP:Header>
                            <SOAP:Body>
                              <samlp:Request xmlns:samlp="urn:oasis:names:tc:SAML:1.0:protocol" MajorVersion="1" MinorVersion="1">
                                <samlp:AuthenticationQuery>
                                  <saml:Subject xmlns:saml="urn:oasis:names:tc:SAML:1.0:assertion">
                                    <saml:NameIdentifier Format="urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified"/>
                                  </saml:Subject>
                                </samlp:AuthenticationQuery>
                              </samlp:Request>
                            </SOAP:Body>
                          </SOAP:Envelope>`;

        const response2 = await axios.post('http://psuite:81/home/Development/com.eibus.web.soap.Gateway.wcp', soapBody, {
          headers: {
            'Content-Type': 'application/xml',
          },
        });

        // Extract the necessary information from the response
        const token = extractTokenFromResponse(response2.data);

        // Store the token for future requests
        localStorage.setItem('token', token);
        localStorage.setItem('user', this.username);
        this.$router.push('/user-details');
      } catch (error) {
        console.error('Login failed:', error);
        alert('Invalid credentials or an error occurred.');
      }
    },
  },
};

function extractTokenFromResponse(soapResponse) {
  // Use a DOMParser to extract the token from the SOAP response
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(soapResponse, 'text/xml');
  const token = xmlDoc.getElementsByTagName('samlp:AssertionArtifact')[0].textContent;
  return token;
}

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
