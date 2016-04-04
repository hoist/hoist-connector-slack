/* globals UI */

var C = UI.Views.Connector;

class EditForm extends C.View {
  constructor(props) {
    super(props);
    this.state = {
      events: []
    };
    if (!props.connector) {
      this.state.mode = 'connect';
    }
  }
  connect() {
    this.props.onConnect();
  }
  render() {
    if(this.props.connectorInstance) {
      return (
        <C.Page default="setup" {...this.props}>
          <C.Panel name="Setup" slug="setup">
            <C.Column type="notes">
              <h1>Set up an outgoing webhook in Slack</h1>

              <ol>
                <li>Go to the the slack hub and click 'Add Outgoing Webhooks Integration'.</li>
                <li>Scroll down to "Trigger Word(s)" and enter a trigger, in the demo we use jarvis.</li>
                <li>In the URL box, add: https://endpoint.hoi.io/jamie8884/cos/slack-incoming</li>
                <li>Click save, and then go back to the editor</li>
              </ol>
            </C.Column>
            <C.Column>
              <UI.FormElements.Button text={this.props.connectorInstance ? 'Reauthorize' : 'Connect'} type="large" onClick={()=>{
                  return this.connect();
                }} />
            </C.Column>
          </C.Panel>
        </C.Page>
      );
    } else {
      return (
        <C.Page default="setup" {...this.props}>
          <C.Panel name="Setup" slug="setup">
            <UI.FormElements.Button text={this.props.connectorInstance ? 'Reauthorize' : 'Connect'} type="large" onClick={()=>{
                return this.connect();
              }} />
          </C.Panel>
        </C.Page>
      );
    }
  }
}

export default EditForm;
global.EditForm = EditForm;
