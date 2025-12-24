<template>
    <q-page class="flex flex-center overflow-hidden window-height" style="background: radial-gradient(circle at center, #1a202c 0%, #000000 100%); position: relative;">

        <div class="fixed-full flex flex-center" style="z-index: 0; pointer-events: none;">
            <q-img 
                src="/background.png" 
                style="width: 50%; max-width: 650px; opacity: 0.4;" 
            >
                <template v-slot:error>
                    <q-img src="/favicon.ico" style="width: 50%; opacity: 0.2;" />
                </template>
            </q-img>
        </div>

        <div 
            class="column items-center q-pa-md animate-fade-in" 
            style="z-index: 1; width: 100%; max-width: 900px;" 
        >
            
            <q-card class="stealth-card full-width row q-pa-none shadow-20">
                
                <div class="accent-bar"></div>

                <q-card-section 
                    class="col-12 col-md-5 q-pa-xl flex flex-center left-panel relative-position overflow-hidden" 
                    style="min-height: 500px;"
                >
                    <div class="absolute-full" style="background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 100%); pointer-events: none;"></div>
                    
                    <div class="text-left full-width relative-position column justify-between full-height" style="z-index: 2;">
                        
                        <div>
                            <div class="q-mb-lg">
                                <q-img src="/images/rtarf-logo.png" style="width: 70px; height: 70px;" fit="contain" />
                            </div>

                            <div class="text-h4 text-weight-bold text-white q-mb-sm" style="line-height: 1.2; letter-spacing: 0.5px;">
                                CYBER<br>DEFENSE<br>PORTAL
                            </div>
                            <div class="text-subtitle1 text-cyan-13">
                                (1st Operations Division)
                            </div>
                            <q-separator color="cyan-13" class="q-my-md" style="width: 50px; opacity: 0.5;" />
                        </div>

                        <div>
                             <div class="q-mb-sm row items-center">
                                <span class="text-grey-5 text-caption q-mr-xs">System Status: </span>
                                <span class="text-green-13 text-weight-bold text-caption">● Online</span>
                             </div>
                             <div class="text-caption text-weight-bold text-grey-5" style="letter-spacing: 1px;">
                                AUTHORIZED USE ONLY
                            </div>
                        </div>

                    </div>
                </q-card-section>

                <q-card-section 
                    class="col-12 col-md-7 q-pa-xl right-panel column justify-center" 
                    style="min-height: 500px;"
                >
                    <div class="text-h5 text-white q-mb-lg text-weight-bold">Sign in</div>
                    
                    <q-form @submit="onSubmit" class="q-gutter-y-lg">
                        
                        <q-input 
                            v-model="username" 
                            label="Username" 
                            dark outlined color="cyan-13" label-color="grey-5"
                            class="modern-input" required
                        >
                            <template v-slot:prepend><q-icon name="person_outline" size="xs" color="grey-6" /></template>
                        </q-input>

                        <q-input 
                            v-model="password" 
                            label="Password" 
                            type="password" 
                            dark outlined color="cyan-13" label-color="grey-5"
                            class="modern-input" required
                        >
                            <template v-slot:prepend><q-icon name="lock_outline" size="xs" color="grey-6" /></template>
                        </q-input>

                        <div>
                            <q-checkbox 
                                v-model="rememberMe" 
                                label="Remember this device" 
                                dark color="cyan-13" size="sm" dense class="text-grey-5"
                            />
                        </div>

                        <div class="q-mt-lg">
                            <q-btn 
                                type="submit" 
                                label="Sign in" 
                                class="full-width modern-btn" 
                                size="lg" unelevated
                            />
                        </div>
                    </q-form>
                    
                    <div class="q-mt-auto text-center q-pt-xl">
                         <div class="text-subtitle2 text-weight-bold text-grey-6 q-mb-xs" style="letter-spacing: 2px;">
                            NEVER GIVE UP
                         </div>
                         <div class="text-caption text-grey-7" style="font-size: 0.65rem;">
                            Privacy Policy | Terms of Service
                         </div>
                         <div class="text-caption text-grey-8" style="font-size: 0.6rem; font-family: monospace;">
                            v2.1.0 • UTC+7
                         </div>
                    </div>

                </q-card-section>

            </q-card>
        </div>
    </q-page>
</template>

<script setup>
import { ref , onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useTitleStore } from '~/stores/title'
import { useRouter } from 'vue-router'
import { Notify, Loading } from 'quasar'

const username = ref('') 
const password = ref('') 
const rememberMe = ref(false) 
const error = ref(null)  
const auth = useAuthStore()
const router = useRouter()
const title = useTitleStore()

onMounted(() => {
    if (auth.isAuthenticated) {
        title.setTitle('Overview')
        router.push('/overview')  
    } else {
        title.setTitle('Login')
    }
})

const onSubmit = async (event) => {
    if(event) event.preventDefault();
    error.value = null
    try {
        await auth.login(username.value, password.value)
        Notify.create({
            position: "top",
            type: 'positive',
            message: 'Login successful!'
        });
        title.setTitle('Overview')
        router.push('/overview')
    } catch (err) {
        Notify.create({
            position: "top",
            type: 'negative',
            message: 'Login failed.'
        });
    } finally {
        Loading.hide()
    }
};
</script>

<style scoped>
.window-height {
    min-height: 100vh;
    height: 100vh; 
}

/* Card หลัก */
.stealth-card {
    background: transparent; 
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.1);
    position: relative;
    backdrop-filter: blur(10px); 
}

/* แถบสี Accent */
.accent-bar {
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 4px;
    background: linear-gradient(to bottom, #00e5ff, #006064);
    z-index: 5;
}

.left-panel { background: rgba(22, 27, 34, 0.75); }
.right-panel { background: rgba(0, 0, 0, 0.7); }

/* Input Style */
.modern-input :deep(.q-field__control) {
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.07);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Button Customization */
.modern-btn {
    background: linear-gradient(90deg, #00e5ff 0%, #00acc1 100%);
    color: #000;
    font-weight: bold;
    border-radius: 8px;
    text-transform: none;
    font-size: 1rem;
    transition: transform 0.2s, box-shadow 0.2s;
}
.modern-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 229, 255, 0.3);
}

@media (max-width: 800px) {
    .stealth-card { flex-direction: column; }
    .left-panel, .right-panel { padding: 30px; min-height: auto !important; } 
    .accent-bar { width: 100%; height: 4px; bottom: auto; }
    .left-panel { padding-top: 40px; }
}

.animate-fade-in {
    animation: fadeIn 1s ease-out;
}
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); } 
}
</style>