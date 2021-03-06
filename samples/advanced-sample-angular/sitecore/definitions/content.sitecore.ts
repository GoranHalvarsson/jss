import { mergeFs } from '@sitecore-jss/sitecore-jss-dev-tools';
import * as path from 'path';

const ensureLeadingCharacter = (val, char = '/') => {
  if (!val) {
    return char;
  }
  return val.indexOf(char) > 0 ? `${char}${val}` : val;
};

const convertToItems = ({ data, basePath, rootItemName, language }) => {
  const itemPath = ensureLeadingCharacter(data.path.replace(basePath, '').replace(/\\/g, '/'), '/');
  const name = itemPath.substr(itemPath.lastIndexOf('/') + 1);

  // assume it's a folder if we don't find an item file
  let result = {
    path: itemPath,
    name: name || rootItemName,
    displayName: name || rootItemName,
    template: 'Folder',
    children: [],
  };

  const filename = `${language}.json`.toUpperCase();
  const file = data.files.find(f => f.filename.toUpperCase() === filename);
  if (file && file.contents) {
    result = file.contents;
    result.path = itemPath;
  }

  if (data.folders.length > 0) {
    result.children = data.folders
      .map(folder => convertToItems({ data: folder, basePath, language, rootItemName: null }))
      .filter(item => item); // remove null results
  }

  return result;
};

export default (manifest) => {
  const rootItemName = 'Content';
  const startPath = './data/content'; // relative to process invocation (i.e. where you call `npm run manifest:generate`)
  return mergeFs(startPath)
    .then((result) => {
      const items = convertToItems({ data: result, basePath: path.resolve(startPath), rootItemName, language: manifest.language });
      return items;
    })
    .then((contentData) => {
      manifest.addContent(contentData);
    });
};
