function GetStartMove() {
  return {
    startObj: '',
    startIndex: '',
    startX: 0,   // 触摸位置
    endX: 0,     // 结束位置
    moveX: 0,   // 滑动时的位置
    disX: 0,    // 移动距离
    deleteSlider: ''// 滑动时的效果
  }
}

function getList(oDiv) {
  let arr = [];
  for (let i = 0; i < oDiv.length; i++) {
    arr.push(oDiv[i])
  }
  return arr
}

/**
 * v-leftslidedel 左滑删除效果
 */
export default {
  /**
   *指令的钩子函数
   *
   bind：只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。

   inserted：被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)。

   update：所在组件的 VNode 更新时调用，但是可能发生在其子 VNode 更新之前。指令的值可能发生了改变，也可能没有。
   但是你可以通过比较更新前后的值来忽略不必要的模板更新。

   componentUpdated：指令所在组件的 VNode 及其子 VNode 全部更新后调用。

   unbind：只调用一次，指令与元素解绑时调用。
   */
  bind(el, binding, vnode) {
    /**
     * 指令钩子函数会被传入以下参数：

     el：指令所绑定的元素，可以用来直接操作 DOM 。
     binding：一个对象，包含以下属性：
     name：指令名，不包括 v- 前缀。
     value：指令的绑定值，例如：v-my-directive="1 + 1" 中，绑定值为 2。
     oldValue：指令绑定的前一个值，仅在 update 和 componentUpdated 钩子中可用。无论值是否改变都可用。
     expression：字符串形式的指令表达式。例如 v-my-directive="1 + 1" 中，表达式为 "1 + 1"。
     arg：传给指令的参数，可选。例如 v-my-directive:foo 中，参数为 "foo"。
     modifiers：一个包含修饰符的对象。例如：v-my-directive.foo.bar 中，修饰符对象为 { foo: true, bar: true }。

     vnode：Vue 编译生成的虚拟节点。
     oldVnode：上一个虚拟节点，仅在 update 和 componentUpdated 钩子中可用。
     */
    let oDiv = el   // 当前元素
    let children = Array.from(oDiv.children)
    children.some = Array.prototype.some
    oDiv.style.transition = 'all .3s ease-in-out'
    let startMove = new GetStartMove()
    let startObj = ''
    let obj = vnode.context.$refs[binding.value]
    let arg = children.some((child, childIndex) => {
      const classList = child.classList ? Array.from(child.classList) : []
      if (binding.arg && (classList.indexOf(binding.arg) > -1 || (child.id && child.id.indexOf(binding.arg) > -1))) {
        startObj = child
        return true
      } else if (binding.value && (classList.indexOf(binding.value) > -1 || (child.id && child.id.indexOf(binding.value) > -1))) {
        startObj = child
        return true
      } else {
        return false
      }
    })
    if (arg) {
    } else if (!obj || !obj[0]) {
      return
    } else {
      startObj = obj[0]
    }
    oDiv.addEventListener('touchstart', (ev) => {
      ev = ev || event
      // tounches类数组，等于1时表示此时有只有一只手指在触摸屏幕
      if (ev.touches.length === 1) {
        // 记录开始位置
        startMove.startX = ev.touches[0].clientX
      }
    }, false)
    oDiv.addEventListener('touchmove', (ev) => {
      ev = ev || event
      // 获取删除按钮的宽度，此宽度为滑块左滑的最大距离
      // console.log(binding)
      if (!startObj) {
        return
      }
      let wd = startObj.offsetWidth
      if (ev.touches.length === 1) {
        // 滑动时距离浏览器左侧实时距离
        startMove.moveX = ev.touches[0].clientX
        // 起始位置减去 实时的滑动的距离，得到手指实时偏移距离
        startMove.disX = startMove.startX - startMove.moveX
        // console.log(startMove.disX, startObj, wd);
        // 如果是向右滑动或者不滑动，不改变滑块的位置
        if (startMove.disX < 0 || !startMove.disX) {
          oDiv.style.transform = `translateX(0px)`
          // binding.value({isMove: '0px', startMove: startMove, type: 'touchmove'})//将此时的位置传出去
          // 大于0，表示左滑了，此时滑块开始滑动
        } else if (startMove.disX > 0) {
          // console.log(startMove.disX, wd);
          if (startMove.disX * 5 >= wd) { // 最大也只能等于删除按钮宽度
            oDiv.style.transform = `translateX(-${wd}px)`
            binding.arg && binding.value && binding.value({isMove: `-${wd}px`, startMove: startMove, type: 'touchmove'})// 如果使用的是arg则将此时的位置传出去
          } else { // 具体滑动距离我取的是 手指偏移距离*5。
            oDiv.style.transform = `translateX(-${startMove.disX * 5}px)`
            binding.arg && binding.value && binding.value({
              isMove: `-${startMove.disX * 5}px`,
              startMove: startMove,
              type: 'touchmove'
            })// 如果使用的是arg则将此时的位置传出去
          }
        }
      }
    }, false)
    oDiv.addEventListener('touchend', (ev) => {
      ev = ev || event
      if (!startObj) {
        return
      }
      let wd = startObj.offsetWidth
      if (ev.changedTouches.length === 1) {
        let endX = ev.changedTouches[0].clientX

        startMove.disX = startMove.startX - endX

        // 如果距离小于删除按钮一半,强行回到起点
        if ((startMove.disX * 5) < (wd / 2)) {
          oDiv.style.transform = `translateX(0px)`
          binding.arg && binding.value && binding.value({isMove: `0px`, startMove: startMove, type: 'touchend'})// 如果使用的是arg则将此时的位置传出去
        } else { // 大于一半 滑动到最大值
          oDiv.style.transform = `translateX(-${wd}px)`
          binding.arg && binding.value && binding.value({isMove: `-${wd}px`, startMove: startMove, type: 'touchend'})// 如果使用的是arg则将此时的位置传出去
        }
      }
    }, false)
  },
  update(el, binding, vnode) {

  },
  unbind(el) {
    let oDiv = el
    oDiv.style.transition = 'none'
    oDiv.removeEventListener('touchstart', null, false)
    oDiv.removeEventListener('touchmove', null, false)
    oDiv.removeEventListener('touchend', null, false)
  }

}
