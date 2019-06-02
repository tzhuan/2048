let colors = {
  2: 'rgb(238, 228, 218)',
  4: 'rgb(237, 224, 200)',
  8: 'rgb(242, 177, 121)',
  16: 'rgb(245, 149, 99)',
  32: 'rgb(246, 124, 95)',
  64: 'rgb(246, 94, 59)',
  128: 'rgb(237, 207, 114)',
  256: 'rgb(237, 204, 97)',
  512: 'rgb(237, 200, 80)',
  1024: 'rgb(237, 197, 63)',
  2048: 'rgb(237, 194, 46)',
}
// box-shadow: 0 0 30px 10px rgba(243, 215, 116, 0.47619), inset 0 0 0 1px rgba(255, 255, 255, 0.28571);
let N = [
// column: 直排
// row: 橫排
// 0  1  2  3
  [0, 0, 0, 0], // 0  N[0][0], N[0][1], N[0][2], N[0][3]
  [0, 0, 0, 0], // 1  N[1][0], N[1][1], N[1][2], N[1][3]
  [0, 0, 0, 0], // 2  N[2][0], N[2][1], N[2][2], N[2][3]
  [0, 0, 0, 0], // 3  N[3][0], N[3][1], N[3][2], N[3][3]
]

let inited = false
function init () {
  if (inited) {
    return
  }

  random(true)
  random(true)
  print()
  inited = true

  /*
  document.getElementById('up').onclick = function (e) { goUp() }
  document.getElementById('down').onclick = function (e) { goDown() }
  document.getElementById('left').onclick = function (e) { goLeft() }
  document.getElementById('right').onclick = function (e) { goRight() }
  */

  registerTouchSwipe()
  registerKeydown()
}

function registerTouchSwipe () {
  let inner = document.getElementById('inner')
  let touchsurface = document.getElementById('board')
  let x = null
  let y = null

  touchsurface.addEventListener('touchstart', function(e){
    var obj = e.changedTouches[0]
    x = obj.pageX
    y = obj.pageY
    e.preventDefault()
  }, false)

  touchsurface.addEventListener('touchmove', function(e){
    var obj = e.changedTouches[0]
    e.preventDefault() // prevent scrolling when inside DIV
  }, false)

  touchsurface.addEventListener('touchend', function(e){
    let obj = e.changedTouches[0]
    let dx = obj.pageX - x
    let dy = obj.pageY - y

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) {
        goLeft()
      } else if (dx > 0) {
        goRight()
      }
    } else {
      if (dy < 0) {
        goUp()
      } else if (dy > 0) {
        goDown()
      }
    }
    e.preventDefault()
  }, false)
}

function registerKeydown () {
  window.onkeydown = function (e) {
    if (e.code === 'ArrowUp') {
      goUp()
    } else if (e.code === 'ArrowDown') {
      goDown()
    } else if (e.code === 'ArrowLeft') {
      goLeft()
    } else if (e.code === 'ArrowRight') {
      goRight()
    }
  }
}

function padNumber (n) {
  if (n === 0) return '    '
  if (n >= 1000) return `${n}`
  if (n >= 100) return ` ${n}`
  if (n >= 10) return `  ${n}`
  return `   ${n}`
}

function print () {
  let cells = document.querySelectorAll('div.cell')
  for (let i = 0; i < cells.length; i = i + 1) {
    let r = Math.floor(i / 4)
    let c = i % 4
    // console.log(cells[i].textContent)
    if (N[r][c] > 0) {
      cells[i].innerHTML = N[r][c]
      cells[i].style.backgroundColor = colors[ N[r][c] ]
    } else {
      cells[i].innerHTML = ''
      cells[i].style.backgroundColor = 'rgba(238, 228, 218, 0.35)'
    }
    if (N[r][c] >= 8) {
      cells[i].style.color = 'white'
    } else {
      cells[i].style.color = 'black'
    }
  }

  /*
  let lines = []
  for (const ns of N) {
    let numbers = []
    for (const n of ns) {
      numbers.push(padNumber(n))
    }
    lines.push('+----+----+----+----+')
    lines.push('|' + numbers.join('|') + '|')
  }
  lines.push('+----+----+----+----+')
  console.log(lines.join('\n'))
  */
}

// isGoable{Up,Down,Left,Right} {{{
function isGoableUpDown (begin, end, step) {
  for (let c = 0; c < 4; c = c + 1) {

    let meetEmpty = false
    for (let r = begin; r !== end; r = r + step) {
      if (N[r][c] === 0) {
        meetEmpty = true
      }
      if (N[r][c] > 0 && meetEmpty) {
        return true
      }
    }

    for (let r = begin; r !== end - step; r = r + step) {
      if (N[r][c] > 0 && N[r][c] === N[r + step][c]) {
        return true
      }
    }

  }

  return false
}

function isGoableUp () {
  return isGoableUpDown(0, 4, 1)
}

function isGoableDown () {
  return isGoableUpDown(3, -1, -1)
}

function isGoableLeftRight (begin, end, step) {
  for (let r = 0; r < 4; r = r + 1) {
    let meetEmpty = false
    for (let c = begin; c !== end; c = c + step) {
      if (N[r][c] === 0) {
        meetEmpty = true
      }
      if (N[r][c] > 0 && meetEmpty) {
        return true
      }
    }

    for (let c = begin; c !== end - step; c = c + step) {
      if (N[r][c] > 0 && N[r][c] === N[r][c + step]) {
        return true
      }
    }
  }

  return false
}

