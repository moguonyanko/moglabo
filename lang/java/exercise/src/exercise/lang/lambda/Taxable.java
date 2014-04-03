package exercise.lang.lambda;

public interface Taxable {
	default int getAmount(){
		return 0;
	}
}
