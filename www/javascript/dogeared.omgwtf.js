function dogeared_omgwtf(bbq, log){

    var dt = new Date();
    dt = dt.toISOString();

    // why doesn't this work?
    // var c = arguments.callee.caller;
    // var lulz = '[' + c + '][' + dt + '] ' + bbq;

    var lulz = '[' + dt + '] ' + bbq;

    console.log(lulz);

    if (log){
	dogeared_omgwtf_append(lulz);
    }
}

function dogeared_omgwtf_init(){

    dogeared_omgwtf_purge();
}

function dogeared_omgwtf_append(bbq){

    var bucket = store.get('omgwtf');
    bucket.push(bbq);
    store.set('omgwtf', bucket);
}

function dogeared_omgwtf_purge(){

    var bucket = store.get('omgwtf');
    bucket = [];

    store.set('omgwtf', bucket);
}
