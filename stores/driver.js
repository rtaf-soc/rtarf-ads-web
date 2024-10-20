// stores/weight.js
import { defineStore } from 'pinia';
import { getClientDriver } from '~/api/scaleService';

export const useDriverStore = defineStore('driver', {
    state: () => ({
        drivers: []
    }),
    actions: {
        async getDriver() {
            try {
                this.drivers = await getClientDriver();
                console.log('get driver2')
                console.log(this.drivers)
            } catch (error) {
                // showTooltip(error)
                console.log(error)
                // let the form component display the error
                return error
            }
        },
        // getDriver() {
        //     // Simulate an API call for login
        //     return new Promise((resolve, reject) => {
        //       if (username === 'admin' && password === 'admin') {
        //         this.isAuthenticated = true;
        //         resolve(true);
        //       } else {
        //         this.isAuthenticated = false;
        //         reject(new Error('Invalid credentials'));
        //       }
        //     });
        //   },
    },
    getters: {
        allDrivers: (state) => state.drivers, // Getter for drivers
    },
});

