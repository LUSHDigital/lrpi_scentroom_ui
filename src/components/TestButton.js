import React from 'react';
import './TestButton.css';
import '../index.css';

const testStates = {
    TEST_START : 0,
    TEST_IN_PROGRESS : 1,
    TEST_KILL : 2
}

class TestButton extends React.Component {

    constructor(props) {
        super(props);

    }

    state = {
        runTest: false
    }

    sendCommand = (c) => {
        if (c === testStates.TEST_START) {
            const url = this.props.endpoint + '/test-start';
            fetch(url, {
                method: 'GET'
            })
            .catch(error => console.log(error)
            );
        } else if (c === testStates.TEST_KILL) {
            const url = this.props.endpoint + '/test-kill';
            fetch(url, {
                method: 'GET'
            })
            .catch(error => console.log(error)
            );   
        }
    }

    triggerTest = (s) => {
        if (s === testStates.TEST_START) {
            console.log('Test running!'); 
            this.sendCommand(s); 
        } else if (s === testStates.TEST_KILL) {
            console.log('End of test...');
            this.sendCommand(s); 
        }
    }

    render() {
        return (
            <>
                <button 
                    onTouchStart={() => this.triggerTest(testStates.TEST_START)}
                    onTouchEnd={() => this.triggerTest(testStates.TEST_KILL)}
                    onMouseDown={() => this.triggerTest(testStates.TEST_START)}
                    onMouseUp={() => this.triggerTest(testStates.TEST_KILL)}
                    className="inputbtn">
                    Test
                </button>
                <div className="test-info">
                    <p>Press and hold the test button to hear the music and see the light</p>
                </div>
            </>
        )
    }

}

export default TestButton;