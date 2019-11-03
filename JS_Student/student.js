function init(){
	bindEvent();
	renderTable();
	renderPage();
}
var dialog = document.getElementsByClassName('dialog')[0];
//储存后台的数据
var tableData = [];
var pageinfo = {
	
	presepage:1, //记录当前的页面
	pagesize:2,  //一个页面中显示数据的数量
	 

};
var sum; //记录总数据的长度
transferData('/api/student/findAll','',function(res){
               sum = res.data.length;
		});
var pagesum = Math.ceil(sum / pageinfo.pagesize);//记录总页面

 
		
	 
 
 //绑定点击事件函数
function bindEvent(){
	var manager = document.getElementsByClassName('menu-list')[0];
	manager.addEventListener('click',changeMenu,false);
	var addStudentBtn = document.getElementById('add-student-btn');
	addStudentBtn.addEventListener('click',function(e){
		changeStudent(e,'/api/student/addStudent','add-student-form');
	},false);

	var tbody = document.getElementById('tbody');
	tbody.addEventListener('click',tbodyClick,false);

	var editbtn = document.getElementById('edit-student-btn');
	editbtn.addEventListener('click',function(e){
           changeStudent(e,'/api/student/updateStudent','edit-student-form')
	},false);

	var mask = document.getElementsByClassName('mask')[0];
	 mask.onclick = function (e) {
        dialog.classList.remove('show');
    }




}

//切换左侧导航条样式
function changeMenu(e){
   var domName = e.target;
   if( domName.tagName == 'DD'){
   	 for(var i  = 0 ; i < this.children.length ; i++){
   	 	 this.children[i].classList.remove('active');
   	  
   	 }
   	 e.target.classList.add('active')
   }
   var dataId = domName.getAttribute('data-id');
   var content = document.getElementById(dataId);
   var active = document.getElementsByClassName('content-active');
   for(var i = 0 ; i < active.length; i++){
   	active[i].classList.remove('content-active');
   }
   content.classList.add('content-active');

   if(dataId == "student-list"){
   	renderTable();
   	renderPage();
    
   }
   

}

//渲染数据到行间
function renderTable(){
	transferData('/api/student/findByPage',{page:pageinfo.presepage,size:pageinfo.pagesize},function(res){
         var str = '';
         // console.log(res.data);
         var data = res.data.findByPage;
         tableData = data;

         data.forEach(function(ele,index){
         	str += '<tr>\
         	<td> '+ele.sNo+'</td>\
         	<td>'+ele.name+'</td>\
         	<td>'+(ele.sex ? "女" : "男")+'</td>\
         	<td>'+ele.email+'</td>\
         	<td>'+(new Date().getFullYear() - ele.birth) + '</td>\
         	<td>'+ele.phone+'</td>\
         	<td>'+ele.address+'</td>\
         	<td><button class = "btn edit" data-index = ' +index+'>编辑</button>\
         	     <button class = "btn del" data-index = ' +index+'>删除</button>\
         	     </td>\
         	 </tr>'
         	    
         
         })
         	var tbody = document.getElementById('tbody');
         	tbody.innerHTML = str;
	})
}
 
//增加和编辑学生数据 
function changeStudent(e,url,id){
	e.preventDefault();
	var form = document.getElementById(id);
	var data = getFormData(form);
	var key = regDisplay(data);//调用数据校验函数
	if(!data){
	  return false;
	}
	 var msg = '';
    if (id == 'edit-student-form') {
        msg = '是否更新数据?';
    } else {
        msg = '提交成功, 是否跳转页面？'
    }

    //判断输入的数据是否符合标准，符合则渲染
    if(key){  
    	transferData(url,data,function(){
		var isTurnPage = confirm(msg);
		if(isTurnPage){
			var list = document.getElementsByClassName('list')[0];
			

			sum++;
			pagesum = Math.ceil(sum / pageinfo.pagesize);
			renderPage();
			list.click();
			lastpage.click();
			if (id == 'edit-student-form') {
                var mask = document.getElementsByClassName('mask')[0];
                mask.click();
            }
		}
		form.reset();
	})

    }

	

} 

