import Flash from './';
import Definition from './../../../demo2/utils/definition';
import OptionsHelper from './../../utils/helpers/options-helper';

let definition = new Definition('flash', Flash, {
  description: '[content needed] Basic example of the component',
  designerNotes: '[content needed] Basic designs description for the component',
  type: 'notification',
  propOptions: {
    as: OptionsHelper.colors
  },
  propValues: {
    message: 'This is some information from the Flash Component.',
    open: true
  },
  propTypes: {
    as: "String",
    open: "Boolean",
    onDismiss: "Function",
    message: "String || Object || Array",
    timeout: "String || Number"
  },
  propDescriptions: {
    as: "Sets the theme of the notification. Possible values include: " + OptionsHelper.colors.join(", "),
    open: "A boolean to control the open/closed state of the notification",
    onDismiss: "A callback for when the notification is dismissed. You can use this prop to close the notification",
    message: "The message provided to the flash component. This can be built in multiple formats e.g. \nA string: 'Alert' Array: ['Alert One', 'Alert Two']\nAn object with description: { description: 'Alert' }\nAn object with key/value pair: { first_name: 'is required', last_name: 'is required' }\nAn object with description & nested key/value pairs: { description: { first_name: 'is required', last_name: 'is required' } }",
    timeout: "Sets the time in Milliseconds the flash remains on the screen. After the timeout it will call the onDimiss callback. This will remove the close icon when set",
  },
  openPreview: true
});

definition.stubAction('onDismiss', 'open', false);

export default definition;