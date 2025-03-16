// const api_timeout = 5000
// import { fetchWithTimeout } from '~/utils/fetchWithTimeout';


export async function fetchIngredients(menuId) {
  const { public: { baseURL } } = useRuntimeConfig();
  try {


    // const response = await fetch(`${baseURL}/ingredient?menu_id=${menuId}`);
    // return response.json();
  } catch (error) {
   
  } finally {

  }
}

export async function createIngredient(ingredient) {
  const { public: { baseURL } } = useRuntimeConfig();
  // const response = await fetch(`${baseURL}/ingredient/create`, {
  //   // timeout: api_timeout,
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify(ingredient)
  // });
  return response.json();
}

export async function updateIngredient(id, ingredient) {
  const { public: { baseURL } } = useRuntimeConfig();
  try {
    // Loading.show()

    const response = await fetch(`${baseURL}/ingredient/update/${id}`, {
      // timeout: api_timeout,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(ingredient)
    });
    // console.log(response.status)
    if (response.status === 200) {
      Notify.create({
        position: 'top',
        type: 'positive',
        message: 'อัพเดทข้อมูลสำเร็จ'
      })

    }
    return response.json();

  } catch (error) {

    Notify.create({
      position: 'top',
      type: 'negative',
      message: error
    })

  } finally {
    Loading.hide()
  }
}

export async function deleteIngredient(id) {
  const { public: { baseURL } } = useRuntimeConfig();
  const response = await fetch(`${baseURL}/ingredient/delete/${id}`, {
    method: 'POST'
  });
  return response.json();
}