// function addStudent(e){
// 	var form = document.getElementById('add-student-form');
// 	e.preventDefault();
// 	var data = getFormData(form);
// 	if(!data){
// 		return false;
// 	}

//     transferData('/api/student/addStudent',data,function(){
//     	var isTurnPage = confirm('提交成功，是否跳转界面');
//     	if(isTurnPage){
//     		var studentListTab = document.getElementsByClassName('list')[0];
//     		studentListTab.click();
//     	}else{
//     		form.reset();
//     	}
 	
//  })

// }

// function editStudent(){
// 	var form = document.getElementById('edit-student-form');
// 	e.preventDefault();
// 	var data = getFormData(form);
// 	transferData('/api/student/updateStudent',data,function(){
// 		var isTurnPage = confirm("修改成功，是否跳转界面");
// 		if(isTurnPage){
// 			var studentListTab = document.getElementsByClassName('list')[0];
//     		studentListTab.click();
// 		}
// 		form.reset();
// 	})
// }
//数据校验函数
function regDisplay(data,url){
	var regname = /^[\u4E00-\u9FA5]{2,4}$/g;
	var regsNo = /\D+/g;
	var regEmail = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/g;
	var regphone = /^[1][3,4,5,7,8][0-9]{9}$/g;
	var regadress = /[\u4E00-\u9FA50-9]+/g;
    if(!regname.test(data.name)){
       alert('请输入正确的名字字符');
       return false;
    }else if(regsNo.test(data.sNo)){
    	alert("请输入正确的学号");
    	return false;
    }else if(!regEmail.test(data.email)){
    	alert("请输入正确的邮箱");
    	return false;
    }else if(data.birth > new Date().getFullYear() || data.birth < 1900){
        alert("请输入正确的生日日期");
        return false;

    }else if(!regphone.test(data.phone)){
        alert("请输入正确的电话号码格式");
        return false;
    }else if(!regadress.test(data.address)){
    	alert("请输入正确的地址");
    	return false;
    }else{
    	return true;
    }

}

//给表单绑定点击事件用于编辑和删除数据
function tbodyClick(e){
 
  var tagName = e.target.tagName.toLowerCase();
  if(tagName != 'button'){
  	return false;
  }
  var edit = e.target.className.indexOf('edit') > -1;
  var del = e.target.className.indexOf('del') > -1;
  var index = e.target.getAttribute('data-index');
  if(edit){
  	dialog.classList.add('show');
  	renderForm(tableData[index]);
  }else if(del){
  	var confirmDel = confirm("是否确认删除？");
  	if(confirmDel){
  		transferData('/api/student/delBySno',{sNo:tableData[index].sNo},function(){
  			alert('已删除');
  			sum --;
  			if(sum % pageinfo.pagesize == 0){
  				var prepage = document.getElementById('prepage');
                prepage.click();
                pagesum --;
  			}
            

  			console.log(sum);
  			var list = document.getElementsByClassName('list')[0];
  			list.click();
  		})
  	}
  }
 

}

function renderForm(data){
   
    var form = document.getElementById('edit-student-form');
    for(var prop in data){
    	if(form[prop]){ //过滤data中form表单不含有的属性
            form[prop].value = data[prop];

    	}
    }
} 

