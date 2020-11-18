  pub struct Guess {
    value: u64
  }
  
  impl Guess {
    pub fn new(value: u64) -> Guess {
        let low = 1;
        let high = 100;
        if value < low || high < value {
            panic!("入力値が{}から{}の範囲にありません: {}", low, high, value);
        }
        Guess { value }
    } 
  
    pub fn get_value(&self) -> u64 {
        self.value
    }
  }  
