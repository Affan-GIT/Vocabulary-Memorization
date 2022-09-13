const fs = require('fs').promises;

const languageController = async (req, res) => {
  const { language, part, word, index } = req.params;
  const file = await getFile(language, part);
  const wordArray = stringToArray(file);
  let output = 'null';

  if (word === 'index') {
    if (index === 'random') {
      output = { heading: wordArray[0], word: getRandomWord(wordArray) };
    } else {
      output = {
        heading: wordArray[0],
        word: getWordFromIndex(index, wordArray),
      };
      if (output.word === undefined) {
        output = {
          heading: ['Completed'],
          word: ['Reset'],
        };
        console.log(output);
      }
    }
  } else {
    output = 'not yet implemented';
  }
  res.send(output);
};

// get file
const getFile = async (language, part) => {
  const filePath = `../database/${language.toLowerCase()}/${part.toLowerCase()}.txt`;
  let result;
  try {
    result = await fs.readFile(filePath, 'utf-8');
  } catch (err) {
    console.log(err);
    result = 'does not exist';
  }
  return result;
};

// get array
const stringToArray = (str) => {
  return str
    .replace('\r', '')
    .split('\n')
    .map((row) => row.split(': '));
};

// get word
const getWordFromIndex = (wordIndex, wordArray) => {
  return wordArray[wordIndex];
};

const getRandomWord = (wordArray) => {
  const randomIndex = getRandomIndex(0, wordArray.length - 1);
  return wordArray[randomIndex];
};

const getRandomIndex = (start, end) => {
  return Math.floor(Math.random() * (end + 1 - start)) + start;
};

const getLanguages = async (req, res) => {
  ls = await fs.readdir('../database');
  res.send(ls);
};

module.exports = { languageController, getLanguages };
