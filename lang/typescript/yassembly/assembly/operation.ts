// Utility module

function add(a: i32, b: i32): i32 {
    return a + b;
}

function sub(a: i32, b: i32): i32 {
    return a - b;
}

function mul(a: i32, b: i32): i32 {
    return a * b;
}

function div(a: f32, b: f32): f32 {
    return a / b;
}

function rem(a: f32, b: f32): f32 {
    return a % b;
}

export {
    add, sub, mul, div, rem
};
