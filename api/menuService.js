export async function fetchMenu() {
    const { public: { baseURL } } = useRuntimeConfig();
    const response = await fetch(`${baseURL}/menu`);
    return response.json();
  }
  
  export async function createMenu(menu) {
    const { public: { baseURL } } = useRuntimeConfig();
    const response = await fetch(`${baseURL}/menu/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(menu)
    });
    return response.json();
  }

  export async function updateMenu(id, data) {
    const { public: { baseURL } } = useRuntimeConfig();
    try {
      Loading.show()
  
      const response = await fetch(`${baseURL}/menu/update/${id}`, {
        // timeout: api_timeout,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
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
  