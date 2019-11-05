import React from 'react';
import TestButton from './components/TestButton';
import './index.css';
import { Notification } from './notification';

let API_URL = process.env.REACT_APP_STAGE === 'dev' ? "http://192.168.0.56:5000" : window.location.origin;

class FileUploader extends React.Component {

    //Ref for notification component
    notificationRef = React.createRef()

    constructor(props) {
        super(props);

        this.state = {
            selectedFile: null,
            selectedCol: '#011993',
        }
    }

    fileChangeHandler = (event) => {
        let val = event.target.files[0];
        this.setState({selectedFile: val});
    }

    colorChangeHandler = (event) => {
        let val = event.target.value;
        this.setState({selectedCol: val})
    }

    handleSubmit = (event) => {
        event.preventDefault()
        const data = new FormData()
        data.append('file', this.state.selectedFile)
        data.append('colour', this.state.selectedCol)
        this.notificationManager("Loading.. await response")
        this.submitData(data)
    }

    distanceHandlerActive = () => {
        //Run temp test for distance sensor active
        this.notificationManager("Test request activated")
        this.runTest(true)
    }

    distanceHandlerDeactive = () => {
        //Run temp test for distance sensor deactive
        this.notificationManager("Test request deactivated")
        this.runTest(false)
    }

    //Manage end point requests responses
    runTest = (data) => {
        this.endPointRequest(data).then((res) => {
            if(res === 200) {
                this.notificationManager("Test success")
            } else {
                this.notificationManager("Test failed")
            }
        }).catch(e => {
            this.notificationManager("Error: Test failed ", e.message)
        });
    }

    //End point requests for dummy distance sensor
    endPointRequest = async (state) => {
        var url = ''
        if(state){
            url = 'http://192.168.0.56:5000/start-test'
        } else {
            url = 'http://192.168.0.56:5000/test-kill'
        } 
        if(url !== '') {
            let response = await fetch(url, {
                headers: {'Content-Type': 'application/json'}
            })
            return await response.response
        }
        return null
    }
    
    //Manage request response handlers
    submitData = (data) => {
        this.uploadFile(data).then((file_res) => {
            this.uploadCol(data).then((col_res) => {
                if(file_res === 200 && col_res === 200) {
                    this.notificationManager("Upload success")
                } else if (file_res === 200 && col_res !== 200) {
                    this.notificationManager("Error: Colour upload failed")
                } else if (file_res !== 200 && col_res === 200) {
                    this.notificationManager("Error: File upload failed")
                } else {
                    this.notificationManager("Error: Upload failed")
                }
            }).catch(e => {
                this.notificationManager("Error: Colour upload failed ", e.message)
            });
        }).catch(e => {
            this.notificationManager("Error: File upload failed ", e.message)
        });
    }

    //POST: uploads audio file to server
    uploadFile = async (data) => {
        //const url = API_URL + '/upload-file'
        let url = 'http://192.168.0.56:5000/uploadfile'
        let response = await fetch(url, {
            method: 'POST',
            body: data,
        })
        return await response.response
    }

    //POST: uploads col to server
    uploadCol = async (selectedCol) => {
        //const url = API_URL + '/upload-colour';
        let url = 'http://192.168.0.56:5000/uploadcol';
        let response = await fetch(url, {
            method: 'POST',
            body: selectedCol,
        })
        return await response.response
    }

    //Inits timed notification component with message param
    notificationManager(message){
        this.notificationRef.current.openNotification(message)
    }

    render() {
        return (
            <div className="form_body">
                <form onSubmit={this.handleSubmit}> 
                    <label>Select Music File</label><br />
                    <input type="file" id="fileinput" name="file" accept=".mp3,.mp4;" onChange={this.fileChangeHandler}/><br />
                    <label>Select Colour</label><br /><br />
                    <input type="color" name="colour" onChange={this.colorChangeHandler} value={this.state.selectedCol}/> <br />
                    <input type="submit" value="Upload" className="inputbtn"/>  
                </form>
                <div className="test-button">
                    <TestButton 
                        endpoint={API_URL}
                    />
                </div>
                <br />
                <button className="tempSensorBtn" onClick={this.distanceHandlerActive} > Activate test</button>
                <button className="tempSensorBtn" onClick={this.distanceHandlerDeactive} > Deactivate test</button>
                <br />
                <Notification ref = {this.notificationRef} />
            </div>
        )
    }
}

export default FileUploader;