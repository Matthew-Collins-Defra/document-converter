# Document Converter
Prototype Node.js application to convert document format using pandoc.

Use: node docxtomd.js

This will convert all docx files in a directory called "inbound" and write them to a directory called "outbound" along with the media files that are embedded in the document.

If you then take these converted MD files, and copy them and their media directories to web/server/documents, and configure the document details in web/server/config/docs.json

```
{
  "documents": [
    { "id": "Url-id",
      "filename": "Full filename of markdown file excluding path details_9999999.md",
      "path": "Folder name of media files"}
  ]
}
```

Starting the server node by changing into the web directory and running `node index.js`

You can then visit the server at `http://localhost:3000/Url-id` to see the document.

Username: `user`
Password: `LetMeIn`

## Depenencies
Node v10
Pandoc
