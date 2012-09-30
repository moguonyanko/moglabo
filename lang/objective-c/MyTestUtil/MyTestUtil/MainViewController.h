//
//  MainViewController.h
//  MyTestUtil
//
//  Created by hisako.yamada on 2012/09/30.
//  Copyright (c) 2012年 mogmog. All rights reserved.
//

#import "FlipsideViewController.h"

@interface MainViewController : UIViewController <FlipsideViewControllerDelegate, UIPopoverControllerDelegate>

@property (strong, nonatomic) UIPopoverController *flipsidePopoverController;

@end
