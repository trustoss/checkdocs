export default function checkDotFile (data, opts) {
  const fs = opts.lib.fs
  const path = opts.lib.path

  const log = opts.helpers.log

  const info = opts.helpers.info
  const warn = opts.helpers.warn
  const danger = opts.helpers.danger
  return new Promise((resolve, reject) => {
    log(info, 'Checking Dotfile in', process.cwd())
    let docRoot = path.resolve(process.cwd(), './docs.json')
    log(info, docRoot)
    try {
      stats = fs.lstatSync(docRoot)
      if (!stats.isFile()) {
        throw new Error(docRoot + ' is not a file!')
      }
      fs.readFile(docRoot, 'utf8', (err, data) => {
        if (err) throw err
        log(info, data)
        let dotfile = JSON.parse(data)
        resolve(dotfile)
      })
    } catch (e) {
      log(warn, e)
      reject(false)
    }
  })
}
