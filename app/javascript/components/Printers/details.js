/*
 *  details.js
 *  LayerKeep
 * 
 *  Created by Wess Cope (me@wess.io) on 04/30/19
 *  Copyright 2018 WessCope
 */

import React              from 'react';
import { Link }           from 'react-router-dom';
import { RepoDetails }    from '../Repo/details';
import { PrinterHandler } from '../../handlers';
import SpinnerModal       from '../Modal/spinner';

import { 
  Container,
  Breadcrumb, 
  BreadcrumbItem,
  Columns,
  Column,
  Table,
  Button
} from 'bloomer';

export class PrinterDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      printer: {},
      hasError: 0
    };

    this.loadPrinterDetails = this.loadPrinterDetails.bind(this);
  }

  componentDidMount() {
    this.loadPrinterDetails();
  }

  loadPrinterDetails() { 
    this.setState({isLoading: true})   
    PrinterHandler.get(this.props.match.params.username, this.props.match.params.printerId)
    .then((response) => {
      this.setState({
        printer: response.data.data,
        isLoading: false
      })
    })
    .catch((err) => {
      var errMessage = "There was an error loading the printer details."
      if (err.response.data && err.response.data.error) {
        var error = err.response.data.error
        if (error.message) {
          errMessage = error.message
        } else {
          errMessage = JSON.stringify(error)
        }
      }
      this.setState({
        error:      errMessage,
        isLoading: false
      })
    });
  }

  renderPrint(item) {
    return(
      <tr key={item.id}>
        <td className="file-details is-text-overflow">
          <p>
            <Link to={`/${this.props.match.params.username}/prints/${item.id}`}>{item.attributes.job}</Link>
          </p>
        </td>

        <td colSpan={3} className="cell-content is-text-overflow">
          <p>
            {item.attributes.description}
          </p>
        </td>
        
        <td className="has-text-right">
          <p>{dayjs(item.attributes.created_at).format('MM.DD.YYYY')}</p>
        </td>
      </tr>
    )
  }

  renderPrints() {
    if (this.state.printer.attributes.prints && this.state.printer.attributes.prints.length > 0) {
      return this.state.printer.attributes.prints.map(this.renderPrint.bind(this));
      // (item) => {
      //   return renderPrint(item)
      //   return (<PrintAssetItem item={item} owner={this.state.print} key={item.attributes.name} match={this.props.match} />)
      // });
    } else {
      return (<tr><td>No Prints</td></tr>)
    }
  }

  renderPrintsContainer() {
    return (
      <div>
        <h3 className="title is-4" style={{ marginTop: '30px' }}>Prints</h3>
          <Table isNarrow className="is-fullwidth" style={{marginTop: '10px'}}>
            <thead>
              <tr style={{background: '#eff7ff', border: '1px solid #c1ddff'}}>
                <th colSpan={1} style={{fontWeight: 'normal'}}>
                  Job #
                </th>
                <th colSpan={3} style={{fontWeight: 'normal'}}>
                  Description
                </th>
                <th colSpan={1} className="has-text-right" style={{fontWeight: 'normal'}}>
                  Created At
                </th>
              </tr>
            </thead>
            <tbody style={{border: '1px solid #dadee1'}}>
              {this.renderPrints()}
            </tbody>
          </Table> 
      </div>
    )
  }

  renderPrinterDetails() {
    return (
      <div className={`card`}>
        <div className="card-header">
          <div className="card-header-title level">
            <p className="level-left">Printer {this.state.printer.attributes.name}</p>
          </div>
        </div>

        <div className="card-content">
            <div className="level">
              <div className="level-left">
                <div className="level-item">
                  Model:
                </div>
                <div className="level-item">
                  {this.state.printer.attributes.model}
                </div>
              </div>
            </div>
            <div className="level">
              <div className="level-left">
                <div className="level-item">
                  Description:
                </div>
                <div className="level-item">
                  {this.state.printer.attributes.description}
                </div>
              </div>
            </div>
        </div>
      </div>
    )
  }

  renderContent() {
    if (this.state.isLoading) {
      return (<SpinnerModal />)
    } else if (this.state.error) {
      return (
        <article className="message is-danger">
          <div className="message-body">
            {this.state.error}
          </div>
        </article>
      )
    } else {
      return (<div>
          {this.renderPrinterDetails()}
          {this.renderPrintsContainer()}
        </div>
      )
    }
  }

  render() {    
    return (
      <div className="section">
        <Container className="is-fluid">
          <Columns className="is-mobile">
            <Column>
              <Breadcrumb>
                <ul>
                  <BreadcrumbItem className="title is-4">
                    <Link to={`/${this.props.match.params.username}/printers`}>Printers</Link>
                  </BreadcrumbItem>
                  <BreadcrumbItem className="title is-4" > &nbsp; {this.state.printer.attributes && this.state.printer.attributes.name}</BreadcrumbItem>
                </ul>
              </Breadcrumb>
            </Column>
            <Column className="has-text-right"><Link className="button" to={`${this.props.match.url}/edit`}>Edit</Link></Column>
          </Columns>
          {this.renderContent()}
          
        </Container>

        <br/>
      </div>
    )
  }   
}


export default PrinterDetails;
