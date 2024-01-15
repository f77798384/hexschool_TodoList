//宣告設定
const task = document.querySelector('.task');
const save = document.querySelector('.save');
const tab = document.querySelector('.todolist .tab');
const todolist = document.querySelector('.todolist .list');
const footer = document.querySelector('.footer');
const count = document.querySelector('.footer .Statistics')
let data = JSON.parse(localStorage.getItem('localdata'))||[];
let tabstatus = 'all'
//資料格式
// data = [
//     {
//         content : "資料一",
//         status : false
//     },
//     {
//         content : "資料二",
//         status : false
//     },
//     {
//         content : "資料三",
//         status : false
//     }
//     ]
//     localStorage.localdata =  JSON.stringify(data)
//初始化
renderData();
//資料渲染
function renderData() {
    let str = '';
    //本機資料刷新
    localStorage.setItem('localdata', JSON.stringify(data));
    //透過tabstatus判斷是否要把資料再次渲染
    data.forEach(function(item,index){
        switch(tabstatus){
            case true:
                if(item.status == false){
                    return;
                }
                break;
            case false:
                if(item.status == true){
                    return;
                }
                break;
            case 'all':
                break;
        }
        //attr標籤使用
        let cla_status = {
            checkbox:'',
            box:'',
            content:''
        };
        if (item.status == true){
            cla_status.checkbox = ' checked';
            cla_status.box = ' fa-solid fa-check';
            cla_status.content = ' done';
        }else{
            cla_status.checkbox = '';
            cla_status.box = '';
            cla_status.content = ' undone';
        };
        //加入HTML字串
        str += `
        <li data-num = "${index}">
            <input type="checkbox" name="" id="" class="checkbox" ${cla_status.checkbox}>
            <span class="box ${cla_status.box}">
            </span>
            <span class="content ${cla_status.content}">
                ${item.content}
            </span>                  
            <span class="fun" >
                <button class="fa-solid fa-pencil"></button>
                <button class="del fa-solid fa-x"></button>
            </span>
        </li>`;
    })
    //刷新待完成數量
    let total = data.filter(function(item){
        return item.status == false
    })
    count.textContent = `${total.length} 個待完成項目`
    //顯示於頁面上
    todolist.innerHTML = str;
}
//新增待辦事項
save.addEventListener('click',function (e) {
    if(e.target.nodeName == "BUTTON"){
        if(task.value.trim()==''){
            alert('請輸入資料');
            return;//如果字串為空則返回
        }
        //新增事項預設為未完成
        let obj ={
            content : task.value,
            status : false,
        };       
        data.push(obj);
        task.value ="";
        //點擊後回到input、頂端
        window.location = "#task";
        document.documentElement.scrollTop = 0;
        //刷新頁面
        renderData();
    }    
})
//Enter觸發新增
task.addEventListener("keypress",function(e){
    if(e.key==="Enter"){
        e.preventDefault();
        save.click();
    }
    return;
})
//刪除項目
todolist.addEventListener('click',function(e){
    if(e.target.nodeName!=="BUTTON"||e.target.getAttribute("class")!=="del fa-solid fa-x"){
        return;
    }
    //透過data-num==index來進行刪除
    let num = e.target.closest('li').getAttribute("data-num");
    data.splice(num,1);
    //刷新頁面
    renderData();
})
//編輯項目
todolist.addEventListener('click',function(e){
    if(e.target.nodeName!=="BUTTON"||e.target.getAttribute("class")!=="fa-solid fa-pencil"){
        return;
    }
    let num = e.target.closest('li').getAttribute("data-num");
    let text = prompt("請輸入要變更的內容",data[parseInt(num)].content);
    if(text ==null || text.trim()==""){
        //字傳為空則保留原本內容
        data[parseInt(num)].content;
    }else{
        data[num].content= text;
    }
    //刷新頁面
    renderData();
})
//變更狀態
todolist.addEventListener('click',function(e){
    if(e.target.nodeName !=="INPUT"||e.target.getAttribute("class")!=="checkbox"){
        return;
    }
    let num = e.target.closest('li').getAttribute('data-num');
    //修改data.status後交由renderData刷新
    data[num].status = data[num].status ? false : true;
    //刷新頁面
    renderData();
})
//清除已完成項目
footer.addEventListener('click',function(e){
    if(e.target.nodeName!=="A"||e.target.getAttribute("class")!=="clean"){
        return;
    }
    e.preventDefault();
    //只保留未完成內容回傳給data
    data = data.filter(function(item){
        return item.status == false;
    })
    //刷新頁面
    renderData();
})
//清除所有項目
footer.addEventListener('click',function(e){
    if(e.target.nodeName!=="A"||e.target.getAttribute("class")!=="cleanAll"){
        return;
    }
    e.preventDefault();
    //只保留未完成內容回傳給data
    data = []
    //刷新頁面
    renderData();
})
//頁簽更換
tab.addEventListener('click',function(e){
    switch(e.target.textContent){
        case '全部':
            tabstatus = 'all'
            break;
        case '待完成':
            tabstatus = false
            break;
        case '已完成':
            tabstatus = true
            break;
    }
    if(e.target.nodeName !=="LI"||e.target.getAttribute('class')=='active'){
        return;
    }
    //jQuery切換頁簽class變化
    $(e.target).siblings().removeClass('active');
    e.target.classList.toggle('active');
    //刷新頁面
    renderData();    
})
