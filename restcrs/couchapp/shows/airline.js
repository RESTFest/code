function(doc, req) {  
	return {
  		body : '<h2>' + doc.name + '</h2>' +
  			'<ul>' +
  			' <li><strong>' + doc._id + ':</strong> <a href="' + doc.website + '">' + doc.website + '</li>' +
  			'</ul>'
  	};
}