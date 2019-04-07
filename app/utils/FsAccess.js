const fs = window.require('fs');
const path = window.require('path');

const photoExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.bpm', '.webp'];
const movieExtensions = ['.mp4', '.avi'];

class FsAccess {
  static searchByPath = activePath => {
    const activePhotos = [];

    //console.log('[FsAccess#createFolderItems] find path -> ' + activePath);
    let names = fs.readdirSync(activePath);
    console.log(names);

    names.map(name => {
      const extension = path.extname(name);
      const isPhoto = photoExtensions.indexOf(extension) >= 0;
      const isMovie = movieExtensions.indexOf(extension) >= 0;

      if (isPhoto || isMovie) {
        activePhotos.push({
          path: activePath,
          name: name,
          isPhoto: isPhoto,
          isMovie: isMovie
        });
      }
    });

    console.log(activePhotos);
    return activePhotos;
  };
}

export default FsAccess;
