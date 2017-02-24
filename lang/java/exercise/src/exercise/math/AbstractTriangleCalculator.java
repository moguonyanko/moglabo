package exercise.math;

abstract public class AbstractTriangleCalculator implements TriangleCalculator {
	
	private final double base;
	private final double oblique;

	public AbstractTriangleCalculator(double base, double oblique) {
		if (base <= 0 || oblique <= 0) {
			throw new IllegalArgumentException("Sides must be positive");
		}
		
		this.base = base;
		this.oblique = oblique;
	}


	@Override
	public double getBase() {
		return base;
	}

	@Override
	public double getOblique() {
		return oblique;
	}
	
}
