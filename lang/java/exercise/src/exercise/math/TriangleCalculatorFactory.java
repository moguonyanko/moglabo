package exercise.math;

public class TriangleCalculatorFactory {
	
	public static TriangleDegreeCalculator createDegreeCalculator(double base, 
		double oblique, double angdeg) {
		return new TriangleDegreeCalculator(base, oblique, angdeg);
	}
	
	public static TriangleRadianCalculator createRadianCalculator(double base, 
		double oblique, double radian){
		return new TriangleRadianCalculator(base, oblique, radian);
	}
	
}
