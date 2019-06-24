const nodePandoc = require('node-pandoc')
const path = require('path')
const fs = require('fs')

const inboundFolder = path.join(__dirname, 'inbound')
const outboundFolder = path.join(__dirname, 'outbound')

CreateWorkingDirectory()

fs.readdir(inboundFolder, function (err, files) {
  if (err) {
    return console.log('Unable to scan directory: ' + err)
  }

  files.forEach(function (file) {
    if (path.extname(file.toLowerCase()) === '.docx') {
      fs.lstat(path.join(inboundFolder, file), (err, stats) => {
        if (err) {
          return console.log(err)
        }
        if (stats.isFile()) {
          console.log(`Converting ${file}`)
          convertFile(file)
        }
      })
    }
  })
})

function CreateWorkingDirectory () {
  if (!fs.existsSync(inboundFolder)) {
    fs.mkdirSync(inboundFolder)
  }
  if (!fs.existsSync(outboundFolder)) {
    fs.mkdirSync(outboundFolder)
  }
}

function MoveMedia (mediapath) {
  const movepath = path.join(mediapath, 'media')
  if (!fs.existsSync(movepath)) {
    fs.mkdirSync(movepath)
  }
  fs.readdir('./media/', function (err, files) {
    if (err) {
      return console.log('Unable to scan directory: ' + err)
    }

    files.forEach(function (file) {
      fs.lstat(path.join('./media', file), (err, stats) => {
        if (err) {
          return console.log(err)
        }
        if (stats.isFile()) {
          fs.renameSync(path.join('./media', file), path.join(movepath, file))
        }
      })
    })
  })
}

function convertFile (file) {
  const filePath = path.join(inboundFolder, file)
  const name = `${path.basename(file, path.extname(filePath))}_${new Date().getTime()}`
  const mediapath = path.join(outboundFolder, path.basename(filePath, path.extname(filePath)))
  const outFileName = `${path.join(mediapath, name)}.md`
  if (!fs.existsSync(mediapath)) {
    fs.mkdirSync(mediapath)
  }
  //const args = ['-f', 'docx', '-t', 'markdown_mmd-simple_tables-multiline_tables-grid_tables', '-o', outFileName, '--extract-media', '.']
  const args = ['-f', 'docx', '-t', 'markdown-grid_tables-yaml_metadata_block-mmd_title_block', '-o', outFileName, '--extract-media', '.', '--standalone', '--wrap', 'none']

  const callback = (err, result) => {
    if (err) { console.error(err) }
    if (result) {
      // media in docx files is stored in a media directory, so to fix the relative paths in the md file, move the files to under the md file
      MoveMedia(mediapath)
    }
    return result
  }

  nodePandoc(filePath, args, callback)
}
