return {
  {
    Para = function (div)
      local metafile = io.open('metafile.yml','a')
      for key,val in ipairs(div.content) do 
        metafile:write(key .. val.t .. "\r")
      end
      -- for k, v in pairs(pandoc.MetaMap(doc.meta)) do
      --   metafile:write(k .. " - " .. v)
      -- end
      return div
    end
  }
}
