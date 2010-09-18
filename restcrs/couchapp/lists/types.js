function(head, req) {
	var row;
	provides('html',
		function() {
			var mr = req.path.pop();
			send('<h1>'+mr[0].toUpperCase()+mr.substr(1)+'</h1>');
			send('<ul class="'+mr+'">');
			while(row = getRow()) {
				send('<li>'+row.value.name);
				if (mr == 'airports') {
					send(' (<a href="http://maps.google.com/?ll='+row.value.loc[1]+','+row.value.loc[0]+'&z=13">map</a>)');
				} else if (mr == 'airlines') {
					send(' (<a rel="describedBy" href="/restcrs/_design/couchapp/_show/airline/'+row.id+'">details</a>)')			}
				send('</li>');
			}
			send('</ul>');
		}
	);
};