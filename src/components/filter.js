import React, {Component} from 'react';
import {SpectrogramContext} from './spectrogram-provider';
import {Segment} from 'semantic-ui-react';
import { getMousePos, getFreq } from "../util/conversions";
import "../styles/filter.css";
// import AxesFilterCanvas from './axesFilterCanvas';

const range = 10;

class Filter extends Component {
    constructor(props){
        super(props);
        this.state = {mouseDown: false};
        // this.axesRef = React.createRef();
    }
    componentDidMount(){
        this.ctx = this.canvas.getContext('2d');

        let dpi = window.devicePixelRatio;

        this.heights = new Array(this.canvas.height);
        // Load From Previous
        if(this.context.state.filterHeights){
            for (let i = 0; i < this.heights.length; i++) {
                this.ctx.fillStyle = "black";
                this.ctx.fillRect(0, i, this.canvas.width, 1); // Clears canvas for redraw of label
                this.heights[i] = this.context.state.filterHeights[i];
                this.ctx.fillStyle = '#56caff';
                this.ctx.fillRect(0, i, this.context.state.filterHeights[i], 1);
            }
        } else{
            this.ctx.fillStyle = '#56caff';
            for(let i = 0; i < this.heights.length; i++){
                this.heights[i] = this.canvas.width;
                this.ctx.fillRect(0, i, this.canvas.width, 1);
            }
        }
        // this.axesRef.current.renderAxesLabels();
        this.renderAxesLabels();
    }

    onMouseDown = e =>{
        let pos = getMousePos(this.canvas, e);
        // Floors the position of the mouse to eliminate canvas blurring
        pos.x = Math.floor(pos.x);
        pos.y = Math.floor(pos.y);

        // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clears canvas for redraw of label
        // this.ctx.clearRect(0, pos.y, this.canvas.width, range); // Clears canvas for redraw of label
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, pos.y, this.canvas.width, range); // Clears canvas for redraw of label
        this.ctx.fillStyle = '#56caff';
        this.ctx.fillRect(0, pos.y, pos.x, range);
        for (let i = 0; i < range; i++) {
            this.heights[Math.round(pos.y + i)] = pos.x;
        }
        this.renderAxesLabels();
        this.setState({mouseDown: true}); 
    }

    onMouseMove = e => { 
        if (this.state.mouseDown) {
            let pos = getMousePos(this.canvas, e);
            pos.x = Math.floor(pos.x);
            pos.y = Math.floor(pos.y);
            // this.ctx.clearRect(0, pos.y, this.canvas.width, range); // Clears canvas for redraw of label
            this.ctx.fillStyle = "black";
            this.ctx.fillRect(0, pos.y, this.canvas.width, range); // Clears canvas for redraw of label
            this.ctx.fillStyle = '#56caff';
            this.ctx.fillRect(0, pos.y, pos.x, range);
            for(let i =0; i<range; i++){
                this.heights[Math.round(pos.y+i)] = pos.x;
            }
            this.renderAxesLabels();
        }
    }

    onMouseUp = e => {
        this.setState({mouseDown: false});
        this.context.setFilter(this.heights, this.canvas.width, this.canvas.height);
    }

    onMouseOut = e => {
        if (this.state.mouseDown) {
            this.setState({mouseDown: false});
            this.context.setFilter(this.heights, this.canvas.width, this.canvas.height);
        }
    }

    onTouchStart = e => {
        if(e.changedTouches.length === 1){
            let pos = getMousePos(this.canvas, e.touches[0]);
            pos.x = Math.floor(pos.x);
            pos.y = Math.floor(pos.y);
            // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clears canvas for redraw of label
            // this.ctx.clearRect(0, pos.y, this.canvas.width, range); // Clears canvas for redraw of label
            this.ctx.fillStyle = "black";
            this.ctx.fillRect(0, pos.y, this.canvas.width, range); // Clears canvas for redraw of label
            this.ctx.fillStyle = '#56caff';
            this.ctx.fillRect(0, pos.y, pos.x, range);
            for (let i = 0; i < range; i++) {
                this.heights[Math.round(pos.y + i)] = pos.x;
            }
            this.renderAxesLabels();
        }
    }

    onTouchMove = e => {
        if (e.changedTouches.length === 1) {
            let pos = getMousePos(this.canvas, e.touches[0]);
            pos.x = Math.floor(pos.x);
            pos.y = Math.floor(pos.y);
            // this.ctx.clearRect(0, pos.y, this.canvas.width, range); // Clears canvas for redraw of label
            this.ctx.fillStyle = "black";
            this.ctx.fillRect(0, pos.y, this.canvas.width, range); // Clears canvas for redraw of label
            this.ctx.fillStyle = '#56caff';
            this.ctx.fillRect(0, pos.y, pos.x, range);
            for (let i = 0; i < range; i++) {
                this.heights[Math.round(pos.y + i)] = pos.x;
            }
            this.renderAxesLabels();
        }
    }

    onTouchEnd = e => {
        // this.renderAxesLabels();
        this.context.setFilter(this.heights, this.canvas.width, this.canvas.height);
    }

    renderAxesLabels(){
        // Render the vertical frequency axis.
        const ticks = 5;
        const units = 'Hz';
        const yLabelOffset = 5;
        for (var i = 0; i <= ticks; i++) {
            // Get the y coordinate from the current label.
            var percent = i / (ticks);
            var y = (1 - percent) * this.canvas.height;
            if (i === 0) {
                y -= 10;
            }
            if (i === ticks) {
                y += 10;
            }
            // Renders the position of the label 60 pixels from the right
            var x = this.canvas.width - 60;

            // Eliminate blur due to floating point coordinates in pixels
            x = Math.floor(x);
            y = Math.floor(y);

            // if (this.log) {
            // Handle a logarithmic scale.
            // var logIndex = this.logScale(index, maxSample)+minSample;
            // Never show 0 Hz.
            let resolutionMax = 20000;
            let resolutionMin = 20;
            let freq = Math.max(1, getFreq(percent, resolutionMin, resolutionMax));
            this.ctx.font = '12px Inconsolata';

            // Draw the value.
            this.ctx.textAlign = 'right';
            this.ctx.fillStyle = 'white';
            this.ctx.fillText(freq, x, y);
            // Draw the units.
            this.ctx.textAlign = 'left';
            this.ctx.fillStyle = 'white';
            this.ctx.fillText(units, x + 10, y);
            // Draw a tick mark.
            this.ctx.fillRect(x + 40, y, 30, 2);
        }
    }

    render(){
        return (
            <React.Fragment>
                <Segment className="menu-pane-container compact edit-filter-container">
                    <canvas
                    className="filter-canvas"
                    onContextMenu={(e) => e.preventDefault()}
                    onMouseDown={this.onMouseDown}
                    onMouseUp={this.onMouseUp}
                    onMouseMove={this.onMouseMove}
                    onMouseOut={this.onMouseOut}   
                    onTouchStart={this.onTouchStart}
                    onTouchMove={this.onTouchMove}
                    onTouchEnd={this.onTouchEnd}
                    ref={(c) => {this.canvas = c;}}/>
                    {/* <AxesFilterCanvas
                    ref={this.axesRef}
                    /> */}

                    {/* <div className="vert">
                        <Button
                            onClick={context.handleResetFilter}
                            id="filterReset"
                        >Reset</Button>
                    </div> */}
                </Segment>
            </React.Fragment>
        )
    }
}

Filter.contextType = SpectrogramContext;
export default Filter;