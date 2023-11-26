<script lang="ts">
import { Icon } from "@iconify/vue";
import { defineComponent } from "vue";

export default defineComponent({
  components: {
    Icon,
  },
  data() {
    return {
      isFormValid: false,
      isAPIFetching: false,

      hey: undefined,

      username: undefined,
      email: undefined,
      password: undefined,
      confirm_password: undefined,

      isPasswordShown: false,
      isPasswordConfirmShown: false,

      userRules: [
        (value: string) => {
          if (value && value.length > 0) return true;
          else return "Please enter a username.";
        },
      ],

      emailRules: [
        (value: string) => {
          if (value && value.length > 0) return true;
          else return "Please enter an e-mail.";
        },
        (value: string) => {
          let emailRegex = new RegExp(
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
          );
          if (emailRegex.test(value.toString())) return true;
          else return "Please enter a valid email.";
        },
      ],

      passwordRules: [
        (value: string) => {
          if (value && value.length > 0) return true;
          else return "Please enter a password.";
        },
      ],
      passwordConfirmRules: [
        (value: string) => {
          if (value && value.length > 0) return true;
          else return "Please enter a password.";
        },
        (value: string) => {
          if (String(value) == String(this.password)) return true;
          else return "The passwords must match.";
        },
      ],
    };
  },
  methods: {
    submitHandler(): void {
      this.isAPIFetching = true;

      setTimeout(() => {
        this.isAPIFetching = false;
        alert("sent !");
      }, 3000);
    },
  },
});
</script>

<template>
  <v-card-title class="card-title">Create your account</v-card-title>
  <v-card-text class="card-text-container">
    <v-img src="/google-btn.png" class="google-btn __temp" />
    <v-divider class="separator border-opacity-100" />

    <v-form
      class="form-container"
      @submit.prevent="submitHandler"
      fast-fail
      v-model="isFormValid"
    >
      <v-text-field
        v-model="username"
        label="Username"
        variant="outlined"
        :rules="userRules"
      />

      <v-text-field
        v-model="email"
        :rules="emailRules"
        label="E-mail"
        variant="outlined"
      />

      <v-text-field
        v-model="password"
        label="Password"
        variant="outlined"
        :rules="passwordRules"
        :type="isPasswordShown ? 'text' : 'password'"
      >
        <template v-slot:append>
          <Icon
            @click="isPasswordShown = !isPasswordShown"
            :icon="isPasswordShown ? 'mdi:eye' : 'mdi:eye-off'"
          />
        </template>
      </v-text-field>

      <v-text-field
        v-model="confirm_password"
        label="Confirm password"
        variant="outlined"
        :rules="passwordConfirmRules"
        :type="isPasswordConfirmShown ? 'text' : 'password'"
      >
        <template v-slot:append>
          <Icon
            @click="isPasswordConfirmShown = !isPasswordConfirmShown"
            :icon="isPasswordConfirmShown ? 'mdi:eye' : 'mdi:eye-off'"
          />
        </template>
      </v-text-field>

      <p style="text-align: center">
        <v-btn
          type="submit"
          color="#F77F00"
          :loading="isAPIFetching"
          :disabled="!isFormValid"
        >
          Submit
        </v-btn>
      </p>
    </v-form>

    <p class="account-switch">
      Already have an account ? <router-link to="/login">Login</router-link>
    </p>
  </v-card-text>
</template>

<style lang="scss" scoped>
@import "../../scss/loginRegister/register.scss";
</style>