//渲染页面切换功能
function renderPage(){
	var pagefind = document.getElementsByClassName('page-find')[0];
	pagefind.innerHTML = "";
	pagefind.innerHTML += '<a href = "#" id = "first">首页</a>';
	 
	 if( sum > pageinfo.pagesize){
	 	pagefind.innerHTML += '<a href="#" id = "nextpage">下一页</a>';
		pagefind.innerHTML += '<a href = "#" id = "prepage">上一页</a>';
		pagefind.innerHTML += '<input type = "text"  id = "inputpage"><button id = "turnpage">跳转</button>';
	    pagefind.innerHTML +='<a href = "#" id = "lastpage">尾页</a>';
	 }
	 pagefind.innerHTML += '<a href = "#">第' + pageinfo.presepage + '页</a>';
	 pagefind.innerHTML += '<a href = "#">共' + pagesum + '页</a>';
	pagefind.innerHTML += '<a href = "#">一页显示数据<input type = "text"  id = "inputdatanum"><button id = "turnnum">确定</button></a>';
		
	 
	
 
	 
	var first = document.getElementById('first');
	if(first){
		first.addEventListener('click',function(){
    	pageinfo.presepage = 1;
    	renderTable();
    	renderPage();
      },false)
	}
    

    var nextpage = document.getElementById('nextpage');
    if(nextpage){
    	nextpage.addEventListener('click',function(){
    	if(pageinfo.presepage < pagesum){
    	    pageinfo.presepage ++;
    	    

    	}
    		renderTable();
    		renderPage();
    },false)
    }

    var prepage = document.getElementById('prepage');
    if(prepage){
    	prepage.addEventListener('click',function(){
      if(pageinfo.presepage > 1){
            pageinfo.presepage --;
            renderTable();
            renderPage();
         }else{
         alert('该页为首页');
         }
    		
    	})
    }
    	


    	var lastpage = document.getElementById('lastpage');
    	if(lastpage){
    		lastpage.addEventListener('click',function(){
    		pageinfo.presepage = pagesum;
    		renderTable();
    		renderPage();
    	})
    	}
    	

    	var turnpage = document.getElementById('turnpage');
    	var inputpage = document.getElementById('inputpage');
    	if(turnpage){
    		turnpage.addEventListener('click',function(){
    		
    		
    		if(inputpage.value < pagesum && inputpage.value > 0){
    			pageinfo.presepage = parseInt(inputpage.value);
    		  
    		}else if(inputpage.value < 0){
    			pageinfo.presepage = 1;
    		}else if(inputpage.value > pagesum){
    			pageinfo.presepage = pagesum;
    			
    		}
    		
    		renderTable();
    		renderPage();

    	   })
    	}

    	var inputdatanum = document.getElementById('inputdatanum');
    	var turnnum = document.getElementById('turnnum');
    	if(turnnum){
    		turnnum.addEventListener('click',function(){
    		if(inputdatanum.value <= 10 && inputdatanum.value > 0){
    			pageinfo.pagesize = parseInt(inputdatanum.value);
    		  
    		}else if(inputdatanum.value < 0){
    			pageinfo.pagesize = 1;
    		}else if(inputdatanum.value > 10){
    			pageinfo.pagesize = 10;
    			
    		}
			pagesum = Math.ceil(sum / pageinfo.pagesize);//记录总页面
    		
    		renderTable();
    		renderPage();

    	   })
    	}

    	

    

}







function getFormData(form){
  var name = form.name.value;
  var sex = form.sex.value;
  var sNo = form.sNo.value;
  var email = form.email.value;
  var birth = form.birth.value;
  var phone = form.phone.value;
  var address = form.address.value;
  if(!name || !sex || !sNo || !email || !birth || !phone || !address){
  	alert('部分数据未填写，请填写完成后提交');
  	return false;
  }
  return {
  	name:name,
  	sex:sex,
  	sNo:sNo,
  	email:email,
  	birth:birth,
  	phone:phone,
  	address:address
  }



}



function transferData(url, data, cb) {

    if (!data) {
        data = {};
    }
    var result = saveData('http://api.duyiedu.com' + url, Object.assign(data, {
        appkey: 'dongmeiqi_1547441744650'
    }));
    if (result.status == 'success') {
        cb(result);
    } else {
        alert(result.msg);
    }

}

function saveData(url, param) {
    var result = null;
    var xhr = null;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }
    if (typeof param == 'string') {
        xhr.open('GET', url + '?' + param, false);
    } else if (typeof param == 'object'){
        var str = "";
        for (var prop in param) {
            str += prop + '=' + param[prop] + '&';
        }
        xhr.open('GET', url + '?' + str, false);
    } else {
        xhr.open('GET', url + '?' + param.toString(), false);
    }
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                result = JSON.parse(xhr.responseText);
            }
        }
    }
    xhr.send();
    return result;
}
init()