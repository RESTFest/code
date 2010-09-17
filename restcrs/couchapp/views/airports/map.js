function(doc) {
  if (doc.type && doc.type == 'airport') {
    emit(doc._id, doc);
  }
};