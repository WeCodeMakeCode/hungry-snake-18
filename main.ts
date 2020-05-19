namespace SpriteKind {
    export const snake_body_sprite = SpriteKind.create()
    export const snake_head_sprite = SpriteKind.create()
}
function do_apples () {
    if (n_apples < 4) {
        for (let index = 0; index < Math.randomRange(1, 3); index++) {
            apple_sprite = sprites.create(img`
. . . . . . . e c 7 . . . . . . 
. . . . e e e c 7 7 e e . . . . 
. . c e e e e c 7 e 2 2 e e . . 
. c e e e e e c 6 e e 2 2 2 e . 
. c e e e 2 e c c 2 4 5 4 2 e . 
c e e e 2 2 2 2 2 2 4 5 5 2 2 e 
c e e 2 2 2 2 2 2 2 2 4 4 2 2 e 
c e e 2 2 2 2 2 2 2 2 2 2 2 2 e 
c e e 2 2 2 2 2 2 2 2 2 2 2 2 e 
c e e 2 2 2 2 2 2 2 2 2 2 2 2 e 
c e e 2 2 2 2 2 2 2 2 2 2 4 2 e 
. e e e 2 2 2 2 2 2 2 2 2 4 e . 
. 2 e e 2 2 2 2 2 2 2 2 4 2 e . 
. . 2 e e 2 2 2 2 2 4 4 2 e . . 
. . . 2 2 e e 4 4 4 2 e e . . . 
. . . . . 2 2 e e e e . . . . . 
`, SpriteKind.Food)
            apple_sprite.x = Math.randomRange(8, scene.screenWidth() - 8)
            apple_sprite.y = Math.randomRange(8, scene.screenHeight() - 8)
            n_apples += 1
        }
    }
}
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    snake_direction = 3
})
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    snake_direction = 2
})
function make_snake_head () {
    snake_head_image = image.create(cell_size, cell_size)
    snake_head_image.fill(4)
    snake_head = sprites.create(snake_head_image, SpriteKind.snake_head_sprite)
    snake_head.setFlag(SpriteFlag.StayInScreen, true)
    snake_head.y = scene.screenHeight() / 2 + 10
}
function move_last_body_sprite_to_where_head_was () {
    snake_list.insertAt(0, snake_list.pop())
    snake_list[0].x = head_x_prior
    snake_list[0].y = head_y_prior
}
function move_snake () {
    head_x_prior = snake_head.x
    head_y_prior = snake_head.y
    move_snake_head()
    move_last_body_sprite_to_where_head_was()
}
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    b_go = !(b_go)
})
function make_snake () {
    cell_size = 8
    make_snake_head()
    make_snake_body()
}
function lengthen_snake_by_one_sprite () {
    last_snake_sprite = snake_list[snake_list.length - 1]
    nexts_to_last_snake_sprite = snake_list[snake_list.length - 2]
    if (last_snake_sprite.y < nexts_to_last_snake_sprite.y) {
        add_new_body_sprite_to_end(last_snake_sprite.x, last_snake_sprite.y + 8)
    } else if (last_snake_sprite.x > nexts_to_last_snake_sprite.x) {
        add_new_body_sprite_to_end(last_snake_sprite.x + 8, last_snake_sprite.y)
    } else {
        add_new_body_sprite_to_end(last_snake_sprite.x - 8, last_snake_sprite.y)
    }
}
sprites.onOverlap(SpriteKind.snake_head_sprite, SpriteKind.Food, function (sprite, otherSprite) {
    b_go = false
    info.changeScoreBy(1)
    music.playTone(262, music.beat(BeatFraction.Half))
    otherSprite.destroy(effects.spray, 500)
    n_apples += -1
    lengthen_snake_by_one_sprite()
    do_apples()
    b_go = true
})
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    snake_direction = 1
})
function move_snake_head () {
    if (snake_direction == 0) {
        snake_head.setPosition(head_x_prior, head_y_prior - cell_size)
    } else if (snake_direction == 1) {
        snake_head.setPosition(head_x_prior + cell_size, head_y_prior)
    } else if (snake_direction == 2) {
        snake_head.setPosition(head_x_prior, head_y_prior + cell_size)
    } else {
        snake_head.setPosition(head_x_prior - cell_size, head_y_prior)
    }
}
sprites.onOverlap(SpriteKind.snake_head_sprite, SpriteKind.snake_body_sprite, function (sprite, otherSprite) {
    game.over(false, effects.dissolve)
})
function add_new_body_sprite_to_end (xp: number, yp: number) {
    last_snake_sprite = sprites.create(snake_body_image, SpriteKind.snake_body_sprite)
    last_snake_sprite.setPosition(xp, yp)
    snake_list.push(last_snake_sprite)
}
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    snake_direction = 0
})
function make_snake_body () {
    snake_body_image = image.create(cell_size, cell_size)
    snake_body_image.fill(15)
    snake_list = sprites.allOfKind(SpriteKind.snake_body_sprite)
    y = snake_head.y
    x = snake_head.x
    for (let index = 0; index < 4; index++) {
        y = y + cell_size
        add_new_body_sprite_to_end(x, y)
    }
    for (let index = 0; index < 3; index++) {
        x = x - cell_size
        add_new_body_sprite_to_end(x, y)
    }
}
let x = 0
let y = 0
let snake_body_image: Image = null
let nexts_to_last_snake_sprite: Sprite = null
let last_snake_sprite: Sprite = null
let head_y_prior = 0
let head_x_prior = 0
let snake_list: Sprite[] = []
let snake_head: Sprite = null
let cell_size = 0
let snake_head_image: Image = null
let snake_direction = 0
let apple_sprite: Sprite = null
let n_apples = 0
let b_go = false
b_go = false
scene.setBackgroundColor(6)
info.setScore(0)
make_snake()
n_apples = 0
do_apples()
let move_rate = 500
game.onUpdateInterval(move_rate, function () {
    if (b_go) {
        move_snake()
    }
})
