export function tryJSONparse(input: any) {
  try {
    const o = JSON.parse(input)
    if (o && typeof o === 'object') return o
  } catch (e) {}

  return input
}
