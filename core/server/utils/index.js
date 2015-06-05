var utils;

utils = {
    'delElByIndex': function (arr,index){
        for(var i=index,len=arr.length-1;i<len&&i>=0;i++)
            arr[i]=arr[i+1];
        arr.length = len;
    }
};

module.exports = utils;