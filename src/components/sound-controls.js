import React, {Component} from 'react';
import {MyContext} from './my-provider';

import EffectModule from './effect-module';

import {Segment, Menu, Dropdown, Checkbox, Button, Icon} from 'semantic-ui-react';
import "../styles/sound-controls.css";
// Using an ES6 transpiler like Babel
import Slider from 'react-rangeslider';
// To include the default styles
import 'react-rangeslider/lib/index.css';
import {timbreOptions, scaleOptions, keyOptions, accidentalOptions} from '../util/dropdownOptions';

import { getMousePos } from '../util/conversions'
// Sound Controls Class that renders all of the sound controls and uses the
// React Context API to hook up their functionality to the main state in app.js
// Which passes the controls down to Spectrogram
class SoundControls extends Component {

  render() {
    return (
      <MyContext.Consumer>
        {(context) => (
          <React.Fragment>
            <Segment className="menu-pane-container">
              <Menu className="menu-pane">
                {/** Sound Toggle **/}
                <Menu.Item className="vert">
                  <div className="menu-header">Sound</div>
                  <div className="sound-toggle-container">
                  <Checkbox
                  toggle
                  checked={context.state.soundOn}
                  onChange={context.handleSoundToggle}
                  disabled={!context.state.isStarted}
                  />

                  </div>
                {/*</Menu.Item>*/}

              {/*Microphone Gain*/}
              {/*<Menu.Item className="vert">
                <div className="menu-header">Microphone Gain</div>
                <br></br>
                  <Slider
                  min={1}
                  max={100}
                  value={context.state.microphoneGain}
                  onChange={context.handleGainChange}
                  tooltip={false}
                  className="gain-slider"/>
                  <div>
                  {context.state.microphoneGain}
                </div>
                </Menu.Item>*/}
                <br></br>
                {/** Output Volume **/}
                  <div className="menu-header">Output Volume</div>
                  <Slider
                  min={1}
                  max={100}
                  value={context.state.outputVolume}
                  onChange={context.handleOutputVolumeChange}
                  tooltip={context.state.isStarted}
                  className="slider"/>
                  <div>
                    {context.state.outputVolume}
                  </div>
                </Menu.Item>

                {/** Timbre **/}
                <Menu.Item className="vert">
                <div className="menu-header">Timbre</div>
                    <Dropdown
                    text={context.state.timbre}
                    fluid
                    options={timbreOptions}
                    onChange={context.handleTimbreChange}
                    disabled={!context.state.isStarted}
                    className="timbre-dropdown"/>
                    {/*<div className="timbre-text">
                      {context.state.timbre}
                    </div>*/}

                </Menu.Item>

                {/** ADSR **/}
                {/*<Menu.Item className="vert">
                  <div className="menu-header">ADSR</div>
                  <div className="horiz">
                    <div className="adsr-slider">
                      Attack Time (s)
                      <Slider
                      min={0}
                      max={5}
                      step={0.1}
                      value={context.state.attack}
                      onChange={context.handleAttackChange}
                      tooltip={context.state.isStarted}
                      className="slider"/>
                      {context.state.attack}
                    </div>
                    <div>
                      Release Time (s)
                      <Slider
                      min={0}
                      max={5}
                      step={0.1}
                      value={context.state.release}
                      onChange={context.handleReleaseChange}
                      tooltip={context.state.isStarted}
                      className="slider"/>
                      {context.state.release}
                    </div>
                  </div>
                </Menu.Item>*/}

                {/** Scale Menu **/}
                <Menu.Item className="vert">
                  <div className="menu-header">Scales</div>
                  <Menu.Menu className="horiz">
                    <Menu.Item className="vert no-line no-bot-padding">
                      <div>Scale Mode</div>
                      <Checkbox
                      toggle
                      className="scales-checkbox"
                      checked={context.state.scaleOn}
                      onChange={context.handleScaleToggle}
                      disabled={!context.state.isStarted || context.state.tuningMode}/>
                    </Menu.Item>
                    <Menu.Item>
                      <Dropdown
                      fluid
                      text='Key'
                      options={keyOptions}
                      onChange={context.handleKeyChange}
                      disabled={!context.state.isStarted}
                      >
                      </Dropdown>
                    </Menu.Item>
                    <Menu.Item>
                      <Dropdown
                      text='#/b'
                      compact
                      options={accidentalOptions}
                      onChange={context.handleAccidentalChange}
                      disabled={!context.state.isStarted}/>
                    </Menu.Item>
                    <Menu.Item>
                      <Dropdown
                      text='Scale'
                      compact
                      options={scaleOptions}
                      onChange={context.handleScaleChange}
                      disabled={!context.state.isStarted}/>
                    </Menu.Item>

                  </Menu.Menu>
                  <div className="scales-bottom">
                  <div className="note-lines">
                    <div>Note Lines</div>
                    <Checkbox
                    toggle
                    className="scales-checkbox"
                    checked={context.state.noteLinesOn}
                    onChange={context.handleNoteLinesToggle}
                    disabled={!context.state.isStarted || !context.state.scaleOn}/>
                  </div>
                  <div>
                  {/* Render Scale Name to screen. Don't render 'chromatic' scale name or accidental */}
                  {(context.state.scale.name === "Chromatic")? "" : context.state.musicKey.name}{(context.state.scale.name === "Chromatic")? "" : context.state.accidental.name}{context.state.scale.name}
                  </div>
                  </div>
                </Menu.Item>
                  {/* Effects */}
                <Menu.Item className="vert effects-stretch">
                <div className="menu-header">Effects</div>
                <div className="effects-container">
                  <EffectModule
                    name="Reverb"
                    toggle={context.state.reverbOn}
                    toggleChange={context.handleReverbToggle}
                    controlNames={["Decay Time"]}
                    controls={[context.state.reverbDecay]}
                    controlChanges={[context.handleReverbDecayChange]}
                    disable={!context.state.isStarted}
                  />
                  <EffectModule
                    name="Delay"
                    toggle={context.state.delayOn}
                    toggleChange={context.handleDelayToggle}
                    controlNames={["Delay Time", "Feedback"]}
                    controls={[context.state.delayTime, context.state.delayFeedback]}
                    controlChanges={[context.handleDelayTimeChange, context.handleDelayFeedbackChange]}
                    disable={!context.state.isStarted}
                  />
                  <EffectModule
                  name="Amplitude Modulation"
                  toggle={context.state.amOn}
                  toggleChange={context.handleAmToggle}
                  controlNames={["Frequency", "Amplitude"]}
                  controls={[context.state.amRate, context.state.amLevel]}
                  controlChanges={[context.handleAmRateChange, context.handleAmLevelChange]}
                  disable={!context.state.isStarted}
                  />
                  <EffectModule
                  name="Frequency Modulation"
                  toggle={context.state.fmOn}
                  toggleChange={context.handleFmToggle}
                  controlNames={["Frequency", "Amplitude"]}
                  controls={[context.state.fmRate, context.state.fmLevel]}
                  controlChanges={[context.handleFmRateChange, context.handleFmLevelChange]}
                  disable={!context.state.isStarted}
                  />
                  </div>
                </Menu.Item>

              </Menu>
              <div className="sound-close-menu">
                <Button icon onClick={this.props.closeMenu} className="close-menu">
                <Icon fitted name="angle double up" size="large"/>
                </Button>
              </div>

            </Segment>
          </React.Fragment>
        )}
      </MyContext.Consumer>
    );
  }
}

export default SoundControls;