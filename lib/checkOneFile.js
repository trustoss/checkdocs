export default function checkOneFile (docRoot, docKey, filePath, opts) {
  const log = opts.helpers.log
  const lib = opts.lib
  const path = lib.path
  const fs = lib.fs

  const info = opts.helpers.info
  const warn = opts.helpers.warn
  const danger = opts.helpers.danger

  return new Promise((resolve, reject) => {
    const documentPath = path.resolve(lib.path.resolve(process.cwd(), docRoot), filePath)
    try {
      const stats = fs.lstatSync(documentPath)
      if (!stats.isFile()) {
        throw new Error(documentPath + ' is not a file!')
      }
      fs.readFile(documentPath, 'utf8', (err, data) => {
        if (err) throw err
        resolve(Object.assign({}, stats, {
          fileType: docKey.split('_')[0],
          contents:data
        }))
      })
    } catch (e) {
      log(warn, e)
      reject(false)
    }
  })
}
