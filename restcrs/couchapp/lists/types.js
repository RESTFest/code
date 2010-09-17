function(head, req) {
	var row;
	provides('html',
		function() {
			send('<ul class="types">');
			while(row = getRow()) {
				if (row.value.doc.type != 'page') {
					send('<li>'+row.value.title+'</li>');
				}
			}
			send('</ul>');
		}
	);
};