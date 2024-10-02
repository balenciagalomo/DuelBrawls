export function assert(condition: any, error: Error):  asserts condition {
  if (!condition) {
   throw error
  }
}