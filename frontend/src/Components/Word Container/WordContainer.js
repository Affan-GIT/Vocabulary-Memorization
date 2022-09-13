import react from 'react';
import './wordContainer.css';
const axios = require('axios').default;

export class WordContainer extends react.Component {
  constructor() {
    super();
    this.state = {
      languages: [],
      language: '',
      index: 1,
      word: [],
      wordFirst: true,
      random: false,
      speedRun: false,
      speedRunTimer: 3000,
      hidden: 'hidden',
      part: '',
      heading: [''],
      parts: [],
    };
  }

  async getNextWord() {
    let link;
    if (this.state.random) {
      this.setState({ index: 1 });
      link = `http://localhost:5000/api/v1/${this.state.language}/${this.state.part}/index/random`;
    } else {
      link = `http://localhost:5000/api/v1/${this.state.language}/${this.state.part}/index/${this.state.index}`;
      this.setState({ index: this.state.index + 1 });
    }
    const result = await axios.get(link, this.state);
    const { heading, word } = result.data;
    this.setState({
      heading: heading[0].split(', '),
      word: word[0].split(', '),
    });
    if (heading[0] === 'Completed') {
      this.setState({ index: 1 });
    }
  }

  async getWordSpeedRun() {
    if (this.state.speedRun) {
      this.getNextWord();
      setTimeout(() => {
        this.revealMeaning();
        setTimeout(() => {
          this.revealMeaning();
          this.getWordSpeedRun();
        }, 1000);
      }, this.state.speedRunTimer);
    }
  }

  revealMeaning() {
    this.setState({ hidden: !this.state.hidden });
  }

  async getPartsOfLanguage() {
    const result = await axios.get(
      `http://localhost:5000/api/v1/${this.state.language}/parts`
    );
    this.setState({ parts: result.data, part: result.data[0] });
  }

  async getLanguages() {
    const result = await axios.get('http://localhost:5000/api/v1/languages');
    this.setState({ languages: result.data });
  }

  componentDidMount() {
    this.getPartsOfLanguage();
    this.getLanguages();
  }

  render() {
    return (
      <>
        <div className='wordContainer'>
          <div className='display'>
            <div className='columns'>
              {this.state.heading.map((heading, index) => {
                if (
                  (this.state.wordFirst &&
                    heading.toLocaleLowerCase() !== 'word') ||
                  (!this.state.wordFirst &&
                    heading.toLocaleLowerCase() !== 'meaning')
                ) {
                  return (
                    <div className='column'>
                      <div className='heading' style={{ margin: '0 10px' }}>
                        {heading}
                      </div>
                      <div
                        className={`word ${
                          this.state.hidden ? 'inactive' : 'active'
                        }`}
                      >
                        <div style={{ margin: ' 0 10px' }}>
                          {this.state.word[index]}
                        </div>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div className='column'>
                      <div className='heading'>{heading}</div>
                      <div className={`word`}>{this.state.word[index]}</div>
                    </div>
                  );
                }
              })}
            </div>
          </div>
          <div className='part'>
            <select
              name='part'
              id='part'
              onChange={(e) => {
                this.setState({ part: e.target.value, index: 1 });
              }}
            >
              {this.state.parts.map((part, index) => (
                <option value={`${part}`} key={index}>
                  {part}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className='controls'>
          <button
            className='getNextButton'
            onClick={() => {
              if (this.state.speedRun) {
                this.getWordSpeedRun();
              } else {
                this.getNextWord();
              }
            }}
          >
            Get Next
          </button>
          <button
            className='revealMeaning'
            onClick={() => {
              this.revealMeaning();
            }}
          >
            Reveal
          </button>
          <div className='control'>
            <label className='switch'>
              <input
                type='checkbox'
                className='randomSwitch'
                onChange={() => {
                  this.setState({ random: !this.state.random });
                }}
              />
              <span className='slider round'></span>
            </label>
            <div className='labelName'>Randomized</div>
          </div>
          <div className='control'>
            <label className='switch'>
              <input
                type='checkbox'
                className='speedRunSwitch'
                onChange={() => {
                  this.setState({ speedRun: !this.state.speedRun });
                }}
              />
              <span className='slider round'></span>
            </label>
            <div className='labelName'>Speed Run</div>
          </div>
          <div className='control'>
            <label className='switch'>
              <input
                type='checkbox'
                className='meaningSwitch'
                onChange={() => {
                  this.setState({ wordFirst: !this.state.wordFirst });
                }}
              />
              <span className='slider round'></span>
            </label>
            <div className='labelName'>Meaning</div>
          </div>
          <div className='languageField'>
            <select
              name='languages'
              id='languages'
              onChange={async (e) => {
                await this.setState({ language: e.target.value, index: 1 });
                this.getPartsOfLanguage();
              }}
            >
              <option value='' disabled selected hidden>
                Language
              </option>
              {this.state.languages.map((language) => (
                <option>{language}</option>
              ))}
            </select>
            <label htmlFor='languageInput'>Language</label>
          </div>
          <div className='speedRunField'>
            <input
              type='number'
              defaultValue={3000}
              onChange={(e) => {
                this.setState({ speedRunTimer: e.target.value });
              }}
            />
            <label htmlFor='speedRunTimeInput'>Speed Run Timer</label>
          </div>
        </div>
      </>
    );
  }
}
