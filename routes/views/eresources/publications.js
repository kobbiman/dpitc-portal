var keystone = require('keystone');
var async = require('async');

exports = module.exports = function (req, res) {
  var view = new keystone.View(req, res);
  var locals = res.locals;
  var filters = {};

  locals.section = 'eresources';
  locals.filters = {
    industry: req.query.industry,
    sector: req.query.sector,
    commodity: req.query.commodity
  };
  locals.data = {
    publications: []
  };

  locals.redirect = '/eresources/publications'
  locals.breadcrumbs = [
    { text: 'E Resources', link: '/eresources'},
    { text: 'Publications', link: '/eresources/publications'},
  ]
  // console.log(req._parsedUrl.query);
  locals.endpoint = '/eresources/publications'
  locals.query = ''

  var viewStyle = req.query.view == undefined ? 'grid' : req.query.view



  //GETTING LIST OF PUBLICATION LINES
  view.query('publicationLines', keystone.list('PublicationLine').model.find());

  view.query('publicationsSettings', keystone.list('publicationsSettings').model.findOne());

  // Getting the publication line of selected publication
  if (req.query.pubLine){
    console.log('req.query: ' + req.query);

    keystone.list('PublicationLine').model.findOne({_id: req.query.pubLine}).exec(function (err, result) {

      res.locals.resultsHeading = result.name;

    });
  }else{
  	res.locals.resultsHeading = "All Publications";
  }

  if (req.query.searchKey) {
    var searchKey = req.query.searchKey;

    res.locals.searchKey = searchKey;

    locals.query += '&searchKey=' + searchKey

    filters['$text'] = {
      $search: searchKey
    }

    res.locals.resultsHeading = 'Results for "' + searchKey + '"';
  }

  //PAGINATING PUBLICATIONS
  if (req.query.pubLine) {
    locals.query += '&pubLine=' + req.query.pubLine
    filters['publicationLine'] = req.query.pubLine
  }

  if (req.query.view) {
    locals.query += '&view=' + req.query.view
  }

  var Publications = keystone.list('Publication')

  Publications.paginate({
    page: req.query.page || 1,
    perPage: 20,
    maxPages: 10,
    filters: filters
  }).exec(function(err, results) {
    var index = 0;
    results.results.forEach(function(element, index) {
      element['index'] = results.first + (index++)
    })

    locals.data.publications = results;

    if (viewStyle == 'list') {
      //render list layout
      view.render('eresources/publications-list');
    } else {
      //render grid layout by default
      view.render('eresources/publications-grid');
    }
  })


}
