package exercise.lang.eight;

public interface Taxable {
	default int getAmount(){
		return 0;
	}
}
