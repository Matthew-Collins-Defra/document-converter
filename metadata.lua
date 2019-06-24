return {
  {
    Pandoc = function (doc)
      local meta = doc.meta
      local metafile = io.open('metafile.yml','a')
      metafile:write(pandoc.MetaList(doc.meta.author))
      -- for k, v in pairs(pandoc.MetaMap(doc.meta)) do
      --   metafile:write(k .. " - " .. v)
      -- end
      metafile:close()
      return meta
    end
  }
}
