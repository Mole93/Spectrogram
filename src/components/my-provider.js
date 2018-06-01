import React, { Component } from 'react';
// React new Context API
// Create Context
export const MyContext = React.createContext();

// Then create provider component
let defaultState = {};
class MyProvider extends Component {
  //All Controls
  state = {
    soundOn: false,
    microphoneGain: 50,
    timbre: 'Sine',
    scaleOn: false,
    noteLinesOn: false,
    musicKey: {name: 'C', value: 0 },
    accidental: {name: ' ', value: 0},
    scale: {name: 'Major', value: 0},
    outputVolume: 50,
    attack: 0.005,
    release: 1,
    width: window.innerWidth,
    height: window.innerHeight,
    speed: 2,
    log: true,
    resolutionMax: 20000,
    resolutionMin: 20,
    limitMax: 99,
    limitMin: 31,
    mode: false,
    hidePanes: false,
    isStarted: false,
  }


  // Save state for reset
  componentDidMount(){
    defaultState = this.state;
  }
  // Helper Function for Conversion to log for outputVolume, graph scale
  convertToLog(value, originalMin, originalMax,newMin, newMax){
    //solving y=Ae^bx for y
    let b = Math.log(newMax / newMin)/(originalMax-originalMin);
    let a = newMax /  Math.pow(Math.E,  originalMax* b);
    let y = a *Math.pow(Math.E, b*value);
    // console.log(y);
    return y;
  }

  convertToLinear(value, originalMin, originalMax, newMin, newMax){
    //solving y=Ae^bx for x, x=ln(y-A)/b
        let b = Math.log(newMax / newMin)/(originalMax-originalMin);
        let a = newMax /  Math.pow(Math.E,  originalMax* b);
        let x = Math.log(value - a)/b;
      return x;
  }
  //Functions that setState based on Controls
  render() {
    return (
      <MyContext.Provider value={{
        state: this.state,
        handleGainChange: value => {
          if(this.state.isStarted){
            // let gain = this.convertToLog(value, 1, 100, 0.01, 500);
            this.setState({microphoneGain: value});
          }
        },
        handleSoundToggle: () => this.setState({soundOn: !this.state.soundOn}),
        handleScaleToggle: () => this.setState({scaleOn: !this.state.scaleOn}),
        handleNoteLinesToggle: () => this.setState({noteLinesOn: !this.state.noteLinesOn}),
        handleOutputVolumeChange: value => {
          if(this.state.isStarted){
            this.setState({outputVolume:value});
          }
        },
        handleTimbreChange: (e, data) => {
          let newTimbre = data.options[data.value].text;
          this.setState({timbre: newTimbre});
        },
        handleAttackChange: value => {
          if(this.state.isStarted){
            this.setState({attack: Math.round(value*10)/10});
          }
        },
        handleReleaseChange: value => {
          if(this.state.isStarted){
            this.setState({release: Math.round(value*10)/10});
          }
        },
        handleKeyChange: (e, data) => {
          let newKeyName = data.options[data.value].text;
          let newKeyValue = data.options[data.value].index;
          this.setState({musicKey: {name: newKeyName, value: newKeyValue}});
        },
        handleAccidentalChange: (e, data) => {
          let newAccidentalName = data.options[data.value].text;
          let newAccidentalValue = data.value;
          this.setState({accidental: {name: newAccidentalName, value: newAccidentalValue}});
        },
        handleScaleChange: (e, data) => {
          let newScaleName = data.options[data.value].text;
          let newScaleValue = data.value;
          this.setState({scale: {name: newScaleName, value: newScaleValue}});
        },
        handleRangeChange: value => {
          if(value.length){
            let newMin = Math.round(this.convertToLog(value[0], 1,100, 1, 20000));
            let newMax = Math.round(this.convertToLog(value[1], 1,100, 1, 20000));
            this.setState({
              limitMin: value[0],
              limitMax: value[1],
              resolutionMin: newMin,
              resolutionMax: newMax
            });
          }
        },
        handleModeSwitch: () => {
          if(this.state.mode){
            this.setState({
              mode: false,

            });
          } else {
            this.setState({
              mode: true,

            })
          }

        },
        handleMinChange: (e, data) => {
          let value = Number(data.value);
          value = (!isNaN(value) && value < this.state.resolutionMax && value > 0 && value < 20000) ? value: 1;
          let newMin = this.convertToLinear(value, 1,100, 1, 20000);
          this.setState({limitMin: newMin, resolutionMin: value});
        },
        handleMaxChange: (e, data) => {
          console.log(e.key);
          let value = Number(data.value);
          value = (!isNaN(value) && value > this.state.resolutionMin && value > 0 && value <= 20000) ? value: 20000;
          let newMax = this.convertToLinear(value, 1,100, 1, 20000);
          this.setState({limitMax: newMax, resolutionMax: value});
        },
        menuClose: () => this.setState({hidePanes: true}),
        handleHidePanesCompletion: ()=> this.setState({hidePanes: false}),
        handleResize: () => this.setState({width: window.innerWidth, height: window.innerHeight}),
        handleZoom: (upper, lower) => this.setState({resolutionMax: upper, resolutionMin: lower}),
        start: ()=> this.setState({isStarted: true}),
        reset: ()=> this.setState({ ...defaultState, isStarted: this.state.isStarted})

      }}>
        {this.props.children}
      </MyContext.Provider>
    );
  };


}
export default MyProvider;
