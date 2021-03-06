import dateFormat from 'dateformat'
import { History } from 'history'
import * as React from 'react'
import {
  Button,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createLeave, deleteLeave, getLeaves, patchLeave } from '../api/leaves-api'
import Auth from '../auth/Auth'
import { Leave } from '../types/Leave'

interface LeavesProps {
  auth: Auth
  history: History
}

interface LeavesState {
  Leaves: Leave[]
  newLeaveName: string
  newLeaveDate: string
  newLeaveHours: number
  loadingLeaves: boolean
}

export class Leaves extends React.PureComponent<LeavesProps, LeavesState> {
  state: LeavesState = {
    Leaves: [],
    newLeaveName: '',
    newLeaveDate: '',
    newLeaveHours: 0,
    loadingLeaves: true
  }

  handleLeaveNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newLeaveName: event.target.value })
  }
  handleLeaveDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newLeaveDate: event.target.value })
  }
  handleLeaveHoursChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newLeaveHours: Number(event.target.value) })
  }



  onEditButtonClick = (leaveId: string, name: string, date: string, hours: number) => {
    const dateModified = date.split('/').join('-')
    this.props.history.push(`/leaves/${leaveId}/${name}/${dateModified}/${hours}/edit`)
  }
  

  onCreateLeaveButtonClick = async () => {
    try {
      const newLeave = await createLeave(this.props.auth.getIdToken(), {
        name: this.state.newLeaveName,
        leaveDate: this.state.newLeaveDate,
        hours: this.state.newLeaveHours
      })
      this.setState({
        Leaves: [...this.state.Leaves, newLeave],
        newLeaveName: ''
      })
    } catch(e) {
      alert('Leave creation failed ' + e.message)
    }
  }

  onLeaveCreate = async () => {
    try {
      const newLeave = await createLeave(this.props.auth.getIdToken(), {
        name: this.state.newLeaveName,
        leaveDate: this.state.newLeaveDate,
        hours: this.state.newLeaveHours
      })
      this.setState({
        Leaves: [...this.state.Leaves, newLeave],
        newLeaveName: ''
      })
    } catch(e) {
      alert('Leave creation failed ' + e.message)
    }
  }

  onLeaveDelete = async (leaveId: string) => {
    try {
      await deleteLeave(this.props.auth.getIdToken(), leaveId)
      this.setState({
        Leaves: this.state.Leaves.filter(Leave => Leave.leaveId != leaveId)
      })
    } catch(e) {
      alert(`Leave deletion failed: ${e.message}`)
    }
  }

  onLeaveCheck = async (pos: number) => {
    try {
      const Leave = this.state.Leaves[pos]
      await patchLeave(this.props.auth.getIdToken(), Leave.leaveId, {
        name: Leave.name,
        leaveDate: Leave.leaveDate,
        hours: Leave.hours
      })

    } catch {
      alert('Leave deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const Leaves = await getLeaves(this.props.auth.getIdToken())
      this.setState({
        Leaves,
        loadingLeaves: false
      })
    } catch (e) {
      alert(`Failed to fetch Leaves: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Leaves</Header>

        {this.renderCreateLeaveInput()}
        <Divider />
        {this.renderLeaves()}
      </div>
    )
  }

  renderCreateLeaveInput() {
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width={4}>
            <Input
              fluid
              placeholder="Vacation"
              onChange={this.handleLeaveNameChange}
            />
          </Grid.Column>

          <Grid.Column width={4}>
            <Input
              fluid
              placeholder="Date"
              onChange={this.handleLeaveDateChange}
            />
          </Grid.Column>
          <Grid.Column width={4}>
            <Input
              fluid
              placeholder="Hours"
              onChange={this.handleLeaveHoursChange}
            />
          </Grid.Column>
          <Grid.Column>  
          </Grid.Column> 
          <Grid.Column >
            <Button
              icon
              color="green"
              onClick = {this.onCreateLeaveButtonClick}        
            >
                Add
            </Button>
          </Grid.Column>         
        </Grid.Row>          
      </Grid>
    )
  }


  renderLeaves() {
    if (this.state.loadingLeaves) {
      return this.renderLoading()
    }

    return this.renderLeavesList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Leaves
        </Loader>
      </Grid.Row>
    )
  }

  renderLeavesList() {
    return (
      <Grid padded>
        {this.state.Leaves.map((Leave, pos) => {
          return (
            <Grid.Row key={Leave.leaveId}>
              <Grid.Column width={4} verticalAlign="middle">
                {Leave.name}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {Leave.leaveDate}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {Leave.hours}
              </Grid.Column>  
              <Grid.Column width={3} floated="right"    >               
                {Leave.attachmentUrl && (
                  <Image src={Leave.attachmentUrl} size="small" wrapped />
                )}
              </Grid.Column>       
              <Grid.Column width={2} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(Leave.leaveId, Leave.name, Leave.leaveDate, Leave.hours)}
                >
                  <Icon name="pencil" />
                </Button>
                <Button
                  icon
                  color="red"
                  onClick={() => this.onLeaveDelete(Leave.leaveId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>

              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateLeaveDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
