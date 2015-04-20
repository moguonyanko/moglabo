package exercise.lang;

public interface Taxable extends Amount {
	@Override
	default int getAmount(){
		return 0;
	}
}
