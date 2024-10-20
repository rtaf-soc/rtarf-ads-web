export async function fetchWithTimeout(resource, options = {}) {
    const { timeout = 8000 } = options;
    
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal  
    });
    
    clearTimeout(id);
    
    if (!response.ok) {
      throw new Error(`Fetch error: ${response.statusText}`);
    }
    
    return response;
  }
  