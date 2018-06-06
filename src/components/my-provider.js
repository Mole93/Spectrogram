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
    resolutionMax: 20000,//Real Max
    resolutionMin: 20, // Real Min
    limitMax: 99, // Range slider max
    limitMin: 31, // Range slider Min
    min: 20, // Temp Min for Input
    max: 20000, // Temp Max for Input
    mode: false,
    //hidePanes: false,
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
        handleModeSwitch: () => {
          if(this.state.mode){
            this.setState({
              mode: false,
            });
          } else {
            this.setState({
              mode: true,
            });
          };

        },        
        handleRangeChange: value => {
          if(value.length){
            let newMin = Math.round(this.convertToLog(value[0], 1,100, 1, 20000));
            let newMax = Math.round(this.convertToLog(value[1], 1,100, 1, 20000));
            this.setState({
              min: newMin,
              max: newMax,
              limitMin: value[0],
              limitMax: value[1],
              resolutionMin: newMin,
              resolutionMax: newMax
            });
          }
        },

        handleMinChange: (e, data) => this.setState({min: data.value}),
        handleMaxChange: (e, data) => this.setState({max: data.value}),
        handleInputChange: (e) => {
          if(e.key === "Enter"){
            let lowerValue = Number(this.state.min);
            let upperValue = Number(this.state.max);
            lowerValue = (!isNaN(lowerValue) && lowerValue < this.state.resolutionMax && lowerValue > 0 && lowerValue < 20000) ? lowerValue: 1;
            upperValue = (!isNaN(upperValue) && upperValue > this.state.resolutionMin && upperValue > 0 && upperValue <= 20000) ? upperValue: 20000;
            let newMin = this.convertToLinear(lowerValue, 1, 100, 1, 20000);
            let newMax = this.convertToLinear(upperValue, 1,100, 1, 20000);
            lowerValue = Math.round(lowerValue);
            upperValue = Math.round(upperValue);
            this.setState({min: lowerValue, max: upperValue, resolutionMin: lowerValue, resolutionMax: upperValue, limitMin: newMin, limitMax: newMax });

          }
        },
        //menuClose: () => this.setState({hidePanes: true}),
        handleHidePanesCompletion: ()=> this.setState({hidePanes: false}),
        handleResize: () => this.setState({width: window.innerWidth, height: window.innerHeight}),
        handleZoom: (upper, lower) => {
          let upperValue = Number(upper);
          let lowerValue = Number(lower);
          let newMax = this.convertToLinear(upperValue, 1,100, 1, 20000);
          let newMin = this.convertToLinear(lowerValue, 1, 100, 1, 20000);
          lowerValue = Math.round(lowerValue);
          upperValue = Math.round(upperValue);
          this.setState({min: lowerValue, max: upperValue, resolutionMin: lowerValue, resolutionMax: upperValue, limitMin: newMin, limitMax: newMax });
        },
        start: ()=> this.setState({isStarted: true}),
        reset: ()=> this.setState({ ...defaultState, isStarted: this.state.isStarted})

      }}>
        {this.props.children}
      </MyContext.Provider>
    );
  };


}
export default MyProvider;
