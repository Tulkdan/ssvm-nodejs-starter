use wasm_bindgen::prelude::*;
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
pub struct HelloWorld {
    pub valid: bool,
    pub value: i32,
}

#[wasm_bindgen]
pub fn say(s: &str) -> String {
    let r = String::from("hello ");
    r + s
}

#[wasm_bindgen]
pub fn receive_array(lista: &[i32]) -> JsValue {
    let example: Vec<HelloWorld> = lista.into_iter().map(|x| HelloWorld { valid: false, value: *x }).collect();
    JsValue::from_serde(&example).unwrap()
}
