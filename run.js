const fs = require('fs')
const allFolder = [
  'banners', 'blog', 'brands', 'category', 'customization-product', 'design-your-room', 
  'diy-products', 'hobbie-images', 'hobbie-products', 'hobbie-products', 'hobbies', 'json',
  'media', 'ourcommunity', 'products', 'room-make-over', 'share-product', 'slider-images',
  'videos'
]

if(!fs.existsSync('public')) fs.mkdirSync('public')
allFolder.forEach((folderName) => {
  const path = `public/` + folderName
  if(fs.existsSync(path)) return
  
  fs.mkdirSync(path)
  console.info(`${folderName} folder created ! \n`)

})