export default defineEventHandler(() => {
    const runtimeEnv = process.env.MY_RUNTIME_ENV || 'development';
    return { runtimeEnv };
  });