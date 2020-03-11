package pkg.mylabo.worker;

import pkg.mylabo.calculator.Calculator;

public class Worker {
    
    public static void main(String[] args) {
        var logger = Calculator.getLogger();
        logger.info(Calculator.add("123", "456", "789").toString());
    }
    
}
