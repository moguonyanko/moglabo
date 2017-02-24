package exercise.math;

public class TriangleRadianCalculator extends AbstractTriangleCalculator {

	private final double radian;
	
	public TriangleRadianCalculator(double base, double oblique, double radian) {
		super(base, oblique);
		this.radian = radian;
	}
	
	@Override
	public double getRadian() {
		return radian;
	}	
	
}
