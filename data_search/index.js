var personArray = [
    { name: '刘小华', src: 'touxiang.jpg', sex: 'male', des: '漂亮的女孩子' },
    { name: '王花', src: 'touxiang2.jpg', sex: 'male', des: '漂亮的程序猿' },
    { name: '陈军', src: 'touxiang3.jpg', sex: 'female', des: '我是一个学霸' },
    { name: '王华', src: 'touxiang4.jpg', sex: 'female', des: '我喜欢游泳' },
    { name: '陈思思', src: 'touxiang5.jpg', sex: 'male', des: '我喜欢看电影' }
    

];
var ul = document.getElementsByClassName('textWrapper')[0];
var input = document.getElementsByClassName('leftTop')[0];
var btnArray = [].slice.call(document.getElementsByTagName('span'),0);
var lastBtn = btnArray[2];
var filterSex = "all";
var filterText = "";

function render(data){
    var htmlString = "";
    ul.innerHTML = "";
	data.forEach(function(ele,index,self){
		htmlString = htmlString + '<li>\
		                                <img src =" ' +  ele.src + '" alt = "">\
                                        <span class = "Yourname"> ' + ele.name + '</span>\
                                        <span class = "special"> ' + ele.des + ' </span>\
                                        </li>'
	});
	ul.innerHTML = htmlString;




}

render(personArray);

input.oninput = function(){
	
	 filterText = this.value;
	var newArr  = textFilter(personArray,filterText);
	 var newArr2 = filterBySex(newArr,filterSex);
	  render(newArr2);
}

function textFilter(data1,text){
	if(!text){
		return data1;
	}else{
		return data1.filter(function(ele,index,self){
			return ele.name.indexOf(text) != -1;
		})
	}

 
}

btnArray.forEach(function(ele,index,self){
	ele.onclick = function(){
		changeActive(this);
		 
		  filterSex = this.getAttribute("sex");
		var newArr  = filterBySex(personArray,filterSex);
		 

		var newArr2 = textFilter(newArr,filterText);
	 
		render(newArr2);
	}
})


function changeActive(dom){
     dom.className = "eleActive";
     lastBtn.className = "";
     lastBtn  = dom ;
}
 

function filterBySex(data2,sex){
	if(sex == "all"){
    		return data2;
    	}else{
             return data2.filter(function(ele,index,self){
             	return ele.sex == sex;
    	 
    })
    	}
    
}
