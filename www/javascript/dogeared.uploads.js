function dogeared_uploads_init(){

    document.getElementById("upload").onchange = function(){

	$("#dogear-this").show();
	console.log(this.value);
    };

    $("#dogear-this").click(function(){
	dogeared_uploads_upload_file();
	return false;
    });
}

function dogeared_uploads_upload_file(){

    $("#upload").attr("disabled", "disabled");
	
    var method = "dogeared.documents.uploadDocument";

    var args = new FormData();
    
    var uploads = $("#upload");
    var files = uploads = uploads[0].files;
    args.append('document', files[0]);

    var on_success = function(rsp){
	console.log("cool");
	console.log(rsp);
    };

    var on_error = function(rsp){
	console.log("not cool");
	console.log(rsp);
    };

    console.log(method);
    console.log(args);

    dogeared_api_call(method, args);
}
