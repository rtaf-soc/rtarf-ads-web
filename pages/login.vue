<template>
    <q-page class="flex flex-center">
        <q-card class="q-pa-md" style="width: 450px;">


            <!-- <div class="col-4">
                <q-img src="/favicon.ico" :ratio="1" />
            </div> -->

            <q-card-section>
                <div class="text-h6">เข้าสู่ระบบ</div>
            </q-card-section>


            <q-card-section>
                <q-form @submit="onSubmit">
                    <q-input filled v-model="username" label="Username" type="text" required />
                    <q-input filled v-model="password" label="Password" type="password" required />
                    <div class="q-mt-md">
                        <q-btn type="submit" label="ยืนยัน" color="primary" />
                    </div>
                </q-form>
            </q-card-section>
        </q-card>
    </q-page>
</template>

<script setup>
// (Keep your original imports and comments if any)
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useRouter } from 'vue-router'

// Preserve your original variable names and comments
const username = ref('') // your username input
const password = ref('') // your password input
const error = ref(null)  // to display login errors
const auth = useAuthStore()
const router = useRouter()
onMounted(() => {
  if (auth.isAuthenticated) {
    router.push('/source')  // Redirect to the main page if token is valid
  }
})
const onSubmit = async (event) => {
    event.preventDefault();
    // try {
    //     await authStore.login(username.value, password.value);
    //     // Notify user of successful login
    //     Notify.create({
    //         position: "top",
    //         type: 'positive',
    //         message: 'Login successful!'
    //     });
    //     router.push('/source');
    // } catch (error) {
    //     console.log(error)
    //     // Notify user of failed login
    //     Notify.create({
    //         position: "top",
    //         type: 'negative',
    //         message: 'Invalid username or password.'
    //     });
    // }
    error.value = null
    try {
        // Updated login logic: call the auth store's login action which now uses Keycloak API (/api/login)
        await auth.login(username.value, password.value)
        // After successful login, navigate to your intended page (e.g., home)
        Notify.create({
            position: "top",
            type: 'positive',
            message: 'Login successful!'
        });
        router.push('/source')
    } catch (err) {
        // Preserve your original error handling
        // error.value = err.message || 'Login failed'
        Notify.create({
            position: "top",
            type: 'negative',
            message: 'Login failed.'
        });
    }
};
</script>


<style scoped>
.flex-center {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
}
</style>