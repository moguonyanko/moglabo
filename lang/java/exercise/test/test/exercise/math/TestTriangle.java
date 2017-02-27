package test.exercise.math;

import org.junit.Test;

import exercise.math.TriangleCalculator;
import exercise.math.TriangleCalculatorFactory;
import static org.junit.Assert.assertTrue;

public class TestTriangle {
	
	private static final int PERMISSIBLE_ERRORS = 4;
	
	private boolean isPermissible(double expected, double actual) {
		boolean result = Math.abs((actual * Math.exp(PERMISSIBLE_ERRORS) - 
			expected * Math.exp(PERMISSIBLE_ERRORS))) <= 1;
		
		return result;
	}
	
	@Test
	public void 二辺と一角から三角形の面積を計算できる() {
		TriangleCalculator calculator = 
			TriangleCalculatorFactory.createDegreeCalculator(4, 3, 90);
		
		double expected = 6;
		double actual = calculator.getSize();
		
		assertTrue(isPermissible(expected, actual));
	}
	
	@Test
	public void 二辺と一角から三角形の周の長さを計算できる() {
		TriangleCalculator calculator = 
			TriangleCalculatorFactory.createDegreeCalculator(4, 3, 90);
		
		double expected = 12;
		double actual = calculator.getLength();
		
		assertTrue(isPermissible(expected, actual));
	}
	
	@Test
	public void 二辺と一角から一辺を底辺とした時の三角形の高さを計算できる() {
		TriangleCalculator calculator = 
			TriangleCalculatorFactory.createDegreeCalculator(4, 3, 90);
		
		double expected = 3;
		double actual = calculator.getHeight();
		
		assertTrue(isPermissible(expected, actual));
	}
	
}
