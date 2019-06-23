import React from 'react'
import './select.scss'

export default class Select extends React.Component {
  constructor () {
    super()
    this.state = {
      active: false
    }
    this.open = this.open.bind(this)
    this.select = this.select.bind(this)
    this.tryClose = this.tryClose.bind(this)
    window.addEventListener('click', this.tryClose)
  }
  componentWillUnmount () {
    window.removeEventListener('click', this.tryClose)
  }
  open (open, e) {
    e.stopPropagation()
    this.setState({
      active: open
    })
  }
  tryClose (e) {
    e.stopPropagation()
    if (this.state.active) this.open(false, e)
  }
  select (i, e) {
    this.open(false, e)
    this.props.onChange(i)
  }
  render () {
    return (
      <div className={'select-container' + (this.state.active ? ' active' : '')}>
        <div className='select-current flex-container' onClick={(e) => this.open(true, e)}>
          <span className='flex'>{this.props.activeIndex > -1
            ? (this.props.itemRenderer
              ? this.props.itemRenderer({ item: this.props.items[this.props.activeIndex], index: this.props.activeIndex })
              : this.props.items[this.props.activeIndex])
            : this.props.placeholder || '• Select •'}</span>
          <span className='icon' dangerouslySetInnerHTML={{ __html: '<svg viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" /></svg>' }} />
        </div>
        <ul className='select-items'>
          {this.props.items.map((item, i) =>
            (this.props.itemRenderer
              ? <li key={i} onClick={(e) => this.select(i, e)}>{this.props.itemRenderer({ item, index: i })}</li>
              : <li key={i} onClick={(e) => this.select(i, e)}>{item}</li>)
          )}
        </ul>
      </div>
    )
  }
}
