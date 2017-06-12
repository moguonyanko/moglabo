//
//  ViewController.swift
//  MyFoodTracker
//
//  Reference:
//  Start Developing iOS Apps(Swift) by Apple
//  https://developer.apple.com/library/content/referencelibrary/GettingStarted/DevelopiOSAppsSwift/index.html
//

import UIKit

class ViewController: UIViewController, UITextFieldDelegate {

    //MARK: Properties
    @IBOutlet weak var nameTextField: UITextField!
    @IBOutlet weak var mealNameLabel: UILabel!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        //コールバックを通してユーザーからの入力値を扱う。
        nameTextField.delegate = self
    }
    
    //MARK: UITextFieldDelegate
    func textFieldShouldReturn(_ textField: UITextField) -> Bool {
        //キーボードを隠す。
        textField.resignFirstResponder()
        return true
    }
    
    func textFieldDidEndEditing(_ textField: UITextField) {
        mealNameLabel.text = textField.text
    }
    
    //MARK: Actions
    @IBOutlet weak var setDefaultLabelText: UIButton!
    @IBAction func setDefaultLabelText(_ sender: UIButton) {
        mealNameLabel.text = "オムライス"
    }
    
}

//NEXT: Work with View Controllers

