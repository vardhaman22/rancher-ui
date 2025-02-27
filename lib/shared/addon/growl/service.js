import Service, { inject as service } from '@ember/service';
import Errors from 'ui/utils/errors';
import 'jgrowl';
import { setProperties } from '@ember/object';
import { escapeHtml } from 'shared/utils/util';
import { set } from '@ember/object';


export default Service.extend({
  app:  service(),
  intl: service(),

  isEmbedded: false,


  init() {
    this._super(...arguments);
    this.initjGrowlDefaults();
    const isEmbedded = window !== window.top;

    set(this, 'isEmbedded', isEmbedded);
  },

  initjGrowlDefaults() {
    let { defaults } = $.jGrowl;

    setProperties(defaults, {
      pool:           6,
      closeTemplate:  '<i class="icon icon-x"></i>',
      closerTemplate: `<div><button type="button" class="btn bg-info btn-sm btn-block">Dismiss All Notifications</button></div>`,
    });
  },

  close() {
    $("div.jGrowl").jGrowl("close"); // eslint-disable-line
  },

  raw(title, body, opt) {
    opt = opt || {};

    if ( title ) {
      opt.header = title;
    }

    return this.isEmbedded ?  null : $.jGrowl(escapeHtml(body), opt)
  },

  success(title, body) {
    this.raw(title, body, { theme: 'success' });
  },

  message(title, body) {
    this.raw(title, body, { theme: 'message' });
  },

  error(title, body) {
    this.raw(title, body, {
      sticky: true,
      theme:  'error'
    });
  },

  fromError(title, err) {
    if ( !err && typeof title === 'object' ) {
      err = title;
      title = 'Error';
    }

    var body = Errors.stringify(err);

    this.error(title, body);
  },
});
