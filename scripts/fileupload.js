var $file = {
	checkImg : function($img){
		var reg = /\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/;
		return ($img && $img.match(reg));	
	},
	getReaderAsUrl : function(file){
		var $dfd = $.Deferred();
		var reader = new FileReader(); 
   		reader.readAsDataURL(file); 
    	reader.onload = function(e){ 
        	return $dfd.resolve(this.result);
    	} 
    	reader.onerror = function(e){ 
        	return $dfd.resolve(this.result);
    	} 
		return $dfd.promise();
	},
	resizeFile : function(file){
		var $dfd = $.Deferred();
		var reader = new FileReader(); 
   		reader.readAsDataURL(file); 
    	reader.onload = function(e){
			var image = new Image();   
        	image.src = e.target.result;  
			image.onload = function() {  
				var expectWidth = this.naturalWidth;  
				var expectHeight = this.naturalHeight;  
				  
				if (this.naturalWidth > this.naturalHeight && this.naturalWidth > 800) {  
					expectWidth = 400;  
					expectHeight = expectWidth * this.naturalHeight / this.naturalWidth;  
				} else if (this.naturalHeight > this.naturalWidth && this.naturalHeight > 1200) {  
					expectHeight = 800;  
					expectWidth = expectHeight * this.naturalWidth / this.naturalHeight;  
				}  
				//alert(expectWidth+','+expectHeight); 
				//console.log('preimg:'+image.src.length); 
				var canvas = document.createElement("canvas");  
				var ctx = canvas.getContext("2d");  
				canvas.width = expectWidth;  
				canvas.height = expectHeight;  
				ctx.drawImage(this, 0, 0, expectWidth, expectHeight);  
				//alert(canvas.width+','+canvas.height);  
				  
				var base64 = null; 
				base64 = canvas.toDataURL("image/jpeg", 1); 				
				//console.log(base64.length);
				
				return $dfd.resolve(base64);
			}
    	} 		
		return $dfd.promise();
	},
	compressImg : function(fileDataUrl){
		var $dfd = $.Deferred();
		var image = new Image();  
		image.src = fileDataUrl;  
		image.onload = function() {  
			var expectWidth = this.naturalWidth;  
			var expectHeight = this.naturalHeight;  
			  
			if (this.naturalWidth > this.naturalHeight && this.naturalWidth > 800) {  
				expectWidth = 800;  
				expectHeight = expectWidth * this.naturalHeight / this.naturalWidth;  
			} else if (this.naturalHeight > this.naturalWidth && this.naturalHeight > 1200) {  
				expectHeight = 1200;  
				expectWidth = expectHeight * this.naturalWidth / this.naturalHeight;  
			}  
			//alert(expectWidth+','+expectHeight);  
			//console.log('preimg:'+image.src.length);
			var canvas = document.createElement("canvas");  
			var ctx = canvas.getContext("2d");  
			canvas.width = expectWidth;  
			canvas.height = expectHeight;  
			ctx.drawImage(this, 0, 0, expectWidth, expectHeight);  
			//alert(canvas.width+','+canvas.height);  
			  
			var base64 = null; 
			base64 = canvas.toDataURL("image/jpeg", 1); 
			//console.log(dataURL.length);
			
			$dfd.resolve(base64); 
		}
		return $dfd.promise();
	}
}