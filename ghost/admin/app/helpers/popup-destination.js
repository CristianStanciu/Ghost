import Helper from '@ember/component/helper';
import {getOwner} from '@ember/application';

// ember-basic-dropdown errors when Ember's root element is not the body
// causing a crash when dropdowns are opened inside our React shell.
//
// This helper should be used for the @destination arg when not using @renderInPlace
//
// @example
// ```hbs
// <PowerSelect ... @destination={{popup-destination}}>
// </PowerSelect>
// ```
export default class PopupDestinationHelper extends Helper {
    compute() {
        const owner = getOwner(this);
        const applicationInstance = owner.lookup('application:main');
        const rootElementSelector = applicationInstance.rootElement;

        const rootElement = document.querySelector(rootElementSelector);

        if (rootElement && rootElement !== document.body && rootElement.id) {
            return rootElement.id;
        }

        return null;
    }
}
