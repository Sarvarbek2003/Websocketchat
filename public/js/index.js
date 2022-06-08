import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js"
const host = 'http://xostlive.uz:7777'

const btn = document.querySelector('.reply-send')
const usersList = document.querySelector('.sideBar')

const socket = io(host)

let userId = window.localStorage.getItem('userId')
let to_user = window.localStorage.getItem('to_user')

if( userId ) socket.emit('connection', userId)
else window.location = '/auth/login'

;(async()=>{
    const users = await req('/users')
    userRender(users)
})()

btn.addEventListener('click', el => {
    if( !comment.value ) return
    comment.value.trim()
    let obj = {
        from_user_id: userId,
        to_user_id: to_user,
        message: comment.value
    }
	console.log(obj)
    comment.value = null
    socket.emit('msgToServer', obj)
}) 

const userRender = (users) => {
    users.forEach(user => {
        if(user.user_id == userId) return
        let divv = document.createElement('div')
        divv.setAttribute('class','row sideBar-body') 
        divv.innerHTML += ` <div class="row sideBar-body">
            <div class="col-sm-3 col-xs-3 sideBar-avatar">
              <div class="avatar-icon">
                  <img src="https://bootdey.com/img/Content/avatar/avatar1.png">
              </div>
              </div>
              <div class="col-sm-9 col-xs-9 sideBar-main">
              <div class="row">
                  <div class="col-sm-8 col-xs-8 sideBar-name">
                  <span class="name-meta">${user.username}</span>
                  </div>
                  <div class="col-sm-4 col-xs-4 pull-right sideBar-time">
                    <span class="indecator" ${ user.online ? "style = 'background-color: green;'" : null}>
                    </span>
                  </div>
              </div>
              </div>
            </div>
          </div>`
          usersList.append(divv)
          divv.onclick = () => {
              document.querySelector('.heading-name-meta').textContent = user.username
	      let input = document.querySelector('#comment')
	      to_user = user.user_id
              window.localStorage.setItem('to_user', to_user)
              input.removeAttribute('disabled', 'disabled')
              MyChatrRender(user.user_id)
          }
    
        });
}



const MyChatrRender = async(to_userId) => {
    window.localStorage.setItem('to_user', to_userId)
    const res = await req('/mychat', 'POST', {to_user_id: to_userId})
    conversation.innerHTML = null
    res.forEach(el => {
        const [div] = createElements('div')
        if(el.from_id != userId) {
            div.setAttribute('class','row message-body')
            div.innerHTML = `
            <div class="col-sm-12 message-main-receiver">
                <div class="receiver">
                    <div class="message-text">
                        ${el.msg}
                    </div>
                    <span class="message-time pull-right">
                    ${new Date(el.message_time).toLocaleTimeString('uz-UZ')}
                    </span>
                </div>
            </div>`
        } else {
            div.setAttribute('class','row message-body')
            div.innerHTML = `
            <div class="col-sm-12 message-main-sender">
                <div class="sender">
                    <div class="message-text">
                        ${el.msg}
                    </div>
                    <span class="message-time pull-right">
                    ${new Date(el.message_time).toLocaleTimeString('uz-UZ')}
                    </span>
                </div>
            </div>`
        }
        conversation.append(div)
        
    })
}



socket.on('message:ToClient', msg => {
    if(!msg.length) return
	if(msg[0].from_user_id == to_user || msg[0].from_user_id == userId) {
        const [div] = createElements('div')
        if(msg[0].from_user_id == userId){
            div.setAttribute('class','row message-body')
            div.innerHTML = `
            <div class="col-sm-12 message-main-sender">
                <div class="sender">
                    <div class="message-text">
                        ${msg[0].message}
                    </div>
                    <span class="message-time pull-right">
                        ${new Date(msg[0].time).toLocaleTimeString('uz-UZ')}
                    </span>
                </div>
            </div>`
        } else {
            div.setAttribute('class','row message-body')
            div.innerHTML = `
            <div class="col-sm-12 message-main-receiver">
                <div class="receiver">
                    <div class="message-text">
                        ${msg[0].message}
                    </div>
                    <span class="message-time pull-right">
                    ${new Date(msg[0].time).toLocaleTimeString('uz-UZ')}
                    </span>
                </div>
            </div>`
        }
        conversation.append(div)
	}
})

socket.on('online', msg => {
    if(!msg.length) return
    console.log(msg)
    const users = document.querySelectorAll('.sideBar-body')
    const name = document.querySelectorAll('.name-meta')
    const indec = document.querySelectorAll('.indecator')
    users.forEach((element, index) => {
        if(name[index]?.textContent == msg[0].username)
            indec[index].style = "background-color: green;"
    });
})

socket.on('disconnect_user', msg => {
    if(!msg.length) return
    const users = document.querySelectorAll('.sideBar-body')
    const name = document.querySelectorAll('.name-meta')
    const indec = document.querySelectorAll('.indecator')
    users.forEach((element, index) => {
        if(name[index]?.textContent == msg[0].username)
            indec[index].style = "background-color: rgba(123, 122, 122, 0.3)"
    });
})

let div = document.querySelector('.message');
conversation.addEventListener('scroll', el => {
    scrolll = false
    if(div.scrollTop > (div.scrollHeight - div.clientHeight)-50) scrolll = true
})

let scrolll = true
setInterval(() => {
    if(scrolll){
        div.scrollTop = div.scrollHeight - div.clientHeight;
    }
}, 500);
