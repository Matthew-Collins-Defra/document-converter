const Remarkable = require('remarkable')
const Docs = require('../config/docs.json')
const fs = require('fs')

module.exports = {
  method: 'GET',
  path: '/{documentid}',
  options: {
    auth: 'simple',
    handler: async (request, h) => {
      const md = new Remarkable({ html: true })
      var doc = null
      const documentid = request.params.documentid
      Docs.documents.forEach((testdoc) => {
        if (testdoc.id === documentid) {
          doc = testdoc
          doc.title = testdoc.id
          doc.body = testdoc.filename
        }
      })
      if (doc) {
        var sourcemd = fs.readFileSync(`server/documents/${doc.path}/${doc.filename}`, 'utf8')
        var regex = /\.\/media\//gi
        sourcemd = sourcemd.replace(regex, `/assets/${doc.path}/media/`)
        var output = md.render(sourcemd)
        return h.view('home', {
          title: doc.title,
          body: output
        })
      } else {
        return h.view('404')
      }
    }
  }
}
