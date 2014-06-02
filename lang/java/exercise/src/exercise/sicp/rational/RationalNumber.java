package exercise.sicp.rational;

public class RationalNumber implements Rational {

	private final int numer_;
	private final int denom_;

	public RationalNumber(int numer, int denom) {
		this.numer_ = numer;
		this.denom_ = denom;
	}

	@Override
	public int numer() {
		return numer_;
	}

	@Override
	public int denom() {
		return denom_;
	}
	
	@Override
	public boolean equals(Object obj) {
		if (obj == null) {
			return false;
		}

		if (!(obj instanceof RationalNumber)) {
			return false;
		}

		RationalNumber other = (RationalNumber) obj;

		return numer_ == other.numer_ && denom_ == other.denom_;
	}

	@Override
	public int hashCode() {
		int hash = 5;
		hash = 71 * hash + numer_;
		hash = 71 * hash + denom_;

		return hash;
	}

}
