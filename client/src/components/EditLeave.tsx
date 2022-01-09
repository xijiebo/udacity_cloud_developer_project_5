import * as React from 'react'
import Auth from '../auth/Auth'
import { getUploadUrl, uploadFile } from '../api/leaves-api'
import {
  Form,
  Button,
  Grid,
  Input,
} from 'semantic-ui-react'
import { patchLeave } from '../api/leaves-api'

enum UploadState {
  NoUpload,
  FetchingPresignedUrl,
  UploadingFile,
}

interface EditLeaveProps {
  match: {
    params: {
      leaveId: string,
      name: string,
      date: string,
      hours: number
    }
  }
  auth: Auth
}

interface EditLeaveState {
  file: any
  uploadState: UploadState
  name: string
  date: string
  hours: number

}

export class EditLeave extends React.PureComponent<EditLeaveProps,EditLeaveState> {

  state: EditLeaveState = {
    file: undefined,
    uploadState: UploadState.NoUpload,
    name: '',
    date: '',
    hours: 0
  }

  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    this.setState({
      file: files[0]
    })
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {
      if (!this.state.file) {
        alert('File should be selected')
        return
      }

      this.setUploadState(UploadState.FetchingPresignedUrl)
      const uploadUrl = await getUploadUrl(this.props.auth.getIdToken(), this.props.match.params.leaveId)

      this.setUploadState(UploadState.UploadingFile)
      await uploadFile(uploadUrl, this.state.file)

      alert('File was uploaded!')
    } catch (e) {
      alert('Could not upload a file: ' + e.message)
    } finally {
      this.setUploadState(UploadState.NoUpload)
    }
  }

  setUploadState(uploadState: UploadState) {
    this.setState({
      uploadState
    })
  }

  handleLeaveNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.state.name = event.target.value
  }
  handleLeaveDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.state.date = event.target.value
  }
  handleLeaveHoursChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.state.hours = Number(event.target.value)
  }


  onLeaveUpdate = async () => {
    try {
      const newLeave = await patchLeave(this.props.auth.getIdToken(), this.props.match.params.leaveId, {
        name: this.state.name,
        leaveDate: this.state.date,
        hours: this.state.hours
      })

      //TODO::: 8675309
      /*
      this.setState({
        Leaves: [...this.state.Leaves, newLeave],
        newLeaveName: ''
      })
      */
    } catch(e) {
      alert('Leave creation failed ' + e.message)
    }
  }

  onUpdateLeaveButtonClick = async () => {
    try {
      await patchLeave(this.props.auth.getIdToken(), this.props.match.params.leaveId, {
        name: this.state.name,
        leaveDate: this.state.date,
        hours: this.state.hours
      })
    } catch(e) {
      alert('Leave creation failed ' + e.message)
    }
  }

  render() {
    this.state.name = this.props.match.params.name
    this.state.date = this.props.match.params.date
    this.state.hours = this.props.match.params.hours
    return (
      <div>
        <h1>Update leave</h1>

        <Grid>
        <Grid.Row>
          <Grid.Column width={4}>
            <Input
              fluid
              placeholder="Vacation"
              defaultValue ={this.state.name}
              onChange={this.handleLeaveNameChange}
            />
          </Grid.Column>

          <Grid.Column width={4}>
            <Input
              fluid
              placeholder="Date"
              defaultValue ={this.state.date}
              onChange={this.handleLeaveDateChange}
            />
          </Grid.Column>
          <Grid.Column width={4}>
            <Input
              fluid
              placeholder="Hours"
              defaultValue ={this.state.hours}
              onChange={this.handleLeaveHoursChange}
            />
          </Grid.Column>
          <Grid.Column>  
          </Grid.Column> 
          <Grid.Column >
            <Button
              icon
              color="green"
              onClick={this.onUpdateLeaveButtonClick}
            >
                Update
            </Button>
          </Grid.Column>         
        </Grid.Row>          
      </Grid>

      <Grid>
      <Grid.Row>
      </Grid.Row>   
      </Grid>
      

      <Grid>
       
        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label><h1>Upload new image</h1></label>
            <input
              type="file"
              accept="image/*"
              placeholder="Image to upload"
              onChange={this.handleFileChange}
            />
          </Form.Field>

          {this.renderButton()}
        </Form>
        </Grid>
   

      </div>
    )
  }

  renderButton() {

    return (
      <div>
        {this.state.uploadState === UploadState.FetchingPresignedUrl && <p>Uploading image metadata</p>}
        {this.state.uploadState === UploadState.UploadingFile && <p>Uploading file</p>}
        <Button
          loading={this.state.uploadState !== UploadState.NoUpload}
          type="submit"
          color="green"
        >
          Upload
        </Button>
      </div>
    )
  }
}
