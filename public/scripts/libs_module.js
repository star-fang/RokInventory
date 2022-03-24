export const stringFormatter = (src, ...val) => {
    const args = Array.prototype.slice.call(val, 1);
    return src.replace(/{(\d+)}/g, function(match, number) { 
        return typeof args[number] != 'undefined'
          ? args[number] 
          : match
        ;
      });
};

/*
if (!String.format) {
    String.format = function(format) {
      var args = Array.prototype.slice.call(arguments, 1);
      return format.replace(/{(\d+)}/g, function(match, number) { 
        return typeof args[number] != 'undefined'
          ? args[number] 
          : match
        ;
      });
    };
  }

if (!String.prototype.format) {
    String.prototype.format = () => {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    };
}
*/

/*
Image.prototype.load = (url, progress_callback, onload_callback) => {

    var thisImg = this;
    var xmlHTTP = new XMLHttpRequest();
    xmlHTTP.open('GET', url, true);
    xmlHTTP.responseType = 'arraybuffer';
    xmlHTTP.onload =  (e) => {
        var blob = new Blob([this.response]);
        thisImg.src = window.URL.createObjectURL(blob);
        if (onload_callback != undefined) {
            onload_callback(blob);
        }
    };
    xmlHTTP.onprogress = (e) => {
        thisImg.completedPercentage = parseInt((e.loaded / e.total) * 100);
        if (progress_callback != undefined && progress_callback) {
            progress_callback(thisImg.completedPercentage);
        }
    };
    xmlHTTP.onloadstart = () => {
        thisImg.completedPercentage = 0;
        if (progress_callback != undefined && progress_callback) {
            progress_callback(0);
        }
    };
    xmlHTTP.send();
};
*/