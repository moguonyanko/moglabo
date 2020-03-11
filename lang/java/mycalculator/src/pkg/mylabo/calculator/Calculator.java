package pkg.mylabo.calculator;

import java.math.BigInteger;
import java.util.stream.Stream;
import java.util.logging.Logger;

/**
 * 参考:
 * http://java.boot.by/ocpjd11-upgrade-guide/ch01s02.html
 */
public class Calculator {
    
    private static final Logger LOG = Logger.getLogger(Calculator.class.getName());
    
    private static final double VERSION = 1.0;

    public static BigInteger add(String ...a) {
        return Stream.of(a).map(BigInteger::new).reduce(BigInteger.ZERO, BigInteger::add);
    }
    
    public static void main(String[] args) {
        System.out.println("Calculator main method v" + VERSION);
        testCalc();
    }
    
    public static void testCalc() {
        LOG.info(add("100", "200", "300").toString());
    }
    
    public static Logger getLogger() {
        return LOG;
    }
    
}
