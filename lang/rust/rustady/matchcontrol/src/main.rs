// 参考
// https://doc.rust-jp.rs/book/second-edition/ch06-02-match.html

#[derive(Debug)]
enum Card {
    King,
    Queen,
    Jack,
    Number(u32)
}

fn to_card_number(card: Card) -> u32 {
    match card {
        Card::King => {
            println!("You are King");
            13
        },
        Card::Queen => 12,
        Card::Jack => 11,
        Card::Number(number) => {
            println!("Card number:{}", number);
            number
        }
    }
}

fn trans(n: i32) {
    match n {
        1 => println!("いち"),
        2 => println!("に"),
        3 => println!("さん"),
        // _ は任意の値を示し、 () で何もしないことを示す。
        _ => ()
    }
}

fn main() {
    println!("{}", to_card_number(Card::King));
    println!("{}", to_card_number(Card::Queen));
    println!("{}", to_card_number(Card::Jack));
    println!("{}", to_card_number(Card::Number(7)));

    for n in 1..5 {
        trans(n);
    }

    let card = Card::Number(1);
    match card {
        Card::Number(num) => println!("{}", num),
        _ => ()
    }

    // matchを使った上の書き方を短くしたもの。
    // あまり短くもなければ読みやすくもない。
    if let Card::Number(num) = card {
        println!("{}", num)
    } else {
        // Does nothing
    }
}
