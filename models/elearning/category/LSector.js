var keystone = require('keystone')
var Types = keystone.Field.Types;

/**
 * LSector Model
 * ==================
 */

var LSector = new keystone.List('LSector', {
	autokey: { from: 'name', path: 'key', unique: true },
	drilldown: 'industry'
});

LSector.add({
	name: { 
		type: String, 
		required: true 
	},
	industry: { 
		type: Types.Relationship, 
		ref: 'Industry', 
		many: false, 
		required: true, 
		initial: true 
	}
});

LSector.relationship({ ref: 'ISP', path: 'sector' });

LSector.defaultColumns = 'name, industry'

LSector.register();