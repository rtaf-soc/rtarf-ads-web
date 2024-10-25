<template>
  <q-page>
    <q-card>
      <q-card-section class="text-center">
        <h1>Ingredients</h1>
        <q-chip outline square size="100px" :color=currentScaleColor text-color="white">
          {{ currentScale }}
        </q-chip>
      </q-card-section>

      <q-card-section class="text-center">



        <!-- <q-btn color="secondary" @click="startScale">เริ่มต้นชั่ง</q-btn> -->
        <q-btn class="q-ma-md" color="positive" @click="startCheckScale">เริ่มชั่ง</q-btn>
        <q-btn class="q-ma-md" color="negative" @click="stopCheckScale">หยุดชั่ง</q-btn>
        <q-list bordered>
          <q-btn class="q-ma-md" color="primary" @click="addIngredient">เพิ่มวัตถุดิบ</q-btn>
          <q-item v-for="ingredient in ingredients" :key="ingredient.id" clickable>
            <q-item-section>
              <div>
                <q-badge align="middle">
                  ชื่อ
                </q-badge>
                {{ ingredient.name }}
                <q-badge align="middle">
                  น้ำหนัก
                </q-badge>
                {{ ingredient.weight }}
                <q-badge align="middle">
                  ค่าความคลาดเคลื่อน
                </q-badge>
                {{ ingredient.tolerance }} Kg

                <q-badge align="middle" :color="ingredient.isChecked === true ? 'green' : 'negative'">
                  ตรวจสอบผ่าน
                </q-badge>
                {{ ingredient.isChecked }}

              </div>

              <!-- ชื่อ : {{ ingredient.name }} - น้ำหนัก : {{ ingredient.weight }} - ค่าความคลาดเคลื่อน : {{
                ingredient.tolerance
              }}Kg -->
            </q-item-section>
            <q-item-section side>
              <q-btn color="primary" @click="editIngredient(ingredient)">แก้ไข</q-btn>
            </q-item-section>
            <q-item-section side>
              <q-btn color="negative" @click="deleteIngredient(ingredient.id)">ลบ</q-btn>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-card-section v-if="selectedIngredient">
        <q-form @submit.prevent="handleSubmit">
          <q-input v-model="selectedIngredient.name" label="Name" required />
          <q-input v-model="selectedIngredient.weight" label="Weight" type="number" step="0.001" required />
          <q-input v-model="selectedIngredient.tolerance" label="Tolerance" type="number" step="0.001" required />
          <q-btn type="submit" label="Save Ingredient" color="primary" />
          <!-- <q-btn @click="addAnotherIngredient" label="Add Another" color="secondary" /> -->
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { fetchIngredients, createIngredient, updateIngredient, deleteIngredient } from '~/api/ingredientService';
import { fetchStableWeight } from '~/api/scaleService';

