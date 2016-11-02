import React, { Component } from 'react'
import Link from '../Link'
import Icon from '../Icon'
import Form from '../Form'
import Card from './Card'
import Button from '../Button'
import ArchiveButton from './ArchiveButton'
import boardStore from '../../stores/boardStore'
import './CardModal.sass'
import $ from 'jquery'

export default class CardModal extends Component {
  static propTypes = {
    card: React.PropTypes.object.isRequired,
    list: React.PropTypes.object.isRequired,
    board: React.PropTypes.object.isRequired,
    onClose: React.PropTypes.func.isRequired,
  }
  static contextTypes = {
    session: React.PropTypes.object.isRequired
  }
  constructor(props){
    super(props)
    this.state = {
      editingDescription: false,
      editingName: false,
    }
    this.editDescription = this.editDescription.bind(this)
    this.stopEditingDescription = this.stopEditingDescription.bind(this)
    this.displayDescription = this.displayDescription.bind(this)
    this.updateDescription = this.updateDescription.bind(this)
    this.descriptionOnKeyDown = this.descriptionOnKeyDown.bind(this)
    this.updateName = this.updateName.bind(this)
    this.nameOnKeyDown = this.nameOnKeyDown.bind(this)
    this.editName = this.editName.bind(this)
    this.stopEditingName = this.stopEditingName.bind(this)
    this.descriptionOnBlur = this.descriptionOnBlur.bind(this)
    this.nameOnBlur = this.nameOnBlur.bind(this)
  }

  nameOnKeyDown(event) {
    const { card } = this.props
    const content = {
      content: this.refs.content.value
    }
    if (!event.shiftKey && event.keyCode === 13) {
      event.preventDefault()
      this.updateName(content)
    }
    if (event.keyCode === 27) {
      event.preventDefault()
      this.updateName(content)
    }
  }

  descriptionOnKeyDown(event) {
    const { card } = this.props
    const description = {
      description: this.refs.description.value,
    }
    if (!event.shiftKey && event.keyCode === 13) {
      event.preventDefault()
      this.updateDescription(description)
    }
    if (event.keyCode === 27) {
      event.preventDefault()
      this.updateDescription(description)
    }
  }

  descriptionOnBlur(event) {
    const { card } = this.props
    const description = {
      description: this.refs.description.value,
    }
    event.preventDefault()
    this.updateDescription(description)
  }

  nameOnBlur(event) {
    const { card } = this.props
    const content = {
      content: this.refs.content.value
    }
    event.preventDefault()
    this.updateName(content)
  }

  editName(){
    this.setState({editingName: true})
  }

  stopEditingName(){
    this.setState({editingName: false})
  }

  editDescription(){
    this.setState({editingDescription: true})
  }

  stopEditingDescription(){
    this.setState({editingDescription: false})
  }

  displayDescription(description){
    if(description==''){
      description = 'Enter notes or a description here.'

    }
    return <div>
        {description}
      </div>
  }

  updateDescription(description){
    const { card } = this.props
    $.ajax({
      method: 'post',
      url: `/api/cards/${card.id}`,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data: JSON.stringify(description),
    }).then(() => {
      this.stopEditingDescription()
      boardStore.reload()
    })
  }
  updateName(content){
    const { card } = this.props
    $.ajax({
      method: 'post',
      url: `/api/cards/${card.id}`,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data: JSON.stringify(content),
    }).then(() => {
      this.stopEditingName()
      boardStore.reload()
    })
  }


  render(){
    const { session } = this.context
    const description = this.displayDescription(this.props.card.description)
    const editDescriptionForm = this.state.editingDescription ?
      <Form className="CardModal-description-Edit" onSubmit={this.updateDescription}>
        <textarea
          className="CardModal-description-Edit-input"
          onBlur={this.descriptionOnBlur}
          onKeyDown={this.descriptonOnKeyDown}
          ref="description"
          defaultValue={this.props.card.description}
        />
        <Link className="CardModal-description-Edit-cancel" onClick={this.stopEditingDescription}>
          <Icon type="times" />
        </Link>
        </Form> : <div onClick={this.editDescription} className="CardModal-description-text">{description}</div>
    const editCardNameForm = this.state.editingName ?
    <div className="CardModal-header-name">
      <Form className="CardModal-header-Edit" onSubmit={this.updateName}>
        <textarea
          onBlur={this.nameOnBlur}
          className="CardModal-header-Edit-input"
          onKeyDown={this.nameOnKeyDown}
          ref="content"
          defaultValue={this.props.card.content}
        />
        <Link className="CardModal-header-Edit-cancel" onClick={this.stopEditingName}>
          <Icon type="times" />
        </Link>
        </Form>
      </div> : <div onClick={this.editName} className="CardModal-header-name">{this.props.card.content}</div>
    return <div className="CardModal">
      <div onClick={this.props.onClose} className="CardModal-shroud">
      </div>
      <div className="CardModal-stage">
        <div className="CardModal-window">
          <div className="CardModal-body">
            <div className="CardModal-content">
              <div className="CardModal-content-icon">
                <Icon type="window-maximize" size='2'/>
              </div>
              <div className="CardModal-content-copy">
                <div className="CardModal-content-title">
                  {editCardNameForm}
                </div>
                <div className="CardModal-content-list">
                  <span className="CardModal-content-list-title">
                    in list {this.props.list.name}
                  </span>
                  <span className="CardModal-content-list-eye">
                    <Icon size="1" type="eye"  />
                  </span>
                </div>
                <div className="CardModal-description">
                  <div className="CardModal-description-title">
                    Description
                    <Link className="CardModal-description-Edit-button" onClick={this.editDescription}>
                    Edit
                  </Link></div>
                  {editDescriptionForm}
                </div>
              </div>
            </div>
            <div className="CardModal-comments">
              <div className="CardModal-comments-icon">
                <Icon size="2" type="comment-o"/>
              </div>
              <div className="CardModal-comments-content">
                <span className="CardModal-comments-title">
                  Add Comment:
                </span>
              </div>
            </div>
            <div className="CardModal-comments">
              <div className="CardModal-comments-imgcontain">
                <img className="CardModal-comments-userimage" src={session.user.avatar_url}></img>
              </div>
              <Form className="CardModal-comments-Form">
                <div className="CardModal-comments-Form-content">
                  <textarea
                    className="CardModal-comments-Form-input"
                    ref="comment"
                    defaultValue='Write a comment...'
                  />
                </div>
                <input type="submit" className="CardModal-comments-submit" value="Send"/>
              </Form>
            </div>
          </div>
          <div className="CardModal-controls">
            <div className="CardModal-controls-add">
              <span className="CardModal-controls-title">Add</span>
              <div className="CardModal-controls-add-buttons">
                <Button>Members</Button>
              </div>
            </div>
            <div className="CardModal-controls-actions">
              <span className="CardModal-controls-title">Actions</span>
              <ArchiveCardButton card={this.props.card} className="CardModal-controls-archive"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  }
}

const ArchiveCardButton = (props) => {
  const onClick = () => {
    $.ajax({
      method: "POST",
      url: `/api/cards/${props.card.id}/archive`
    }).then(() => {
      boardStore.reload()
    })
  }
  return <ArchiveButton
    size='0'
    buttonName="Archive"
    confirmationTitle='Archive Card?'
    confirmationMessage='Are you sure you want to archive this card?'
    onClick={onClick}
    className={props.className}
    card={props.card}
  />
}
