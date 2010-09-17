function(doc) {
  if (doc.type && doc.type == 'airline') {
    emit(doc._id, doc);
  }
};