function isGoableLeft () {
  return isGoableLeftRight(0, 4, 1)
}

function isGoableRight () {
  return isGoableLeftRight(3, -1, -1)
}
// }}}

// merge {{{
function mergeUpDown (begin, end, step) {
  for (let c = 0; c < 4; c = c + 1) {
    for (let r = begin; r !== end; r = r + step) {
      if (N[r][c] === N[r + step][c]) {
        N[r][c] = N[r][c] + N[r][c]
        N[r + step][c] = 0
      }
    }
  }
}

function mergeUp () {
  mergeUpDown(0, 3, 1)
}

function mergeDown () {
  mergeUpDown(3, 0, -1)
}

function mergeLeftRight (begin, end, step) {
  for (let r = 0; r < 4; r = r + 1) {
    for (let c = begin; c !== end; c = c + step) {
      if (N[r][c] === N[r][c + step]) {
        N[r][c] = N[r][c] + N[r][c]
        N[r][c + step] = 0
      }
    }
  }
}

function mergeLeft () {
  mergeLeftRight(0, 3, 1)
}

function mergeRight () {
  mergeLeftRight(3, 0, -1)
}
// }}}

// move {{{
function moveUpDown (begin, end, step) {
  for (let c = 0; c < 4; c = c + 1) {
    let target = null
    for (let r = begin; r !== end; r = r + step) {
      let n = N[r][c]
      if (n === 0 && target === null) target = r
      if (n > 0 && target !== null) {
        N[target][c] = N[r][c]
        N[r][c] = 0
        target = target + step
      }
    }
  }
}

function moveUp () {
  moveUpDown(0, 4, 1)
}

function moveDown () {
  moveUpDown(3, -1, -1)
}

function moveLeftRight (begin, end, step) {
  for (let r = 0; r < 4; r = r + 1) {
    let target = null
    for (let c = begin; c !== end; c = c + step) {
      let n = N[r][c]
      if (n === 0 && target === null) target = c
      if (n > 0 && target !== null) {
        N[r][target] = N[r][c]
        N[r][c] = 0
        target = target + step
      }
    }
  }
}

function moveLeft () {
  moveLeftRight(0, 4, 1)
}

function moveRight () {
  moveLeftRight(3, -1, -1)
}
// }}}

function isFull () {
  for (let r = 0; r < 4; r = r + 1) {
    for (let c = 0; c < 4; c = c + 1) {
      if (N[r][c] === 0) {
        return false
      }
    }
  }
  return true
}

function isMergeable () {
  // 寫在一起
  for (let r = 0; r < 4; r = r + 1) {
    for (let c = 0; c < 4; c = c + 1) {
      // 檢查左右相鄰是否有值且相同
      if (c + 1 < 4 && N[r][c] > 0 && N[r][c] === N[r][c + 1]) {
        return true
      }

      // 檢查上下相鄰是否有值且相同
      if (r + 1 < 4 && N[r][c] > 0 && N[r][c] === N[r + 1][c]) {
        return true
      }
    }
  }

  /*
  // 分開寫：檢查左右相鄰是否有值且相同
  for (let r = 0; r < 4; r = r + 1) {
    for (let c = 0; c < 3; c = c + 1) {
      if (N[r][c] > 0 && N[r][c] === N[r][c + 1]) {
        return true
      }
    }
  }

  // 分開寫：檢查上下相鄰是否有值且相同
  for (let r = 0; r < 3; r = r + 1) {
    for (let c = 0; c < 4; c = c + 1) {
      if (N[r][c] > 0 && N[r][c] === N[r + 1][c]) {
        return true
      }
    }
  }
  */

  return false
}

function isGameover () {
  // return isGoableUp() || isGoableDown() || isGoableLeft() || isGoableRight()
  return isFull() && !isMergeable()
}

function random2or4 (only2) {
  // 直接回傳 2
  if (only2) {
    return 2
  }

  // 隨機決定要放 2 還是 4
  if (Math.random() >= 0.5) {
    return 2
  } else {
    return 4
  }
}

function random (only2) {
  // 先把空的取出來
  let rows = []
  let columns = []
  for (let r = 0; r < 4; r = r + 1) {
    for (let c = 0; c < 4; c = c + 1) {
      if (N[r][c] === 0) {
        rows.push(r)
        columns.push(c)
      }
    }
  }

  // 隨機選一個
  let i = Math.floor(Math.random() * rows.length)
  let r = rows[i]
  let c = columns[i]

  // 放上去！
  N[r][c] = random2or4(only2)
}

function checkGameover () {
  if (isGameover()) {
    let modal = document.getElementById('game-over')
    modal.style.display = 'block'
    return true
  }
  return false
}

function go (check, move, merge) {
  if (check()) {
    move()
    merge()
    move()
    print()
    if (!checkGameover()) {
      random(false)
      print()
      checkGameover()
    }
  }
}

function goUp () {
  go(isGoableUp, moveUp, mergeUp)
}

function goDown () {
  go(isGoableDown, moveDown, mergeDown)
}

function goLeft () {
  go(isGoableLeft, moveLeft, mergeLeft)
}

function goRight () {
  go(isGoableRight, moveRight, mergeRight)
}

window.onload = init