export default {
  data() {
    return {
      ingredients: [],
      selectedIngredient: null,
      currentScale: 0.00,
      stableWeight: 0.00,
      currentScaleColor: "negative",
      scaleChecked: [],
      menuId: null
    };
  },
  async mounted() {
    this.menuId = this.$route.query.menu_id;
    await this.loadIngredients();
    await this.getStableWeight()
  },
  methods: {
    setScaleColor(color) {
      this.currentScaleColor = color
    },
    async loadIngredients() {
      try {
        const data = await fetchIngredients(this.menuId);
        this.ingredients = data.data;
      } catch (error) {
        console.error('Error fetching ingredients:', error);
        this.ingredients = [];
      }
    },
    addIngredient() {
      this.selectedIngredient = {
        name: '',
        weight: '',
        tolerance: '',
        menu_id: this.menuId
      };
    },
    startScale() {
      this.selectedIngredient = {
        name: '',
        weight: '',
        tolerance: '',
        menu_id: this.menuId
      };
    },
    startCheckScale() {
      let counter = 0
      let weightTmp = [0, 0, 0, 0]
      this.scaleChecked = {}
      let success_position = 0
      let loop_counter = 0
      for (const item of this.ingredients) {
        item["isChecked"] = false
      }


      if (this.intervalId) return; // Prevent multiple intervals

      this.intervalId = setInterval(() => {
        console.log('check scale')

        this.updateIsCheck();
        // console.log(this.currentScale)
        // if (counter == 4) {
        //   counter = 0
        //   weightTmp = [0, 0, 0, 0]
        // }
        // console.log(counter)
        // console.log(weightTmp)
        // weightTmp[counter] = this.currentScale
        // if ((weightTmp[0] > 0 && weightTmp[1] > 0 && weightTmp[2] > 0 && weightTmp[3] > 0) &&
        //   ((weightTmp[0] === weightTmp[1] && weightTmp[1] === weightTmp[2] && weightTmp[2] === weightTmp[3]))) {

        //   for (const item of this.ingredients) {
        //     console.log("loop_counter:" + loop_counter)
        //     console.log("success_position:" + success_position)
        //     if (item["isChecked"] === false) {
        //       console.log('check scale')
        //       console.log(this.currentScale)
        //       console.log(item.weight + item.tolerance)
        //       console.log(item.weight - item.tolerance)
        //       console.log('tolerance:' + item.tolerance)
        //       if ((this.currentScale <= item.weight + item.tolerance) &&
        //         (this.currentScale >= item.weight - item.tolerance)) {

        //         if (loop_counter != success_position) {
        //           loop_counter = 0
        //           loop_counter = 0
        //           break
        //         } else {

        //         }
        //         item["isChecked"] = true
        //         break
        //       }
        //     } else if (item["isChecked"]) {
        //       success_position = success_position + 1
        //     }


        //     loop_counter = loop_counter + 1
        //   }

        //   let all_success = false
        //   for (const item of this.ingredients) {
        //     if (item.isChecked) {
        //       all_success = true
        //     } else {
        //       all_success = false
        //       break
        //     }
        //   }
        //   if (all_success) {
        //     Notify.create({
        //       type: "Success",
        //       position: "top",
        //       color: "green",
        //       message: "ทำรายการสำเร็จ",
        //       actions: [
        //         { icon: 'close', color: 'grey', round: true, }
        //       ]

        //     });
        //     this.stopCheckScale()
        //   }
        // }
        // counter = counter + 1

      }, 500);
    },
    updateIsCheck() {
      let shouldCheckNext = true; // Flag to check the next element

      for (let i = 0; i < this.ingredients.length; i++) {
        const { weight, tolerance } = this.ingredients[i];
        console.log(weight)

        if (shouldCheckNext && this.isWithinTolerance(weight, tolerance)) {
          this.ingredients[i].isChecked = true;
        }

        // Set the flag to check the next element only if the current element's isCheck is true
        shouldCheckNext = this.ingredients[i].isChecked;
      }

      // Check if all elements have isCheck set to true
      if (this.ingredients.every(item => item.isChecked)) {
        Notify.create({
          type: "Success",
          position: "top",
          color: "green",
          message: "ทำรายการสำเร็จ",
          actions: [
            { icon: 'close', color: 'grey', round: true, }
          ]

        });
        this.stopCheckScale();
        this.message = 'All items checked. Interval stopped.';
      } else {
        this.message = `Checked at ${new Date().toLocaleTimeString()}`;
      }
    },
    isWithinTolerance(weight, tolerance) {
      return this.currentScale >= weight - tolerance && this.currentScale <= weight + tolerance;
    },
    stopCheckScale() {
      clearInterval(this.intervalId);
      this.intervalId = null;
      this.message = 'Loop stopped.';
    },
    loopingFunction() {
      // Your function logic here
      console.log('Function executed at', new Date().toLocaleTimeString());
      this.message = `Function executed at ${new Date().toLocaleTimeString()}`;
    },
    editIngredient(ingredient) {
      this.selectedIngredient = { ...ingredient };
    },
    async getStableWeight() {
      // if (this.intervalId) return; // Prevent multiple intervals

      setInterval(() => {

        this.currentStableWeight();
        this.setScaleColor("negative")
      }, 500);


    },
    beforeDestroy() {
      // Clear the interval if the component is destroyed
      // this.stopLoop();
    },

    async handleSubmit() {
      if (this.selectedIngredient.id) {
        // Update ingredient
        try {
          await updateIngredient(this.selectedIngredient.id, this.selectedIngredient);
          const index = this.ingredients.findIndex(i => i.id === this.selectedIngredient.id);
          this.$set(this.ingredients, index, this.selectedIngredient);
        } catch (error) {
          console.error('Error updating ingredient:', error);
        }
      } else {
        // Create new ingredient
        try {
          const response = await createIngredient(this.selectedIngredient);
          this.ingredients.push({ ...this.selectedIngredient, id: response.data.id });
        } catch (error) {
          console.error('Error creating ingredient:', error);
        }
      }
      this.selectedIngredient = null;
    },
    addAnotherIngredient() {
      this.handleSubmit();
      this.selectedIngredient = {
        name: '',
        weight: '',
        tolerance: '',
        menu_id: this.menuId
      };
    },
    async deleteIngredient(id) {
      try {
        await deleteIngredient(id);
        this.ingredients = this.ingredients.filter(ingredient => ingredient.id !== id);
      } catch (error) {
        console.error('Error deleting ingredient:', error);
      }
    },
    // async getStableWeight() {
    //   try {
    //     let weight = await fetchStableWeight();
    //     console.log(weight)
    //     // this.ingredients = this.ingredients.filter(ingredient => ingredient.id !== id);
    //   } catch (error) {
    //     console.error('Error deleting ingredient:', error);
    //   }
    // },
    async currentStableWeight() {
      try {
        this.currentScale = await fetchStableWeight();
        // console.log(weight)
        // this.ingredients = this.ingredients.filter(ingredient => ingredient.id !== id);
        this.setScaleColor("secondary")
      } catch (error) {
        console.error('Error deleting ingredient:', error);
      }
    }
  }
};
</script>

<style scoped>
/* Add any scoped styles here */
</style>
