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

  onLeaveUpdate = async () => {
    alert("222222222222222222222222222222222222222222")
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
    alert("222222222222222222222222222222222222222222")
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
        <h1>Upload new image</h1>

        <Grid>
        <Grid.Row>
          <Grid.Column width={4}>
            <Input
              fluid
              placeholder="Vacation"
              value={this.state.name}
            />
          </Grid.Column>

          <Grid.Column width={4}>
            <Input
              fluid
              placeholder="Date"
              value={this.state.date}
            />
          </Grid.Column>
          <Grid.Column width={4}>
            <Input
              fluid
              placeholder="Hours"
              value={this.state.hours}
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

        <div></div>
        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>File</label>
            <input
              type="file"
              accept="image/*"
              placeholder="Image to upload"
              onChange={this.handleFileChange}
            />
          </Form.Field>

          {this.renderButton()}
        </Form>
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
        >
          Upload
        </Button>
      </div>
    )
  }
}
