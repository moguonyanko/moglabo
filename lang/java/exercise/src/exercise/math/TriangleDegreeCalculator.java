package exercise.math;

public class TriangleDegreeCalculator extends AbstractTriangleCalculator {

	private final double angdeg;
	
	public TriangleDegreeCalculator(double base, double oblique, double angdeg) {
		super(base, oblique);
		this.angdeg = angdeg;
	}
	
	@Override
	public double getRadian() {
		return Math.toRadians(this.angdeg);
	}
	
}
