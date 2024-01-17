const fs = require('fs')
const allFolder = [
  'banners', 'blog', 'brands', 'category', 'customization-product', 'design-your-room', 
  'diy-products', 'hobbie-images', 'hobbie-products', 'hobbie-products', 'hobbies', 'json',
  'media', 'ourcommunity', 'products', 'room-make-over', 'share-product', 'slider-images',
  'videos'
]

const publicFolderCheck = fs.existsSync('public')
if(!publicFolderCheck) fs.mkdirSync('public')

allFolder.forEach((folderName) => {
  const path = `public/` + folderName
  const check = fs.existsSync(path)
  if(check) { 
    console.info(`${folderName} already exits \n`)
  } else {
    console.info(`${folderName} folder name not found ! \n`)
    fs.mkdirSync(path)
    
  }
})