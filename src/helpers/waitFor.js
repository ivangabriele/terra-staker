/**
 * @param {number} inS
 *
 * @returns {Promise<void>}
 */
export async function waitFor(inSeconds) {
  return new Promise(resolve => {
    setTimeout(resolve, inSeconds * 1000)
  })
}
