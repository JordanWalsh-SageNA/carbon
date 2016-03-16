import React from 'react';
import Icon from './../icon';
import NumberComponent from './../number';
import Dropdown from './../dropdown';
import Immutable from 'immutable';

/**
 * A Pager widget.
 *
 * == How to use a Pager in a component:
 *
 * In your file
 *
 *   import Pager from 'carbon/lib/components/pager';
 *
 * To render a Pager:
 *
 *   <Pager currentPage='1' totalRecords='100' onPagination={ function(){} } />
 *
 * @class Pager
 */
class Pager extends React.Component {

  static propTypes = {

    /**
     * Current visible page
     *
     * @property currentPage
     * @type {String}
     */
    currentPage: React.PropTypes.string.isRequired,

    /**
     * Total number of records
     *
     * @property totalRecords
     * @type {String}
     */
    totalRecords: React.PropTypes.string.isRequired,

    /**
     * Function called when any pager changes take place
     * PageSize, Current Page
     *
     * @property onPagination
     * @type {Function}
     */
    onPagination: React.PropTypes.func.isRequired,

    /**
     * Pagination page size
     *
     * @property pageSize
     * @type {String}
     */
    pageSize: React.PropTypes.string,

    /**
     * Should the page size selection dropdown be shown
     *
     * @property showPageSizeSelection
     * @type {Boolean}
     */
    showPageSizeSelection: React.PropTypes.bool,

    /**
     * Set of page size options
     *
     * @property pageSizeSelectionOptions
     * @type {Object}
     */
    pageSizeSelectionOptions: React.PropTypes.object
  }

  static defaultProps = {
    pageSize: 10,
    showPageSizeSelection: false,
    pageSizeSelectionOptions: Immutable.fromJS([
      { id: '10', name: 10 },
      { id: '25', name: 25 },
      { id: '50', name: 50 }
    ])
  }

  state = {
    currentPage: this.props.currentPage
  }

  /**
   * Ensure the currentPage is defined by props
   *
   * @method componentWillReceiveProps
   * @param {Object} new props for component
   * @return {Void}
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.currentPage !== this.state.currentPage){
      this.setState({ currentPage: nextProps.currentPage });
    }
  }

  /**
   * Handle current page input internally until blur event
   *
   * @method handleCurrentPageInputChange
   * @return {Void}
   */
  handleCurrentPageInputChange = (ev) => {
    this.setState({ currentPage: ev.target.value });
  }

  /**
   * Emit change function depending on event
   *
   * @method emitChangeCallback
   * @param {String} element source of change
   * @param {Event} ev change event
   */
  emitChangeCallback = (element, ev) => {
    let newPage;
    switch (element) {
      case 'next':
        newPage = String(Number(this.props.currentPage) + 1);
        this.props.onPagination(newPage, this.props.pageSize);
        break;

      case 'input':
        // TODO Check input is valid
        let maxPage = this.maxPage;
        newPage = ev.target.value;

        if (Number(newPage) > maxPage) {
          newPage = String(maxPage);
        }

        this.props.onPagination(newPage, this.props.pageSize);
        break;

      case 'previous':
        newPage = String(Number(this.props.currentPage) - 1);
        this.props.onPagination(newPage, this.props.pageSize);
        break;

      case 'size':
        let newPageSize = ev.target.value;
        // TODO: Check page size is in options
        // TODO: Clever current page correction
        this.props.onPagination('1', newPageSize);
        break;
    }
  }

  /**
   * Calculate the maximum page
   *
   * @method maxPage
   * @return {Integer}
   */
  get maxPage() {
    // Divide by zero check?
    return Math.ceil(this.props.totalRecords / this.props.pageSize);
  }

  /**
   * Should the previous arrow be disabled
   *
   * @method disablePrevious
   * @return {Boolean}
   */
  get disablePrevious() {
    return this.props.currentPage === '1';
  }

  /**
   * Should the next arrow be disabled
   *
   * @method disableNext
   * @return {Boolean}
   */
  get disableNext() {
    return this.props.currentPage * this.props.pageSize >= Number(this.props.totalRecords);
  }

  /**
   * Should the page number input be disabled
   *
   * @method disabeCurrentPageInput
   * @return {Boolean}
   */
  get disableCurrentPageInput() {
    return Number(this.props.totalRecords) <= Number(this.props.pageSize);
  }

  /**
   * Get previous arrow icon
   *
   * @method previousArrow
   * @return {JSX}
   */
  get previousArrow() {
    let props = {
      type: 'dropdown',
      className: 'ui-pager__previous'
    };

    if (this.disablePrevious) {
      props.className += ' ui-pager__previous--disabled';
    } else {
      props.onClick = this.emitChangeCallback.bind(this, 'previous');
    }

    return (
      <Icon { ...props } />
    );
  }

  /**
   * Get current page number input
   *
   * @method currentPageInput
   * @return {JSX}
   */
  get currentPageInput() {
    let props = {
      value: this.state.currentPage,
      className: 'ui-pager__current-page'
    };

    if (this.disableCurrentPageInput) {
      props.disabled = true;
      props.readOnly = true;
      props.className += ' ui-pager__current-page--disabled';
    } else {
      props.onChange = this.handleCurrentPageInputChange,
      props.onBlur = this.emitChangeCallback.bind(this, 'input');
    }

    return (
      <NumberComponent { ...props } />
    );
  }

  /**
   * Get next arrow icon
   *
   * @method nextArrow
   * @return {JSX}
   */
  get nextArrow() {
    let props = {
      className: 'ui-pager__next',
      type: 'dropdown'
    };

    if (this.disableNext) {
      props.className += ' ui-pager__next--disabled';
    } else {
      props.onClick = this.emitChangeCallback.bind(this, 'next');
    }

    return (
      <Icon { ...props } />
    );
  }

  /**
   * Page Size Selection Dropdown
   *
   * @method sizeSelectionDropdown
   * @return {JSX}
   */
  get sizeSelectionDropdown() {
    if (this.props.showPageSizeSelection) {
      return (
        <Dropdown
          options={ this.props.pageSizeSelectionOptions }
          value={ this.props.pageSize }
          onChange={ this.emitChangeCallback.bind(this, 'size') }
        />
      );
    }
  }

  /**
   * Render method for page
   *
   * @method render
   * @return {JSX}
   */
  render() {
    return(
      <div className='ui-pager'>

        <div className='ui-pager__size' >
          { this.sizeSelectionDropdown }
        </div>

        <div className='ui-pager__navigation' >
          { this.previousArrow }
          <span className='unselectable'> Page </span>
          { this.currentPageInput }
          <span className='unselectable'> of { this.maxPage }</span>
          { this.nextArrow }
        </div>

        <div className='ui-pager__summary'>
          { this.props.totalRecords } records
        </div>
      </div>
    );
  }
}

export default Pager;
