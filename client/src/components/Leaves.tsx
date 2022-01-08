import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
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
  loadingLeaves: boolean
}

export class Leaves extends React.PureComponent<LeavesProps, LeavesState> {
  state: LeavesState = {
    Leaves: [],
    newLeaveName: '',
    loadingLeaves: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newLeaveName: event.target.value })
  }

  onEditButtonClick = (LeaveId: string) => {
    this.props.history.push(`/Leaves/${LeaveId}/edit`)
  }

  onLeaveCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const leaveDate = this.calculateDueDate()
      const hours = 8
      const newLeave = await createLeave(this.props.auth.getIdToken(), {
        name: this.state.newLeaveName,
        leaveDate,
        //TODO::: 8675309
        hours
      })
      this.setState({
        Leaves: [...this.state.Leaves, newLeave],
        newLeaveName: ''
      })
    } catch {
      alert('Leave creation failed')
    }
  }

  onLeaveDelete = async (leaveId: string) => {
    try {
      await deleteLeave(this.props.auth.getIdToken(), leaveId)
      this.setState({
        Leaves: this.state.Leaves.filter(Leave => Leave.leaveId != leaveId)
      })
    } catch {
      alert('Leave deletion failed')
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

      //TODO:: 8675309 fix me
      /*
      this.setState({
        Leaves: update(this.state.Leaves, {
          [pos]: { hours: { $set: !Leave.hours } }
        })
      })
      */
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

        {this.renderLeaves()}
      </div>
    )
  }

  renderCreateLeaveInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New task',
              onClick: this.onLeaveCreate
            }}
            fluid
            actionPosition="left"
            placeholder="To change the world..."
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
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
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onLeaveCheck(pos)}
                  //TODO::: 8675039, fix me
                  //checked={Leave.hours}
                />
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {Leave.name}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {Leave.leaveDate}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(Leave.leaveId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onLeaveDelete(Leave.leaveId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {Leave.attachmentUrl && (
                <Image src={Leave.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}