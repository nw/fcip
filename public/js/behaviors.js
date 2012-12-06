$('[rel=tooltip]').tooltip();
$('input.date').each(function(){
  var self = this;
  $(this)
    .datepicker({"dateFormat": 'mm-dd-yy'})
    .parent()
    .on('click', function(event){
      event.preventDefault();
      $(self).datepicker('show');
    });
});

$('table.tablesorter').each(function(){
  var table = $(this);
  var headers = {};
  table.find('thead th').each(function(i){
    var sorter = $(this).data('sorter');
    if(typeof sorter == 'undefined') return;
    if(sorter === false) headers[i] = { sorter: false };
    else headers[i] = {sorter: sorter};
  });
  table.tablesorter({headers: headers});
});


// helper to serialize data
function getPayload(el, selection, ns){
  var items = {}, obj = {};
  selection.forEach(function(item){
    items[item] = el.find(".input[name="+item+"]").val().trim();
  });
  if(!ns) return items;
  obj[ns] = items;
  return obj;
}

// multiple signatures
// postmsg(msg) // defaults to type: info
// postmsg(msg, delay)
// postmsg(type, msg, delay)
// el default = '#messages'
function postmsg(type, msg, el, delay){
    if(!isNaN(el)) delay = el;
    el = (el && isNaN(el)) ? el : '#messages'
  , delay = delay || 2000
  , len = arguments.length;

  if(len == 1 || (len == 2 && !isNaN(msg))){
    if(!isNaN(msg)) delay = msg;
    msg = type;
    type = "info";
  }
  
  var msg = template('alert', {type: type, message: msg}).prependTo(el);
  setTimeout(function(){ msg.alert('close'); }, delay);
  return msg;
}