export default defineEventHandler((event) => {
    const { id } = event.context.params;
    return { id, name: `User ${id}` };
  });