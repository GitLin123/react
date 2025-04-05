import { createStore } from "redux"
import { actionType } from "./actionType"
// 初始化数据
const initialState = {
  username: "",
  full_name:"",
  email:"",
  token: "",
  address:"",
  avatar:"",
  phone_number:"",
  id:""
}

function renducer(state = initialState, action) {
  switch (action.type) {
    case actionType.update_info:
      return {...state,
        username: action.username,
        full_name:action.full_name,
        email: action.email,
        address:action.address,
        avatar:action.avatar,
        phone_number:action.phone_number,
        id:action.id
        }
        case actionType.update_token:
            return {...state, token: action.token}
    default:
      return state // 返回值会作为新的state值存到store中
  }
}

// 创建Store来存储这个state
const store = createStore(renducer)

// // 订阅store中数据的变化,当数据变化时会执行回调并返回一个函数，调用就是取消订阅， store.getState()可以拿到store数据
// const unsubscribe = store.subscribe(()=> {
//   console.log("订阅数据的变化:", store.getState())
// })

// const changeName1Action = ((name)=> ({type: 'change_name', name}))
// // 修改store中的数据，只能通过action修改
// store.dispatch(changeName1Action('changeName1')) // 派发action，会给到reducer的参数action

// store.dispatch({type: 'change_name', name: 'changeName2'})

// unsubscribe()
// // 取消订阅后，这里监听不到
// store.dispatch({type: 'change_counter', num: 5})
export default store;