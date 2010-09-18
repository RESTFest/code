function(head, req) {
	var row;
	provides('html',
		function() {
			var mr = req.path.pop();
			send('<ul class="'+mr+'">');
			while(row = getRow()) {
				send('<li>'+row.value.name);
				if (mr == 'airports') {
					send(' (<a href="http://maps.google.com/?ll='+row.value.loc[1]+','+row.value.loc[0]+'&z=13">map</a>)');
				}
				send('</li>');
			}
			send('</ul>');
		}
	);
};