package exercise.lang.eightmarket;

public interface Taxable {
	default int getAmount(){
		return 0;
	}
}
